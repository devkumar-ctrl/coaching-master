"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Award,
  Target,
  Edit3,
  Save,
  X,
  Camera,
  Star,
  Trophy,
  Clock,
  Users
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  joinedDate: string;
  preferences: {
    subjects: string[];
    studyGoals: string[];
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  achievements: {
    coursesCompleted: number;
    testsAttempted: number;
    averageScore: number;
    studyStreak: number;
  };
  enrolledCourses: {
    id: string;
    title: string;
    progress: number;
    instructor: string;
  }[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProfile: UserProfile = {
        id: session?.user?.id || "1",
        name: session?.user?.name || "John Doe",
        email: session?.user?.email || "john.doe@example.com",
        phone: "+91 9876543210",
        image: session?.user?.image || "/avatars/john-doe.jpg",
        role: "STUDENT",
        bio: "Aspiring software engineer skilled in Python and IoT. Passionate about building tech that makes a difference.",
        location: "New Delhi, India",
        dateOfBirth: "1995-06-15",
        joinedDate: "2023-08-15",
        preferences: {
          subjects: ["History", "Geography", "Polity", "Economics", "Current Affairs"],
          studyGoals: ["Master Python", "Build 10+ Projects", "Crack Frontend Role"],
          notificationSettings: {
            email: true,
            sms: false,
            push: true
          }
        },
        achievements: {
          coursesCompleted: 8,
          testsAttempted: 45,
          averageScore: 72,
          studyStreak: 28
        },
        enrolledCourses: [
          {
            id: "1",
            title: "Cyber Security: Zero to Hero",
            progress: 65,
            instructor: "Dr. Rajesh Kumar"
          },
          {
            id: "2",
            title: "Indian History Complete Course",
            progress: 80,
            instructor: "Prof. Sunita Sharma"
          },
          {
            id: "3",
            title: "Current Affairs Monthly Package",
            progress: 40,
            instructor: "Editorial Team"
          }
        ]
      };
      
      setProfile(mockProfile);
      setEditForm(mockProfile);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // API call to update profile
      setProfile({ ...profile!, ...editForm });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditForm(profile || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="text-muted-foreground">Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">My Profile</h1>
        <p className="text-xl text-muted-foreground">
          Manage your personal information, preferences, and track your progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={profile.image} alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
              <Badge variant="secondary" className="mb-4">
                {profile.role}
              </Badge>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={() => setEditing(true)}
                  className="w-full"
                  disabled={editing}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Courses Completed</span>
                <Badge variant="outline">{profile.achievements.coursesCompleted}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tests Attempted</span>
                <Badge variant="outline">{profile.achievements.testsAttempted}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Score</span>
                <Badge variant="outline">{profile.achievements.averageScore}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Streak</span>
                <Badge variant="outline">{profile.achievements.studyStreak} days</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Personal Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
            </TabsList>

            {/* Personal Details */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={editForm.phone || ""}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location || ""}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={editForm.dateOfBirth || ""}
                            onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={3}
                          value={editForm.bio || ""}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Tell us about yourself and your goals..."
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <p className="text-sm mt-1">{profile.name}</p>
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <p className="text-sm mt-1">{profile.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Location</Label>
                          <p className="text-sm mt-1">{profile.location || "Not provided"}</p>
                        </div>
                        <div>
                          <Label>Date of Birth</Label>
                          <p className="text-sm mt-1">
                            {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Bio</Label>
                        <p className="text-sm mt-1">{profile.bio || "No bio added yet."}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Study Preferences</CardTitle>
                  <CardDescription>
                    Customize your learning experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Preferred Subjects</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.preferences.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Study Goals</Label>
                    <div className="space-y-2 mt-2">
                      {profile.preferences.studyGoals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Choose how you want to receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about classes and announcements
                      </p>
                    </div>
                    <Badge variant={profile.preferences.notificationSettings.email ? "default" : "secondary"}>
                      {profile.preferences.notificationSettings.email ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get important reminders via SMS
                      </p>
                    </div>
                    <Badge variant={profile.preferences.notificationSettings.sms ? "default" : "secondary"}>
                      {profile.preferences.notificationSettings.sms ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Badge variant={profile.preferences.notificationSettings.push ? "default" : "secondary"}>
                      {profile.preferences.notificationSettings.push ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Courses */}
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                  <CardDescription>
                    Track your progress in enrolled courses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.enrolledCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{course.title}</h4>
                        <Badge variant="outline">{course.progress}% Complete</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        Instructor: {course.instructor}
                      </p>
                      
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between mt-3">
                        <Button variant="outline" size="sm">
                          Continue Learning
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
