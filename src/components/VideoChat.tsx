import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  useToast,
  Heading,
  Text,
  Badge,
  Container,
  IconButton,
  Tooltip,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { TUICallKit, TUICallKitServer, CallMediaType } from '@tencentcloud/call-uikit-react';
import { getSupabase } from '../utils/supabase';
import { generateUserSig } from '../utils/userSigService';
import { convertSupabaseIdToTUICallId, validateTUICallUserId } from '../utils/userIdConverter';
import { useNavigate } from 'react-router-dom';

const VideoChat: React.FC = () => {
  const [targetUserId, setTargetUserId] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [initStatus, setInitStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userSigInfo, setUserSigInfo] = useState<{
    tuiCallUserId: string;
    supabaseUserId: string;
    sdkAppId: number;
    userSig: string;
    userSigLength: number;
    expireTime: string;
    source: string;
  } | null>(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }
      setCurrentUser(user);

      // Convert Supabase User ID to TUICallKit compatible format
      const tuiCallUserId = convertSupabaseIdToTUICallId(user.id);
      
      console.log('🔧 Debug Info:', {
        supabaseUserId: user.id,
        tuiCallUserId: tuiCallUserId,
        userEmail: user.email,
        environment: process.env.NODE_ENV
      });

      // Validate the converted UserID
      if (!validateTUICallUserId(tuiCallUserId)) {
        throw new Error(`Invalid TUICall UserID: ${tuiCallUserId}`);
      }

      // Use production-grade server-side UserSig generation
      console.log('🔒 Using production server-side UserSig generation');
      const sigResult = await generateUserSig(tuiCallUserId, false); // false = server-side generation

      if (!sigResult) {
        throw new Error('Failed to generate UserSig');
      }

      const sigInfo = {
        supabaseUserId: user.id,
        tuiCallUserId: tuiCallUserId,
        sdkAppId: sigResult.sdkAppID,
        userSig: sigResult.userSig,
        userSigLength: sigResult.userSig?.length || 0,
        expireTime: new Date(sigResult.expireTime * 1000).toLocaleString(),
        source: 'server' // Production-grade server-side generation
      };
      setUserSigInfo(sigInfo);

      console.log('📝 UserSig Info:', {
        ...sigInfo,
        userSig: sigResult.userSig ? `${sigResult.userSig.substring(0, 20)}...` : 'null'
      });

      try {
        console.log('🚀 Initializing TUICallKitServer...');
        
        // Use converted UserID for TUICallKit compatibility
        
        // Initialize TUICallKitServer (this includes login functionality)
        await TUICallKitServer.init({
          SDKAppID: sigResult.sdkAppID,
          userID: tuiCallUserId,
          userSig: sigResult.userSig,
        });
        
        console.log('✅ TUICallKitServer initialized successfully');
        
        // Get the underlying TUICallEngine instance and ensure it's logged in
        const engine = TUICallKitServer.getTUICallEngineInstance();
        if (engine) {
          console.log('🔧 TUICallEngine instance obtained:', !!engine);
          
          // Login to the underlying engine explicitly
          await engine.login({
            userID: tuiCallUserId,
            userSig: sigResult.userSig,
          });
          
          console.log('✅ TUICallEngine login successful');
        }
        
        console.log(`🔗 User system linked: Supabase(${user.email}:${user.id}) <-> TUICallKit(${tuiCallUserId})`);
        
        setInitStatus('success');
        
        toast({
          title: 'Video chat ready',
          description: `Logged in as ${user.email}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error('❌ TUICallKitServer initialization failed:', error);
        setInitStatus('error');
        toast({
          title: 'Error initializing video chat',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    initializeUser();

    return () => {
      TUICallKitServer.destroyed?.();
    };
  }, [navigate, toast]);

  const handleStartCall = async () => {
    if (!targetUserId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a user ID to call',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isCallInProgress) {
      toast({
        title: 'Call in progress',
        description: 'Please wait for the current call to finish',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCallInProgress(true);

    try {
      const targetUserIdTrimmed = targetUserId.trim();
      
      // 增强的调试信息
      console.log('📞 Starting call with detailed params:', {
        from: userSigInfo?.tuiCallUserId || 'unknown',
        to: targetUserIdTrimmed,
        type: CallMediaType.VIDEO,
        currentUserEmail: currentUser?.email,
        inputLength: targetUserIdTrimmed.length,
        isValidFormat: /^[a-zA-Z0-9_]+$/.test(targetUserIdTrimmed)
      });

      // 验证目标UserID格式
      if (targetUserIdTrimmed.length > 32) {
        throw new Error(`Target UserID too long (${targetUserIdTrimmed.length} chars). Use the 8-character "Call User ID" from the other user's Debug Info.`);
      }

      if (!/^[a-zA-Z0-9_]+$/.test(targetUserIdTrimmed)) {
        throw new Error('Target UserID contains invalid characters. Only letters, numbers, and underscores are allowed.');
      }

      if (targetUserIdTrimmed === userSigInfo?.tuiCallUserId) {
        throw new Error('Cannot call yourself. Please use a different user ID.');
      }
      
      // Use TUICallKitServer.call for 1v1 call
      await TUICallKitServer.call({
        userID: targetUserIdTrimmed,
        type: CallMediaType.VIDEO,
      });
      
      console.log('✅ Call initiated successfully');
      console.log(`📡 Call sent from ${userSigInfo?.tuiCallUserId} to ${targetUserIdTrimmed}`);
      
      toast({
        title: 'Call initiated',
        description: `Calling ${targetUserIdTrimmed}... The other user should receive an invitation.`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Call failed:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error.message?.includes('not login')) {
        errorMessage = 'Not logged in to call service. Please refresh and try again.';
      } else if (error.message?.includes('invalid')) {
        errorMessage = 'Invalid user ID or call parameters. Make sure to use the 8-character "Call User ID" from the other user.';
      } else if (error.message?.includes('Target UserID')) {
        errorMessage = error.message; // 使用我们的详细错误信息
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      toast({
        title: 'Error starting call',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Reset call state after 3 seconds
      setTimeout(() => setIsCallInProgress(false), 3000);
    }
  };

  const handleCopyCallUserId = async () => {
    if (userSigInfo?.tuiCallUserId) {
      try {
        await navigator.clipboard.writeText(userSigInfo.tuiCallUserId);
        toast({
          title: 'Copied!',
          description: 'Call User ID copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = userSigInfo.tuiCallUserId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: 'Copied!',
          description: 'Call User ID copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      // Logout from the underlying engine first
      const engine = TUICallKitServer.getTUICallEngineInstance();
      if (engine) {
        await engine.logout();
        console.log('✅ TUICallEngine logout successful');
      }
      
      // Destroy TUICallKitServer instance
      await TUICallKitServer.destroyed();
      console.log('✅ TUICallKitServer destroyed successfully');
    } catch (error) {
      console.error('❌ TUICallKit cleanup failed:', error);
      // Continue with Supabase logout even if TUICallKit cleanup fails
    }
    
    const supabase = getSupabase();
    await supabase.auth.signOut();
    navigate('/signin');
  };

  if (!currentUser) {
    return (
      <Container maxW="lg" centerContent>
        <Box textAlign="center" py={20}>
          <Text fontSize="lg" color="gray.600">Loading user information...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" centerContent py={8}>
      <Box 
        w="full" 
        bg="white" 
        borderRadius="xl" 
        boxShadow="xl" 
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* Header Section */}
        <Box 
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          color="white" 
          p={6}
          textAlign="center"
        >
          <Heading size="lg" mb={2}>🎥 Video Chat</Heading>
          <Text fontSize="md" opacity={0.9}>
            Welcome back, {currentUser.email}
          </Text>
        </Box>

        <Box p={8}>
          <VStack spacing={8} align="stretch">
            {/* Status Section */}
            <Box 
              bg="gray.50" 
              p={4} 
              borderRadius="lg" 
              border="1px solid"
              borderColor="gray.200"
            >
              <HStack justify="space-between" align="center">
                <Text fontWeight="semibold" color="gray.700">Connection Status</Text>
                {initStatus === 'loading' && (
                  <Badge colorScheme="orange" variant="subtle">🔄 Initializing...</Badge>
                )}
                {initStatus === 'success' && (
                  <Badge colorScheme="green" variant="subtle">✅ Ready</Badge>
                )}
                {initStatus === 'error' && (
                  <Badge colorScheme="red" variant="subtle">❌ Failed</Badge>
                )}
              </HStack>
            </Box>

            {/* Call User ID Section */}
            {userSigInfo && (
              <Box 
                bg="blue.50" 
                p={4} 
                borderRadius="lg" 
                border="1px solid"
                borderColor="blue.200"
                textAlign="center"
              >
                <Text fontSize="sm" color="blue.600" mb={2} fontWeight="medium">
                  📞 Your Call User ID
                </Text>
                <HStack justify="center" spacing={3} mb={2}>
                  <Text 
                    fontSize="2xl" 
                    fontFamily="mono" 
                    fontWeight="bold" 
                    color="blue.700"
                    bg="white"
                    px={4}
                    py={2}
                    borderRadius="md"
                    border="2px solid"
                    borderColor="blue.300"
                    display="inline-block"
                  >
                    {userSigInfo.tuiCallUserId || 'Loading...'}
                  </Text>
                  <Tooltip label="Copy Call User ID" placement="top">
                    <IconButton
                      aria-label="Copy Call User ID"
                      icon={<span>📋</span>}
                      onClick={handleCopyCallUserId}
                      colorScheme="blue"
                      variant="outline"
                      size="md"
                      _hover={{
                        bg: "blue.100",
                        transform: "scale(1.05)"
                      }}
                    />
                  </Tooltip>
                </HStack>
                <Text fontSize="xs" color="blue.500">
                  Share this ID with others to receive calls
                </Text>
              </Box>
            )}

            {/* Call Section */}
            <Box 
              bg="gray.50" 
              p={6} 
              borderRadius="lg" 
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack spacing={4}>
                <Text fontWeight="semibold" color="gray.700" fontSize="lg">
                  📞 Start a Video Call
                </Text>
                
                <Input
                  placeholder="Enter the other user's Call User ID (8 characters)"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  isDisabled={initStatus !== 'success'}
                  size="lg"
                  bg="white"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px #3182ce"
                  }}
                />
                
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  onClick={handleStartCall}
                  isDisabled={initStatus !== 'success'}
                  isLoading={isCallInProgress}
                  loadingText="Initiating Call..."
                  leftIcon={<span>📞</span>}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "lg"
                  }}
                >
                  {isCallInProgress ? 'Calling...' : 'Start Video Call'}
                </Button>
              </VStack>
            </Box>

            {/* User Guide */}
            <Box 
              bg="yellow.50" 
              p={4} 
              borderRadius="lg" 
              border="1px solid"
              borderColor="yellow.200"
            >
              <Text fontWeight="semibold" color="yellow.800" mb={3}>
                📋 How to test video calls:
              </Text>
              <VStack spacing={2} align="start" fontSize="sm" color="yellow.700">
                <Text>1. Open another browser window (incognito mode)</Text>
                <Text>2. Register/login with a different email</Text>
                <Text>3. Copy the other user's <Text as="span" fontWeight="bold" color="red.600">"Call User ID"</Text></Text>
                <Text>4. Paste it above and click "Start Video Call"</Text>
              </VStack>
            </Box>

            {/* Project Information */}
            <Box 
              bg="blue.50" 
              p={4} 
              borderRadius="lg" 
              border="1px solid"
              borderColor="blue.200"
            >
              <Text fontWeight="semibold" color="blue.800" mb={3}>
                🚀 About This Project:
              </Text>
              <VStack spacing={2} align="start" fontSize="sm" color="blue.700">
                <Text>
                  This is an open-source video chat application built with React and powered by{' '}
                  <ChakraLink 
                    href="https://trtc.io/" 
                    color="blue.600" 
                    fontWeight="semibold"
                    isExternal
                    _hover={{ textDecoration: "underline" }}
                  >
                    Tencent RTC
                  </ChakraLink>
                  .
                </Text>
                <Text>
                  ✨ Features high-quality 1v1 video calls with ultra-low latency
                </Text>
                <Text>
                  🔐 Secure authentication powered by Supabase
                </Text>
                <Text>
                  📱 Modern responsive UI built with Chakra UI and TypeScript
                </Text>
                <HStack spacing={1} mt={2}>
                  <Text>🔗 Links:</Text>
                  <ChakraLink 
                    href="https://github.com/KiraJin223/video-chat-app-demo" 
                    color="blue.600"
                    fontWeight="semibold"
                    isExternal
                    _hover={{ textDecoration: "underline" }}
                  >
                    GitHub
                  </ChakraLink>
                  <Text>•</Text>
                  <ChakraLink 
                    href="https://trtc.io/" 
                    color="blue.600"
                    fontWeight="semibold"
                    isExternal
                    _hover={{ textDecoration: "underline" }}
                  >
                    Tencent RTC
                  </ChakraLink>
                </HStack>
              </VStack>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={4} justify="center">
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={handleSignOut}
                leftIcon={<span>🚪</span>}
                size="md"
              >
                Sign Out
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* TUICallKit UI - Full Width */}
      <Box w="full" mt={8}>
        <TUICallKit />
      </Box>
    </Container>
  );
};

export default VideoChat;
