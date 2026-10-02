"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  MapPin,
  Search,
  Filter,
  Video,
  Phone,
  Star,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  type: "class" | "doubt-session" | "workshop" | "one-on-one";
  title: string;
  instructor: string;
  instructorImage?: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  meetingLink?: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  price: number;
  paymentStatus: "paid" | "pending" | "failed";
  description: string;
  maxParticipants?: number;
  currentParticipants?: number;
  bookingDate: string;
  subject: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, selectedTab, searchTerm]);

  const fetchBookings = async () => {
    try {
      // Mock data for now
      const mockBookings: Booking[] = [
        {
          id: "1",
          type: "class",
          title: "Modern Indian History - Freedom Struggle",
          instructor: "Dr. Rajesh Kumar",
          instructorImage: "/instructors/rajesh.jpg",
          date: "2025-01-25",
          time: "10:00 AM",
          duration: "2 hours",
          meetingLink: "https://yuvabot.daily.co/room-history-1",
          status: "confirmed",
          price: 500,
          paymentStatus: "paid",
          description: "Comprehensive coverage of the Indian freedom struggle from 1857 to 1947",
          maxParticipants: 100,
          currentParticipants: 85,
          bookingDate: "2025-01-15",
          subject: "History"
        },
        {
          id: "2",
          type: "one-on-one",
          title: "Personal Mentoring Session",
          instructor: "Prof. Sunita Sharma",
          date: "2025-01-26",
          time: "3:00 PM",
          duration: "1 hour",
          meetingLink: "https://yuvabot.daily.co/room-mentoring-1",
          status: "confirmed",
          price: 1500,
          paymentStatus: "paid",
          description: "One-on-one mentoring session for geography preparation strategy",
          bookingDate: "2025-01-18",
          subject: "Geography"
        },
        {
          id: "3",
          title: "Essay Writing Workshop",
          type: "workshop",
          instructor: "Dr. Kavita Joshi",
          date: "2025-01-27",
          time: "10:00 AM",
          duration: "3 hours",
          location: "Room 201, Main Building",
          status: "pending",
          price: 800,
          paymentStatus: "pending",
          description: "Workshop on effective problem-solving techniques for coding interviews",
          maxParticipants: 40,
          currentParticipants: 28,
          bookingDate: "2025-01-20",
          subject: "Essay Writing"
        },
        {
          id: "4",
          type: "doubt-session",
          title: "Economics Doubt Clearing",
          instructor: "Prof. Amit Gupta",
          date: "2025-01-22",
          time: "6:00 PM",
          duration: "1 hour",
          meetingLink: "https://yuvabot.daily.co/room-geography-1",
          status: "completed",
          price: 300,
          paymentStatus: "paid",
          description: "Interactive session to clear doubts related to Indian economy",
          maxParticipants: 50,
          currentParticipants: 32,
          bookingDate: "2025-01-12",
          subject: "Economics"
        },
        {
          id: "5",
          type: "class",
          title: "Current Affairs Discussion",
          instructor: "Editorial Team",
          date: "2025-01-28",
          time: "5:00 PM",
          duration: "1.5 hours",
          meetingLink: "https://yuvabot.daily.co/room-current-affairs-1",
          status: "cancelled",
          price: 400,
          paymentStatus: "failed",
          description: "Weekly current affairs discussion and analysis",
          bookingDate: "2025-01-19",
          subject: "Current Affairs"
        }
      ];
      
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTab !== "all") {
      filtered = filtered.filter(booking => booking.status === selectedTab);
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "class": return "Live Class";
      case "doubt-session": return "Doubt Session";
      case "workshop": return "Workshop";
      case "one-on-one": return "1-on-1 Session";
      default: return type;
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
        <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Manage all your class bookings, sessions, and workshops in one place. 
          Track your learning journey and never miss an important session.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {bookings.filter(b => b.status === "confirmed").length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {bookings.filter(b => b.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {bookings.filter(b => b.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              ₹{bookings.filter(b => b.paymentStatus === "paid").reduce((total, b) => total + b.price, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Paid</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings by title, instructor, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{getTypeLabel(booking.type)}</Badge>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </Badge>
                    <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{booking.title}</h3>
                  <p className="text-muted-foreground mb-3">{booking.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{booking.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{booking.time} ({booking.duration})</span>
                    </div>
                    {booking.location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.location}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        <span>Online</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      ₹{booking.price}
                    </div>
                    
                    {booking.maxParticipants && (
                      <div className="text-sm text-muted-foreground">
                        {booking.currentParticipants}/{booking.maxParticipants} participants
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  {booking.status === "confirmed" && new Date(booking.date) > new Date() && (
                    <>
                      {booking.meetingLink ? (
                        <Button className="w-full">
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      ) : (
                        <Button className="w-full">
                          <MapPin className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>
                      )}
                    </>
                  )}
                  
                  {booking.status === "pending" && (
                    <Button variant="outline" className="w-full">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Awaiting Confirmation
                    </Button>
                  )}
                  
                  {booking.paymentStatus === "pending" && (
                    <Button variant="secondary" className="w-full">
                      Complete Payment
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  {booking.status === "confirmed" && new Date(booking.date) > new Date() && (
                    <Button variant="destructive" size="sm" className="w-full">
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedTab !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "You haven't made any bookings yet. Browse our courses and sessions to get started."
            }
          </p>
          <Link href="/courses">
            <Button>
              Browse Courses
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help with Your Bookings?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our support team is here to help you with any questions about your bookings, 
            payments, or technical issues. Contact us anytime!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Phone className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" size="lg">
              View FAQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
