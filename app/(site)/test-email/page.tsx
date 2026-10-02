'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, TestTube, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string; details?: string }>({ type: null, message: '' });

  const sendTestEmail = async (type: 'welcome' | 'enrollment') => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }
    
    setResult({ type: 'loading', message: 'Sending test email...' });
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, email, name })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult({ 
          type: 'success', 
          message: '✅ Email sent successfully!', 
          details: `Message ID: ${data.messageId}` 
        });
      } else {
        setResult({ 
          type: 'error', 
          message: '❌ Failed to send email', 
          details: `Error: ${data.error}` 
        });
      }
    } catch (error) {
      setResult({ 
        type: 'error', 
        message: '❌ Network error', 
        details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  };
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Email System Test</h1>
            <p className="text-lg text-muted-foreground">
              Test your email configuration to ensure enrollment emails are working
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Email Configuration Status
              </CardTitle>
              <CardDescription>
                Check if your email environment variables are properly configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">EMAIL_USER</span>
                  <Badge variant="outline" className="text-xs">
                    {process.env.EMAIL_USER ? '✅ Configured' : '❌ Missing'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">EMAIL_PASSWORD</span>
                  <Badge variant="outline" className="text-xs">
                    {process.env.EMAIL_PASSWORD ? '✅ Configured' : '❌ Missing'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">NEXT_PUBLIC_APP_URL</span>
                  <Badge variant="outline" className="text-xs">
                    {process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Test Email Sending
              </CardTitle>
              <CardDescription>
                Send a test email to verify your configuration is working
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    onClick={() => sendTestEmail('welcome')}
                    className="flex-1"
                    disabled={result.type === 'loading'}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Test Welcome Email
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => sendTestEmail('enrollment')}
                    variant="outline"
                    className="flex-1"
                    disabled={result.type === 'loading'}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Enrollment Email
                  </Button>
                </div>

                {result.type && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    result.type === 'success' ? 'bg-green-50 border border-green-200' :
                    result.type === 'error' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className={`font-medium ${
                      result.type === 'success' ? 'text-green-800' :
                      result.type === 'error' ? 'text-red-800' :
                      'text-blue-800'
                    }`}>
                      {result.message}
                    </p>
                    {result.details && (
                      <p className={`text-sm mt-1 ${
                        result.type === 'success' ? 'text-green-700' :
                        result.type === 'error' ? 'text-red-700' :
                        'text-blue-700'
                      }`}>
                        {result.details}
                      </p>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Gmail Setup</p>
                    <p className="text-muted-foreground">Make sure you're using an App Password, not your regular Gmail password</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">2-Factor Authentication</p>
                    <p className="text-muted-foreground">Enable 2FA on your Google account before generating an App Password</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Environment Variables</p>
                    <p className="text-muted-foreground">Restart your development server after updating .env.local</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Check Spam Folder</p>
                    <p className="text-muted-foreground">Test emails might end up in spam, especially from localhost</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
