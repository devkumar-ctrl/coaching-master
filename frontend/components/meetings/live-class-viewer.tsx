"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  ExternalLink, 
  Clock, 
  Users, 
  Play,
  RefreshCw,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

interface LiveClass {
  id: string;
  teacherId: string;
  teacherName: string;
  courseId?: string;
  courseTitle?: string;
  title: string;
  meetingLink: string;
  platform: string;
  publishedAt: string;
  isActive: boolean;
  expectedDuration?: number;
  description?: string;
}

interface LiveClassViewerProps {
  studentId: string;
  enrolledCourses?: string[]; // Array of course IDs the student is enrolled in
}

export default function LiveClassViewer({ studentId, enrolledCourses = [] }: LiveClassViewerProps) {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live classes
  const fetchLiveClasses = async (showRefreshState = false) => {
    try {
      if (showRefreshState) setRefreshing(true);
      
      console.log('🔍 Fetching live classes for student:', studentId);
      console.log('📚 Enrolled courses:', enrolledCourses);
      
      // Build query parameters
      let queryParams = `studentId=${studentId}`;
      
      // Add enrolled course IDs as individual courseId parameters
      if (enrolledCourses.length > 0) {
        const courseFilters = enrolledCourses.map(courseId => `courseId=${courseId}`).join('&');
        queryParams += `&${courseFilters}`;
      }
      
      console.log('🌐 API Query:', `/api/live-classes?${queryParams}`);
      
      const response = await fetch(`/api/live-classes?${queryParams}`);
      
      if (response.ok) {
        const { liveClasses: classes } = await response.json();
        console.log('📦 Received live classes:', classes);
        console.log('🎯 Filtered classes count:', classes.length);
        setLiveClasses(classes);
      } else {
        console.error('❌ Failed to fetch live classes:', response.status, response.statusText);
        toast.error('Failed to load live classes');
      }
    } catch (error) {
      console.error('💥 Error fetching live classes:', error);
      toast.error('Failed to load live classes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
    
    // Auto-refresh every 30 seconds to show new classes
    const interval = setInterval(() => fetchLiveClasses(), 30000);
    return () => clearInterval(interval);
  }, [studentId, enrolledCourses]);

  // Join meeting
  const joinMeeting = (liveClass: LiveClass) => {
    // Open meeting in new tab
    window.open(liveClass.meetingLink, '_blank');
    
    toast.success(`Joining ${liveClass.title}`, {
      description: 'Meeting will open in a new tab'
    });
  };

  // Platform styling
  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'daily': return '🎥';
      case 'zoom': return '📹';
      case 'google-meet': return '🎥';
      case 'teams': return '💼';
      case 'jitsi': return '🔗';
      case 'webex': return '📊';
      default: return '🌐';
    }
  };

  const getPlatformColor = (platformName: string) => {
    switch (platformName) {
      case 'daily': return 'bg-indigo-100 text-indigo-800';
      case 'zoom': return 'bg-blue-100 text-blue-800';
      case 'google-meet': return 'bg-green-100 text-green-800';
      case 'teams': return 'bg-purple-100 text-purple-800';
      case 'jitsi': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Time since published
  const getTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return published.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-red-500" />
            Live Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-red-500" />
            Live Classes
            {liveClasses.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {liveClasses.length} LIVE
              </Badge>
            )}
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLiveClasses(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {liveClasses.length === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-600 mb-2">No Live Classes</h3>
            <p className="text-sm text-gray-500">
              Live classes from your teachers will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {liveClasses.map((liveClass) => (
              <div 
                key={liveClass.id} 
                className="border rounded-lg p-4 space-y-3 bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{liveClass.title}</h3>
                      <Badge className={getPlatformColor(liveClass.platform)}>
                        {getPlatformIcon(liveClass.platform)} {liveClass.platform}
                      </Badge>
                      <Badge className="bg-red-100 text-red-700 animate-pulse">
                        ● LIVE NOW
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        👨‍🏫 {liveClass.teacherName}
                      </span>
                      {liveClass.courseTitle && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {liveClass.courseTitle}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {liveClass.description && (
                      <p className="text-sm text-gray-600 mb-2">{liveClass.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Started {getTimeAgo(liveClass.publishedAt)}
                      </span>
                      {liveClass.expectedDuration && (
                        <span>{liveClass.expectedDuration} min duration</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => joinMeeting(liveClass)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Join Now
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(liveClass.meetingLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress bar showing time elapsed */}
                {liveClass.expectedDuration && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Class in progress</span>
                      <span>
                        {Math.floor((Date.now() - new Date(liveClass.publishedAt).getTime()) / (1000 * 60))}
                        /{liveClass.expectedDuration} min
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(
                            100,
                            (Date.now() - new Date(liveClass.publishedAt).getTime()) / 
                            (liveClass.expectedDuration * 60 * 1000) * 100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
