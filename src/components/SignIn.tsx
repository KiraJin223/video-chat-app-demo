import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Text,
  Heading,
  Link as ChakraLink,
  Container,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { getSupabase } from '../utils/supabase';
import { useNavigate, Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: 'Signed in successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/video-chat');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="6xl" centerContent py={8}>
      <VStack spacing={8} w="full">
        {/* Application Introduction */}
        <Box textAlign="center" mb={4}>
          <Heading size="2xl" mb={4} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
            🎥 Video Chat Application
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            Real-time video calling platform built with modern tech stack and powered by Tencent RTC
          </Text>
          
          {/* Tech Stack Badges */}
          <HStack justify="center" spacing={3} mb={6} flexWrap="wrap">
            <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
              React 17
            </Badge>
            <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
              Supabase
            </Badge>
            <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
              Tencent RTC
            </Badge>
            <Badge colorScheme="orange" variant="subtle" px={3} py={1} borderRadius="full">
              TypeScript
            </Badge>
            <Badge colorScheme="pink" variant="subtle" px={3} py={1} borderRadius="full">
              Chakra UI
            </Badge>
          </HStack>
        </Box>

        <HStack spacing={8} align="start" maxW="6xl" w="full">
          {/* Features & Information */}
          <Box 
            flex="1" 
            bg="gray.50" 
            p={6} 
            borderRadius="xl" 
            border="1px solid"
            borderColor="gray.200"
          >
            <Heading size="lg" mb={4} color="gray.700">
              ✨ Application Features
            </Heading>
            <VStack spacing={3} align="start">
              <HStack>
                <Text color="green.500" fontWeight="bold">✓</Text>
                <Text><Text as="span" fontWeight="semibold">Real-time Video Calling</Text> - High-quality 1v1 video call experience</Text>
              </HStack>
              <HStack>
                <Text color="green.500" fontWeight="bold">✓</Text>
                <Text><Text as="span" fontWeight="semibold">User Authentication</Text> - Secure registration and login system</Text>
              </HStack>
              <HStack>
                <Text color="green.500" fontWeight="bold">✓</Text>
                <Text><Text as="span" fontWeight="semibold">Modern UI</Text> - Responsive design supporting all devices</Text>
              </HStack>
              <HStack>
                <Text color="green.500" fontWeight="bold">✓</Text>
                <Text><Text as="span" fontWeight="semibold">Production Ready</Text> - Deployed on Vercel cloud platform</Text>
              </HStack>
            </VStack>

            <Divider my={4} />

            <Heading size="md" mb={3} color="gray.700">
              🚀 Quick Start
            </Heading>
            <VStack spacing={2} align="start" fontSize="sm" color="gray.600">
              <Text>1. Create an account or sign in to existing account</Text>
              <Text>2. Get your unique Call User ID</Text>
              <Text>3. Share your ID with friends to start video calls</Text>
              <Text>4. Enjoy high-quality video calling experience</Text>
            </VStack>

            <Box mt={4} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
              <HStack spacing={2} align="start">
                <Text fontSize="sm" color="blue.700">
                  <Text as="span" fontWeight="bold">💡 About:</Text> 
                  This is a fully open-source project demonstrating modern web technologies in real-time communication, powered by{' '}
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
              </HStack>
            </Box>
          </Box>

          {/* Login Form Area */}
          <Box 
            flex="0 0 400px" 
            bg="white" 
            p={8} 
            borderRadius="xl" 
            boxShadow="xl" 
            border="1px solid"
            borderColor="gray.200"
          >
            <Heading size="lg" textAlign="center" mb={6} color="gray.700">
              Sign In
            </Heading>
            
            <form onSubmit={handleSignIn}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.600">Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    size="lg"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce"
                    }}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel color="gray.600">Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    size="lg"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce"
                    }}
                  />
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  size="lg"
                  isLoading={loading}
                  loadingText="Signing in..."
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "lg"
                  }}
                >
                  Sign In
                </Button>
                
                <Divider />
                
                <Text textAlign="center" color="gray.600">
                  Don't have an account?{' '}
                  <ChakraLink 
                    as={Link} 
                    to="/signup" 
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Sign Up
                  </ChakraLink>
                </Text>
              </VStack>
            </form>
          </Box>
        </HStack>

        {/* Footer Information */}
        <Box textAlign="center" py={4} color="gray.500" fontSize="sm">
          <HStack justify="center" spacing={2} align="center">
            <Text>Open Source Project | Tech Demo | Powered by</Text>
            <ChakraLink 
              href="https://trtc.io/" 
              color="blue.500" 
              fontWeight="semibold"
              isExternal
              _hover={{ textDecoration: "underline" }}
            >
              Tencent RTC
            </ChakraLink>
            <Text>|</Text>
            <ChakraLink 
              href="https://github.com" 
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              View Source
            </ChakraLink>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SignIn;
