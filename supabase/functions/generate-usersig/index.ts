// Supabase Edge Function for generating UserSig
// This code is designed to run in Supabase Edge Functions environment
// Note: The npm: import will work in Supabase Edge Functions but may show TypeScript errors locally

// @ts-ignore - npm: imports are valid in Deno/Supabase Edge Functions
import { createClient } from 'npm:@supabase/supabase-js@2'

// TypeScript declarations for Deno global in Edge Functions
declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

// UserID conversion function: Convert Supabase UUID to TUICallKit compatible format
function convertSupabaseIdToTUICallId(supabaseUserId: string): string {
  const cleanedId = supabaseUserId.replace(/-/g, '');
  return cleanedId.substring(0, 8);
}

// Validate if it's a valid converted UserID
function isConvertedUserId(userId: string): boolean {
  return userId.length === 8 && /^[a-zA-Z0-9]+$/.test(userId);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Base64URL encoding utility function
function base64urlEscape(str: string): string {
  return str.replace(/\+/g, '*')
    .replace(/\//g, '-')
    .replace(/=/g, '_');
}

// Deflate compression using Deno/Web API
async function compressWithDeflate(data: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const input = encoder.encode(data);
  
  // Use CompressionStream (Web Streams API)
  const cs = new CompressionStream('deflate');
  const writer = cs.writable.getWriter();
  const reader = cs.readable.getReader();
  
  // Write data
  writer.write(input);
  writer.close();
  
  // Read compression result
  const chunks: Uint8Array[] = [];
  let done = false;
  
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      chunks.push(value);
    }
  }
  
  // Merge all chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
}

// Tencent Cloud official UserSig generation algorithm - TLS Sig API v2
async function generateUserSig(identifier: string, sdkappid: number, key: string, expire = 604800): Promise<string> {
  const currTime = Math.floor(Date.now() / 1000);
  
  // Construct content to be signed - strictly follow official format
  let contentToBeSigned = "TLS.identifier:" + identifier + "\n";
  contentToBeSigned += "TLS.sdkappid:" + sdkappid + "\n";
  contentToBeSigned += "TLS.time:" + currTime + "\n";
  contentToBeSigned += "TLS.expire:" + expire + "\n";
  
  console.log(`🔐 Content to be signed:\n${contentToBeSigned}`);
  
  // Calculate signature using HMAC-SHA256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(contentToBeSigned);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  console.log(`🔑 HMAC-SHA256 signature: ${base64Signature}`);
  
  // Construct JSON data
  const jsonData = {
    "TLS.ver": "2.0",
    "TLS.identifier": identifier,
    "TLS.sdkappid": sdkappid,
    "TLS.expire": expire,
    "TLS.time": currTime,
    "TLS.sig": base64Signature
  };
  
  const jsonString = JSON.stringify(jsonData);
  console.log(`📝 JSON data: ${jsonString}`);
  
  // Use Deno's compression API for zlib compression
  const compressedData = await compressWithDeflate(jsonString);
  
  // Base64URL encoding
  const base64Data = btoa(String.fromCharCode(...compressedData));
  const userSig = base64urlEscape(base64Data);
  
  console.log(`✅ Generated UserSig: ${userSig.substring(0, 50)}... (length: ${userSig.length})`);
  
  return userSig;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate HTTP method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Parse request body
    const { userID } = await req.json()
    
    if (!userID) {
      throw new Error('Missing userID parameter')
    }
    
    console.log(`📋 UserID validation:`, {
      received: userID,
      authenticatedUser: user.id,
      isConverted: isConvertedUserId(userID),
      expectedConverted: convertSupabaseIdToTUICallId(user.id)
    });
    
    // Validate UserID: support original UUID or converted ID
    let finalUserID = userID;
    if (isConvertedUserId(userID)) {
      // If it's a converted ID, verify it matches the current user
      const expectedConverted = convertSupabaseIdToTUICallId(user.id);
      if (userID !== expectedConverted) {
        throw new Error(`Converted UserID mismatch. Expected: ${expectedConverted}, Got: ${userID}`);
      }
      console.log(`✅ Using converted UserID: ${userID} for Supabase user: ${user.id}`);
    } else {
      // If it's the original UUID, validate directly
      if (userID !== user.id) {
        throw new Error('UserID mismatch - you can only generate UserSig for yourself');
      }
      // Convert to TUICallKit compatible format
      finalUserID = convertSupabaseIdToTUICallId(userID);
      console.log(`🔄 Converted UUID ${userID} to TUICallKit ID: ${finalUserID}`);
    }

    // Get Tencent Cloud configuration from environment
    const sdkAppID = Number(Deno.env.get('TENCENT_SDKAPPID'))
    const secretKey = Deno.env.get('TENCENT_SECRETKEY')
    
    if (!sdkAppID || !secretKey) {
      console.error('Missing Tencent configuration:', { 
        hasSdkAppID: !!sdkAppID, 
        hasSecretKey: !!secretKey 
      })
      throw new Error('Missing Tencent Cloud configuration')
    }

    // Generate UserSig using the final converted UserID
    console.log(`🔐 Generating UserSig for TUICallKit user: ${finalUserID}, sdkAppID: ${sdkAppID}`)
    const userSig = await generateUserSig(finalUserID, sdkAppID, secretKey)
    const expireTime = Math.floor(Date.now() / 1000) + 604800 // 7 days

    const responseData = {
      userID: finalUserID, // Return converted UserID
      sdkAppID,
      userSig,
      expireTime,
      generatedAt: new Date().toISOString(),
      originalSupabaseUserId: user.id, // Record original Supabase ID for debugging
    }

    console.log(`✅ UserSig generated successfully for TUICallKit user: ${finalUserID} (Supabase: ${user.id})`)

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in generate-usersig function:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = errorMessage.includes('not authenticated') ? 401 :
                      errorMessage.includes('Method not allowed') ? 405 :
                      errorMessage.includes('Missing') ? 400 : 500

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})