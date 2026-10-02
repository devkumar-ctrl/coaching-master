"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video,
  MapPin,
  Users,
  BookOpen,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface ScheduleItem {
  id: string;
  title: string;
  type: "live-class" | "recorded-class" | "test" | "doubt-session" | "workshop";
  subject: string;
  instructor: string;
  instructorImage?: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  meetingLink?: string;
  location?: string;
  maxStudents?: number;
  enrolledStudents: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  tags: string[];
}

export default function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    filterItems();
  }, [scheduleItems, selectedTab, searchTerm]);

  const fetchSchedule = async () => {
    try {
      // Mock data for now
      const mockSchedule: ScheduleItem[] = [
        {
          id: "1",
          title: "Modern Indian History - Freedom Struggle",
          type: "live-class",
          subject: "History",
          instructor: "Dr. Rajesh Kumar",
          instructorImage: "/instructors/rajesh.jpg",
          date: "2025-01-25",
          time: "10:00 AM",
          duration: "2 hours",
          description: "Comprehensive coverage of the Indian freedom struggle from 1857 to 1947",
          meetingLink: "https://yuvabot.daily.co/room-history-1",
          maxStudents: 100,
          enrolledStudents: 85,
          status: "upcoming",
          tags: ["Cyber Security", "Networking", "Foundations"]
        },
        {
          id: "2",
          title: "Indian Geography - Physical Features",
          type: "live-class",
          subject: "Geography",
          instructor: "Prof. Sunita Sharma",
          date: "2025-01-25",
          time: "2:00 PM",
          duration: "1.5 hours",
          description: "Physical geography of India - mountains, rivers, climate, and natural resources",
          meetingLink: "https://yuvabot.daily.co/room-mentoring-1",
          maxStudents: 80,
          enrolledStudents: 67,
          status: "upcoming",
          tags: ["IoT", "Embedded Systems", "Hardware"]
        },
        {
          id: "3",
          title: "Weekly Current Affairs Test",
          type: "test",
          subject: "Current Affairs",
          instructor: "Editorial Team",
          date: "2025-01-26",
          time: "11:00 AM",
          duration: "1 hour",
          description: "Weekly test covering current affairs from national and international news",
          enrolledStudents: 150,
          status: "upcoming",
          tags: ["Current Affairs", "Test", "Weekly"]
        },
        {
          id: "4",
          title: "Indian Polity - Constitutional Framework",
          type: "recorded-class",
          subject: "Polity",
          instructor: "Dr. Priya Singh",
          date: "2025-01-24",
          time: "Available anytime",
          duration: "3 hours",
          description: "Detailed explanation of Indian Constitution, fundamental rights, and directive principles",
          enrolledStudents: 200,
          status: "completed",
          tags: ["Python", "Programming", "Data Science"]
        },
        {
          id: "5",
          title: "Economics Doubt Clearing Session",
          type: "doubt-session",
          subject: "Economics",
          instructor: "Prof. Amit Gupta",
          date: "2025-01-25",
          time: "6:00 PM",
          duration: "1 hour",
          description: "Interactive session to clear doubts related to Indian economy and economic concepts",
          meetingLink: "https://yuvabot.daily.co/room-geography-1",
          maxStudents: 50,
          enrolledStudents: 32,
          status: "upcoming",
          tags: ["Economics", "Doubt Session", "Interactive"]
        },
        {
          id: "6",
          title: "Essay Writing Workshop",
          type: "workshop",
          subject: "Essay Writing",
          instructor: "Dr. Kavita Joshi",
          date: "2025-01-27",
          time: "10:00 AM",
          duration: "3 hours",
          description: "Workshop on effective problem-solving techniques for coding interviews",
          meetingLink: "https://yuvabot.daily.co/room-current-affairs-1",
          maxStudents: 40,
          enrolledStudents: 28,
          status: "upcoming",
          tags: ["Problem Solving", "Coding", "Workshop", "Interviews"]
        }
      ];
      
      setScheduleItems(mockSchedule);
      setFilteredItems(mockSchedule);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = scheduleItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTab !== "all") {
      if (selectedTab === "live") {
        filtered = filtered.filter(item => item.type === "live-class");
      } else if (selectedTab === "recorded") {
        filtered = filtered.filter(item => item.type === "recorded-class");
      } else if (selectedTab === "tests") {
        filtered = filtered.filter(item => item.type === "test");
      } else if (selectedTab === "workshops") {
        filtered = filtered.filter(item => item.type === "workshop" || item.type === "doubt-session");
      }
    }

    setFilteredItems(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "live": return "bg-red-100 text-red-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "live-class": return <Video className="h-4 w-4" />;
      case "recorded-class": return <BookOpen className="h-4 w-4" />;
      case "test": return <Clock className="h-4 w-4" />;
      case "workshop": return <Users className="h-4 w-4" />;
      case "doubt-session": return <Users className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "live-class": return "Live Class";
      case "recorded-class": return "Recorded Class";
      case "test": return "Test";
      case "workshop": return "Workshop";
      case "doubt-session": return "Doubt Session";
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
        <h1 className="text-4xl font-bold mb-4">Class Schedule</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay updated with all your classes, tests, and workshops. Never miss an important session 
          with our comprehensive schedule management system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {scheduleItems.filter(item => item.status === "upcoming").length}
            </div>
            <div className="text-sm text-muted-foreground">Upcoming Classes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {scheduleItems.filter(item => item.type === "live-class").length}
            </div>
            <div className="text-sm text-muted-foreground">Live Classes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {scheduleItems.filter(item => item.type === "test").length}
            </div>
            <div className="text-sm text-muted-foreground">Tests Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {scheduleItems.filter(item => item.type === "workshop" || item.type === "doubt-session").length}
            </div>
            <div className="text-sm text-muted-foreground">Workshops</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, subject, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Schedule Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{item.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.time} ({item.duration})</span>
                    </div>
                    {item.maxStudents && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{item.enrolledStudents}/{item.maxStudents} enrolled</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 4).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:min-w-[150px]">
                  {item.meetingLink && item.status === "upcoming" && (
                    <Button className="w-full">
                      <Video className="h-4 w-4 mr-2" />
                      Join Class
                    </Button>
                  )}
                  
                  {item.type === "recorded-class" && (
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Watch Now
                    </Button>
                  )}
                  
                  {item.type === "test" && item.status === "upcoming" && (
                    <Button className="w-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Take Test
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No scheduled items found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedTab !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Check back later for new scheduled classes and events"
            }
          </p>
        </div>
      )}

      {/* CTA Section */}
      <Card className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Never Miss a Class!</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Enable notifications to get reminders about upcoming classes, tests, and workshops. 
            Stay on track with your technology training.
          </p>
          <Button size="lg">
            Enable Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
