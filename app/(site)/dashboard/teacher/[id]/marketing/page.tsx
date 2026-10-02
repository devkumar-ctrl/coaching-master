'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Mail, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
}

export default function MarketingPage({ params }: { params: Promise<{ id: string }> }) {
  const [emailList, setEmailList] = useState('');
  const [subject, setSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [validEmails, setValidEmails] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [teacherId, setTeacherId] = useState<string>('');

  // Resolve params Promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setTeacherId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Parse and validate emails
  const parseEmails = () => {
    const emails = emailList
      .split(/[,\n\r]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)
      .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    
    setValidEmails([...new Set(emails)]); // Remove duplicates
  };

  // Remove email from list
  const removeEmail = (emailToRemove: string) => {
    setValidEmails(validEmails.filter(email => email !== emailToRemove));
  };

  // Send bulk emails
  const sendBulkEmails = async () => {
    if (!subject.trim() || !emailContent.trim() || validEmails.length === 0) {
      alert('Please fill in all fields and add valid emails');
      return;
    }

    setSending(true);
    setResults([]);
    setShowResults(true);

    try {
      const response = await fetch('/api/marketing/bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: validEmails,
          subject,
          content: emailContent,
          teacherId: teacherId
        }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      alert('Failed to send emails. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Premium Header Section */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-amber-200/60 dark:border-gray-700/60 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-purple-600 dark:to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-amber-200 dark:ring-purple-400/30">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Email Marketing Hub
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Professional bulk email campaigns</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Powered by Gmail</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Enterprise-grade delivery</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid gap-8">
          {/* Email List Input */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-amber-200/50 dark:ring-purple-500/30">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-purple-600 dark:to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-white/20 dark:bg-white/30 rounded-lg flex items-center justify-center ring-2 ring-white/30">
                  <Users className="h-5 w-5" />
                </div>
                Student Email Management
              </CardTitle>
              <CardDescription className="text-amber-100 dark:text-purple-100">
                Import and validate your student email addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="space-y-3">
                <Label htmlFor="emailList" className="text-sm font-semibold text-amber-800 dark:text-purple-300 uppercase tracking-wide">
                  Email Addresses
                </Label>
                <Textarea
                  id="emailList"
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  placeholder="student1@gmail.com, student2@gmail.com
student3@gmail.com, student4@gmail.com"
                  className="min-h-40 border-2 border-amber-200 dark:border-purple-500/30 rounded-xl focus:border-amber-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 resize-none font-mono text-sm bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <Button 
                onClick={parseEmails} 
                variant="outline" 
                className="w-full md:w-auto border-2 border-amber-300 dark:border-purple-400 text-amber-700 dark:text-purple-300 hover:bg-amber-100 dark:hover:bg-purple-900/30 hover:border-amber-400 dark:hover:border-purple-300 transition-all duration-200 font-semibold bg-gradient-to-r from-amber-50 to-orange-50 dark:from-purple-900/20 dark:to-indigo-900/20"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Parse & Validate Emails
              </Button>
              
              {validEmails.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/50 ring-1 ring-emerald-200/50 dark:ring-emerald-600/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <Label className="text-emerald-800 dark:text-emerald-300 font-semibold">
                      Valid Emails ({validEmails.length})
                    </Label>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {validEmails.map((email, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 px-3 py-1 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        onClick={() => removeEmail(email)}
                      >
                        {email} 
                        <span className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">✕</span>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                    💡 Click on any email to remove it from the list
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Composition */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-purple-200/50 dark:ring-pink-500/30">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-pink-600 dark:to-rose-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-white/20 dark:bg-white/30 rounded-lg flex items-center justify-center ring-2 ring-white/30">
                  <Mail className="h-5 w-5" />
                </div>
                Email Composition
              </CardTitle>
              <CardDescription className="text-purple-100 dark:text-pink-100">
                Create compelling content for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-sm font-semibold text-purple-800 dark:text-pink-300 uppercase tracking-wide">
                  Email Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="🎉 Special Announcement from YuvaBot Lab"
                  className="border-2 border-purple-200 dark:border-pink-500/30 rounded-xl focus:border-purple-500 dark:focus:border-pink-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-pink-500/20 transition-all duration-200 h-12 text-base bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm font-semibold text-purple-800 dark:text-pink-300 uppercase tracking-wide">
                  Email Content
                </Label>
                <Textarea
                  id="content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Dear Students,

I hope this email finds you well. I wanted to share some exciting news with you...

Best regards,
Your Teacher"
                  className="min-h-80 border-2 border-purple-200 dark:border-pink-500/30 rounded-xl focus:border-purple-500 dark:focus:border-pink-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-pink-500/20 transition-all duration-200 resize-none text-base leading-relaxed bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100"
                />
              </div>

              <Alert className="border-purple-200 dark:border-pink-500/30 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 ring-1 ring-purple-200/50 dark:ring-pink-500/30">
                <Mail className="h-5 w-5 text-purple-600 dark:text-pink-400" />
                <AlertDescription className="text-purple-800 dark:text-pink-300 font-medium">
                  <strong>Email Preview:</strong> Your content will be automatically formatted into a beautiful HTML email template with professional styling, headers, and branding.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Send Button */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-blue-200/50 dark:ring-cyan-500/30">
            <CardContent className="p-8 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Ready to Launch Campaign</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-blue-600 dark:text-cyan-400">{validEmails.length}</span> recipients
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Subject: <span className="font-medium text-purple-600 dark:text-pink-400">"{subject || 'No subject'}"</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={sendBulkEmails}
                  disabled={sending || validEmails.length === 0 || !subject.trim() || !emailContent.trim()}
                  size="lg"
                  className="min-w-48 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-600 dark:to-blue-600 hover:from-blue-700 hover:to-cyan-700 dark:hover:from-cyan-700 dark:hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold rounded-xl ring-2 ring-blue-300/50 dark:ring-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-3" />
                      Sending Campaign...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
                      Launch Email Campaign
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md ring-1 ring-emerald-200/50 dark:ring-green-500/30">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-green-600 dark:to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-white/20 dark:bg-white/30 rounded-lg flex items-center justify-center ring-2 ring-white/30">
                    📊
                  </div>
                  Campaign Results
                </CardTitle>
                <CardDescription className="text-emerald-100 dark:text-green-100">
                  {sending ? 'Sending emails in progress...' : `Campaign completed: ${successCount} successful, ${failureCount} failed`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
                {sending ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative mb-6">
                      <Loader2 className="h-16 w-16 animate-spin text-emerald-600 dark:text-green-400" />
                      <div className="absolute inset-0 h-16 w-16 border-4 border-emerald-200 dark:border-green-600/30 rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Sending Campaign</h3>
                    <p className="text-gray-600 dark:text-gray-400">Delivering emails to {validEmails.length} recipients...</p>
                    <div className="w-full max-w-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-3 mt-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 dark:from-green-500 dark:to-emerald-500 h-3 rounded-full animate-pulse shadow-lg" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700/50 ring-1 ring-emerald-200/50 dark:ring-emerald-600/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{successCount}</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">Emails Sent</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl p-4 border border-red-200 dark:border-red-700/50 ring-1 ring-red-200/50 dark:ring-red-600/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <XCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{failureCount}</p>
                            <p className="text-red-600 dark:text-red-400 font-medium">Failed</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/80 transition-all duration-200 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{result.email}</span>
                          {result.success ? (
                            <Badge variant="default" className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-3 py-1">
                              <CheckCircle className="h-3 w-3 mr-2" />
                              Delivered
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700 px-3 py-1">
                              <XCircle className="h-3 w-3 mr-2" />
                              Failed
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}