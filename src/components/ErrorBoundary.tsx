import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 这里可以添加错误日志上报
    // logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          maxW="md"
          mx="auto"
          mt={8}
          p={6}
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          boxShadow="md"
        >
          <VStack spacing={6}>
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              Something went wrong
            </Alert>

            <VStack spacing={4} textAlign="center">
              <Heading size="md" color="red.600">
                Oops! An error occurred
              </Heading>
              
              <Text color="gray.600">
                We're sorry, but something went wrong. Please try refreshing the page or contact support if the problem persists.
              </Text>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  p={4}
                  bg="red.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="red.200"
                  fontSize="sm"
                  fontFamily="mono"
                  textAlign="left"
                  maxW="full"
                  overflow="auto"
                >
                  <Text fontWeight="bold" color="red.700" mb={2}>
                    Error Details (Development Mode):
                  </Text>
                  <Text color="red.600">
                    {this.state.error.message}
                  </Text>
                </Box>
              )}

              <VStack spacing={3}>
                <Button
                  colorScheme="blue"
                  onClick={this.handleReset}
                  size="md"
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  size="sm"
                >
                  Reload Page
                </Button>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
