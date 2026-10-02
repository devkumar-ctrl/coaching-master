'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, Link2, Copy, Check } from 'lucide-react';

interface LiveClass {
  id: string;
  teacherId: string;
  teacherName: string;
  courseId?: string;
  courseTitle?: string;
  title: string;
  meetingLink: string;
  isActive: boolean;
  publishedAt: string;
}

interface LiveClassPublisherProps {
  teacherId: string;
  teacherName?: string;
}

interface Course {
  id: string;
  title: string;
  enrollmentCount: number;
}

export default function LiveClassPublisher({ teacherId, teacherName }: LiveClassPublisherProps) {
  const [title, setTitle] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [activeClasses, setActiveClasses] = useState<LiveClass[]>([]);
  const [currentTeacherName, setCurrentTeacherName] = useState(teacherName || '');
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveClasses();
    fetchTeacherCourses();
    if (!currentTeacherName && teacherId) {
      fetchTeacherName();
    }
  }, [teacherId]);

  const fetchTeacherName = async () => {
    try {
      const response = await fetch(`/api/teachers/${teacherId}`);
      if (response.ok) {
        const teacher = await response.json();
        setCurrentTeacherName(teacher.name || 'Teacher');
      }
    } catch (error) {
      console.error('Error fetching teacher name:', error);
      setCurrentTeacherName('Teacher');
    }
  };

  const fetchTeacherCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch(`/api/teachers/${teacherId}/courses`);
      if (response.ok) {
        const courses = await response.json();
        setTeacherCourses(courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          enrollmentCount: course.enrollmentCount || 0
        })));
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchActiveClasses = async () => {
    try {
      const response = await fetch(`/api/live-classes?teacherId=${teacherId}`);
      if (response.ok) {
        const data = await response.json();
        setActiveClasses(data.liveClasses || []);
      }
    } catch (error) {
      console.error('Error fetching active classes:', error);
    }
  };

  // Create a Daily.co room (free tier) and fill the meeting link field
  const createDailyRoom = async () => {
    if (!title.trim()) {
      alert('Enter a class title first so the room gets a name.');
      return;
    }
    setIsCreatingRoom(true);
    try {
      const response = await fetch('/api/daily/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title.trim(), duration: 60 }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`Could not create Daily room: ${data.error || 'Unknown error'}`);
        return;
      }
      const roomUrl = data.daily?.roomUrl || data.daily?.url;
      if (roomUrl) {
        setMeetingLink(roomUrl);
        alert('Daily.co room created! Link filled below. (Set DAILY_API_KEY to make it joinable by students.)');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating Daily.co room');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const publishClass = async () => {
    if (!title.trim() || !meetingLink.trim()) {
      alert('Please fill in both title and meeting link');
      return;
    }

    if (!selectedCourseId) {
      alert('Please select a course for this live class');
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch('/api/live-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId,
          teacherName: currentTeacherName,
          courseId: selectedCourseId,
          courseTitle: selectedCourseTitle,
          title: title.trim(),
          meetingLink: meetingLink.trim(),
        }),
      });

      if (response.ok) {
        setTitle('');
        setMeetingLink('');
        setSelectedCourseId('');
        setSelectedCourseTitle('');
        fetchActiveClasses();
        alert('Live class published successfully! Email notifications sent to all enrolled students.');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error publishing class:', error);
      alert('Error publishing class');
    } finally {
      setIsPublishing(false);
    }
  };

  const endClass = async (classId: string) => {
    try {
      const response = await fetch('/api/live-classes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, teacherId }),
      });

      if (response.ok) {
        fetchActiveClasses();
      }
    } catch (error) {
      console.error('Error ending class:', error);
    }
  };

  const copyLink = async (link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publish Live Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Course</label>
            {loadingCourses ? (
              <div className="text-sm text-gray-500">Loading courses...</div>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  const courseId = e.target.value;
                  setSelectedCourseId(courseId);
                  const course = teacherCourses.find(c => c.id === courseId);
                  setSelectedCourseTitle(course?.title || '');
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Choose a course...</option>
                {teacherCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.enrollmentCount} students)
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Class Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter class title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Link</label>
            <Input
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Daily.co room link, Google Meet link, etc."
            />
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={createDailyRoom}
                disabled={isCreatingRoom}
                className="flex items-center gap-2"
              >
                {isCreatingRoom ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Video className="h-4 w-4" />
                )}
                Create Daily.co Room (Free)
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Creates a Daily.co room link and fills it above. Set DAILY_API_KEY to let students join.
              </p>
            </div>
          </div>
          <Button 
            onClick={publishClass} 
            disabled={isPublishing}
            className="w-full"
          >
            {isPublishing ? 'Publishing...' : 'Publish Live Class'}
          </Button>
        </CardContent>
      </Card>

      {activeClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-500">🔴</span>
              Your Published Live Classes ({activeClasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeClasses.map((liveClass) => (
                <div key={liveClass.id} className="border rounded-lg p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{liveClass.title}</h4>
                        <Badge className="bg-red-100 text-red-700 animate-pulse">
                          ● LIVE NOW
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4" />
                          <span className="font-medium">Meeting Link:</span>
                          <a 
                            href={liveClass.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                          >
                            {liveClass.meetingLink}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            Started {new Date(liveClass.publishedAt).toLocaleTimeString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            Visible to all students
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 min-w-[200px]">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                        onClick={() => window.open(liveClass.meetingLink, '_blank')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(liveClass.meetingLink, liveClass.id)}
                      >
                        {copied === liveClass.id ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied === liveClass.id ? 'Copied!' : 'Copy Link'}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => endClass(liveClass.id)}
                      >
                        <span className="mr-2">⏹️</span>
                        End Class
                      </Button>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Class in progress</span>
                      <span>
                        {Math.floor((Date.now() - new Date(liveClass.publishedAt).getTime()) / (1000 * 60))} minutes ago
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}