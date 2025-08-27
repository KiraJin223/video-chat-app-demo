import { getSupabase } from './supabase';

interface UserSigData {
  userID: string;
  sdkAppID: number;
  userSig: string;
  expireTime: number;
}

// UserSigResponse interface removed as it's not used directly in client code

/**
 * Securely generate UserSig from server
 * @param userID User ID
 * @returns UserSig information
 */
export const generateUserSigFromServer = async (userID: string): Promise<UserSigData> => {
  try {
    const supabase = getSupabase();
    
    // Get current user's session token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('User not authenticated');
    }

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-usersig', {
      body: { userID },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw new Error(`Function invocation failed: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Unknown server error');
    }

    return data.data;
  } catch (error) {
    console.error('❌ Failed to generate UserSig from server:', error);
    throw error;
  }
};

/**
 * Local UserSig generation for debugging (development only)
 */
export const generateUserSigLocal = async (userID: string): Promise<UserSigData> => {
  // Only use in development environment
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Local UserSig generation is only allowed in development');
  }

  const { genTestUserSig } = await import('../debug/GenerateTestUserSig-es.js');
  
  const sdkAppId = Number(process.env.REACT_APP_TENCENT_SDKAPPID);
  const secretKey = process.env.REACT_APP_TENCENT_SECRETKEY || '';
  
  if (!sdkAppId || !secretKey) {
    throw new Error('Missing Tencent Cloud configuration');
  }

  const { userSig } = genTestUserSig({
    userID,
    SDKAppID: sdkAppId,
    SecretKey: secretKey,
  });

  return {
    userID,
    sdkAppID: sdkAppId,
    userSig,
    expireTime: Math.floor(Date.now() / 1000) + 604800,
  };
};

/**
 * Intelligent UserSig generation method selection
 * Production environment uses server-side generation, development environment can choose local generation
 */
export const generateUserSig = async (userID: string, forceLocal = false): Promise<UserSigData> => {
  // Production-grade implementation: prioritize server-side generation
  if (!forceLocal) {
    console.log('🔒 Using secure server-side UserSig generation (production-ready)');
    
    try {
      return await generateUserSigFromServer(userID);
    } catch (error) {
      console.error('❌ Server-side UserSig generation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Detailed server-side error analysis
      let helpfulMessage = `Server-side UserSig generation failed: ${errorMessage}`;
      
      if (errorMessage.includes('Function not found')) {
        helpfulMessage += '\n\n🔧 Solutions:\n1. Confirm Edge Function "generate-usersig" is deployed\n2. Check function name is correct\n3. Verify Supabase project configuration';
      } else if (errorMessage.includes('not authenticated')) {
        helpfulMessage += '\n\n🔧 Solutions:\n1. Check Supabase user authentication\n2. Confirm session is valid\n3. Try logging in again';
      } else if (errorMessage.includes('Missing Tencent Cloud configuration')) {
        helpfulMessage += '\n\n🔧 Solutions:\n1. Set environment variables in Supabase Dashboard\n2. TENCENT_SDKAPPID=20026685\n3. TENCENT_SECRETKEY=your-secret-key\n4. Redeploy function';
      } else if (errorMessage.includes('UserID mismatch')) {
        helpfulMessage += '\n\n🔧 Possible causes:\n1. UserID conversion issue\n2. Please check input UserID format\n3. Confirm user authentication status';
      }
      
      console.log('📋 Server-side error details:', helpfulMessage);
      throw new Error(helpfulMessage);
    }
  }

  // Development environment fallback (only when explicitly requesting local generation)
  if (process.env.NODE_ENV === 'development' && forceLocal && process.env.REACT_APP_TENCENT_SECRETKEY) {
    console.log('🔧 Using local UserSig generation (development fallback only)');
    return generateUserSigLocal(userID);
  }

  // If no local configuration and forced local
  throw new Error('Local UserSig generation not available. Please use server-side generation or add REACT_APP_TENCENT_SECRETKEY for development.');
};
