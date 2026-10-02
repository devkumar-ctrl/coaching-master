"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: { [key: string]: { title: string; description: string; solution: string } } = {
  OAuthAccountNotLinked: {
    title: "Account Linking Issue",
    description: "This email address is already associated with another account. This usually happens when your account role was updated in our system.",
    solution: "Please try signing in again. If the issue persists, contact our support team."
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You don't have permission to access this application.",
    solution: "Please contact the administrator if you believe this is an error."
  },
  Verification: {
    title: "Verification Error",
    description: "The verification link is invalid or has expired.",
    solution: "Please try requesting a new verification link."
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred during authentication.",
    solution: "Please try again or contact support if the problem continues."
  }
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  
  const errorInfo = errorMessages[error] || errorMessages.Default;

  const handleRetry = () => {
    // Clear any cached auth state and redirect to sign in
    window.location.href = "/api/auth/signin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <img src="/yuva/yuva-logo.webp" alt="YuvaBot Lab" className="mx-auto h-12 w-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">YuvaBot Lab</h2>
          <p className="text-sm text-gray-600">Innovate with Future Tech</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Solution:</strong> {errorInfo.solution}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleRetry} 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
            </div>

            {error === "OAuthAccountNotLinked" && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  Need help with your account?
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  If you recently had your account role updated (from Student to Teacher), 
                  this is a temporary issue that usually resolves itself on the next sign-in attempt.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleRetry}>
                    Try Signing In Again
                  </Button>
                  <Link href="mailto:info@YuvaBot.com">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Error Code: {error} | Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
