"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ChatErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ChatErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ChatErrorBoundary extends React.Component<
  ChatErrorBoundaryProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chat Error Boundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <DefaultChatErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultChatErrorFallback({
  error,
  resetError
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong with the chat
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-md">
        {error?.message || "An unexpected error occurred. Please try refreshing the chat."}
      </p>
      <div className="flex gap-2">
        <Button
          onClick={resetError}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          variant="default"
        >
          Refresh Page
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 max-w-lg">
          <summary className="text-xs text-gray-500 cursor-pointer">
            Error Details (Dev Mode)
          </summary>
          <pre className="text-xs text-left bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
