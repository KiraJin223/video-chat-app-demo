import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { getSupabase } from '../utils/supabase';
import { useNavigate, Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: '✅ Account Created Successfully!',
          description: 'Please check your email inbox for a verification link. You must verify your email before signing in.',
          status: 'success',
          duration: 8000,
          isClosable: true,
        });
        navigate('/signin');
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
    <Box maxW="md" mx="auto" mt={8} p={8} borderWidth={1} borderRadius="xl" boxShadow="xl">
      <VStack spacing={6}>
        <Box textAlign="center">
          <Heading size="lg" mb={2} color="gray.700">
            Create Account
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Join our video chat platform powered by Tencent RTC
          </Text>
        </Box>
        
        <form onSubmit={handleSignUp} style={{ width: '100%' }}>
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
                placeholder="Create a secure password"
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
              loadingText="Creating account..."
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg"
              }}
            >
              Create Account
            </Button>
          </VStack>
        </form>

        {/* Email Verification Notice */}
        <Box 
          bg="orange.50" 
          p={3} 
          borderRadius="md" 
          border="1px solid" 
          borderColor="orange.200"
          textAlign="center"
        >
          <Text fontSize="xs" color="orange.700">
            📧 <Text as="span" fontWeight="semibold">Important:</Text> After registration, please check your email for a verification link. You must verify your email address before you can sign in.
          </Text>
        </Box>
        
        <Text textAlign="center" color="gray.600" fontSize="sm">
          Already have an account?{' '}
          <ChakraLink 
            as={Link} 
            to="/signin" 
            color="blue.500"
            fontWeight="semibold"
            _hover={{ textDecoration: "underline" }}
          >
            Sign In
          </ChakraLink>
        </Text>

        {/* Footer Links */}
        <Box textAlign="center" pt={4} borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="xs" color="gray.500" mb={2}>
            Powered by{' '}
            <ChakraLink 
              href="https://trtc.io/" 
              color="blue.500"
              isExternal
              _hover={{ textDecoration: "underline" }}
            >
              Tencent RTC
            </ChakraLink>
            {' '} | {' '}
            <ChakraLink 
              href="https://github.com/KiraJin223/video-chat-app-demo" 
              color="blue.500"
              isExternal
              _hover={{ textDecoration: "underline" }}
            >
              View Source
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default SignUp;
