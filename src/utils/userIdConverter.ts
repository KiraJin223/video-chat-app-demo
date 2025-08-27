/**
 * UserID Conversion Utilities
 * Convert Supabase UUID to TUICallKit compatible UserID
 */

/**
 * Convert Supabase User ID to TUICallKit compatible UserID
 * @param supabaseUserId Supabase User ID (UUID format)
 * @returns TUICallKit compatible User ID
 */
export function convertSupabaseIdToTUICallId(supabaseUserId: string): string {
  // Remove hyphens and take first 8 characters for uniqueness and compatibility
  const cleanId = supabaseUserId.replace(/-/g, '').substring(0, 8);
  
  console.log('🔄 UserID Conversion:', {
    original: supabaseUserId,
    converted: cleanId,
    originalLength: supabaseUserId.length,
    convertedLength: cleanId.length
  });
  
  return cleanId;
}

/**
 * Validate TUICallKit UserID format
 * @param userId User ID to validate
 * @returns Whether the UserID is valid
 */
export function validateTUICallUserId(userId: string): boolean {
  // TUICallKit UserID requirements:
  // 1. Length: 1-32 characters
  // 2. Only allow letters, numbers, underscores
  const isValidLength = userId.length >= 1 && userId.length <= 32;
  const isValidChars = /^[a-zA-Z0-9_]+$/.test(userId);
  
  const isValid = isValidLength && isValidChars;
  
  console.log('✅ UserID Validation:', {
    userId,
    length: userId.length,
    validLength: isValidLength,
    validChars: isValidChars,
    overall: isValid
  });
  
  return isValid;
}
