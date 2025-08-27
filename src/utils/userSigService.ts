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
 * Local UserSig generation has been removed for security reasons.
 * All UserSig generation is now handled server-side via Supabase Edge Functions.
 */

/**
 * Production-ready UserSig generation
 * All UserSig generation is now handled securely server-side via Supabase Edge Functions
 */
export const generateUserSig = async (userID: string): Promise<UserSigData> => {
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
};
