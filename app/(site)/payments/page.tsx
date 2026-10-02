"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Download, 
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Receipt,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Link from "next/link";

interface Payment {
  id: string;
  transactionId: string;
  type: "course-enrollment" | "session-booking" | "material-purchase" | "refund";
  title: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: "razorpay" | "card" | "upi" | "netbanking" | "wallet";
  date: string;
  receiptUrl?: string;
  courseId?: string;
  courseName?: string;
  instructor?: string;
  refundAmount?: number;
  refundReason?: string;
}

interface PaymentStats {
  totalSpent: number;
  totalRefunded: number;
  pendingAmount: number;
  coursesEnrolled: number;
  sessionsBooked: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, selectedTab, searchTerm]);

  const fetchPayments = async () => {
    try {
      // Mock data for now
      const mockPayments: Payment[] = [
        {
          id: "1",
          transactionId: "TXN_20250125_001",
          type: "course-enrollment",
          title: "Course Enrollment Payment",
          description: "Comprehensive Cyber Security Course enrollment",
          amount: 15000,
          status: "completed",
          paymentMethod: "razorpay",
          date: "2025-01-25T10:30:00Z",
          receiptUrl: "/receipts/receipt_001.pdf",
          courseId: "course_1",
          courseName: "Cyber Security: Zero to Hero",
          instructor: "Dr. Rajesh Kumar"
        },
        {
          id: "2",
          transactionId: "TXN_20250124_002",
          type: "session-booking",
          title: "One-on-One Session Payment",
          description: "Personal mentoring session with Prof. Sunita Sharma",
          amount: 1500,
          status: "completed",
          paymentMethod: "upi",
          date: "2025-01-24T15:45:00Z",
          receiptUrl: "/receipts/receipt_002.pdf",
          instructor: "Prof. Sunita Sharma"
        },
        {
          id: "3",
          transactionId: "TXN_20250123_003",
          type: "material-purchase",
          title: "Study Material Purchase",
          description: "Modern Indian History complete notes and test series",
          amount: 2500,
          status: "completed",
          paymentMethod: "card",
          date: "2025-01-23T09:15:00Z",
          receiptUrl: "/receipts/receipt_003.pdf"
        },
        {
          id: "4",
          transactionId: "TXN_20250122_004",
          type: "session-booking",
          title: "Workshop Registration",
          description: "Essay Writing Workshop registration",
          amount: 800,
          status: "pending",
          paymentMethod: "netbanking",
          date: "2025-01-22T16:20:00Z"
        },
        {
          id: "5",
          transactionId: "TXN_20250121_005",
          type: "course-enrollment",
          title: "Course Enrollment Payment",
          description: "Advanced Ethical Hacking Preparation Course",
          amount: 25000,
          status: "failed",
          paymentMethod: "card",
          date: "2025-01-21T11:30:00Z",
          courseName: "Certified Ethical Hacker (CEH v12)"
        },
        {
          id: "6",
          transactionId: "TXN_20250120_006",
          type: "refund",
          title: "Course Refund",
          description: "Refund for cancelled Economics Masterclass",
          amount: -5000,
          refundAmount: 5000,
          status: "completed",
          paymentMethod: "razorpay",
          date: "2025-01-20T14:00:00Z",
          receiptUrl: "/receipts/refund_006.pdf",
          refundReason: "Course cancelled by instructor"
        }
      ];

      const mockStats: PaymentStats = {
        totalSpent: mockPayments.filter(p => p.amount > 0 && p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
        totalRefunded: Math.abs(mockPayments.filter(p => p.amount < 0 && p.status === "completed").reduce((sum, p) => sum + p.amount, 0)),
        pendingAmount: mockPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
        coursesEnrolled: mockPayments.filter(p => p.type === "course-enrollment" && p.status === "completed").length,
        sessionsBooked: mockPayments.filter(p => p.type === "session-booking" && p.status === "completed").length
      };
      
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTab !== "all") {
      filtered = filtered.filter(payment => payment.status === selectedTab);
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "refunded": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      case "refunded": return <RefreshCw className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "razorpay": return "Razorpay";
      case "card": return "Credit/Debit Card";
      case "upi": return "UPI";
      case "netbanking": return "Net Banking";
      case "wallet": return "Wallet";
      default: return method;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "course-enrollment": return "Course Enrollment";
      case "session-booking": return "Session Booking";
      case "material-purchase": return "Material Purchase";
      case "refund": return "Refund";
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course-enrollment": return "📚";
      case "session-booking": return "📅";
      case "material-purchase": return "📖";
      case "refund": return "💰";
      default: return "💳";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Payment History</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track all your payments, manage receipts, and monitor your spending on courses and sessions. 
          Your complete financial overview in one place.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">₹{stats.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <RefreshCw className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">₹{stats.totalRefunded.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Refunded</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">₹{stats.pendingAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Pending Amount</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-2xl font-bold text-primary">{stats.coursesEnrolled}</div>
              <div className="text-sm text-muted-foreground">Courses Enrolled</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-2xl font-bold text-primary">{stats.sessionsBooked}</div>
              <div className="text-sm text-muted-foreground">Sessions Booked</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{getTypeIcon(payment.type)}</span>
                    <Badge variant="outline">{getTypeLabel(payment.type)}</Badge>
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-1">{payment.title}</h3>
                  <p className="text-muted-foreground mb-2">{payment.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Receipt className="h-4 w-4" />
                      <span>{payment.transactionId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(payment.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span>{getPaymentMethodLabel(payment.paymentMethod)}</span>
                    </div>
                  </div>
                  
                  {payment.instructor && (
                    <p className="text-sm text-muted-foreground">
                      Instructor: {payment.instructor}
                    </p>
                  )}
                  
                  {payment.refundReason && (
                    <p className="text-sm text-muted-foreground">
                      Refund Reason: {payment.refundReason}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2 lg:min-w-[200px]">
                  <div className={`text-2xl font-bold flex items-center ${
                    payment.amount < 0 ? 'text-green-600' : 'text-primary'
                  }`}>
                    {payment.amount < 0 ? (
                      <ArrowDownRight className="h-5 w-5 mr-1" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 mr-1" />
                    )}
                    ₹{Math.abs(payment.amount).toLocaleString()}
                  </div>
                  
                  <div className="flex gap-2">
                    {payment.receiptUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                    
                    {payment.status === "failed" && (
                      <Button size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                    )}
                    
                    {payment.status === "pending" && (
                      <Button size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                  </div>
                  
                  {payment.courseId && (
                    <Link href={`/courses/${payment.courseId}`}>
                      <Button variant="ghost" size="sm">
                        View Course
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No payments found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedTab !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "You haven't made any payments yet. Start your learning journey today!"
            }
          </p>
          <Link href="/courses">
            <Button>
              Browse Courses
            </Button>
          </Link>
        </div>
      )}

      {/* Support Section */}
      <Card className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Payment Issues?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you're experiencing any payment-related issues, refund queries, or need help with receipts, 
            our support team is ready to assist you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Contact Support
            </Button>
            <Button variant="outline" size="lg">
              Payment FAQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
