import { Suspense } from 'react';
import LiveClassPublisher from '@/components/meetings/live-class-publisher';
import LiveClassViewer from '@/components/meetings/live-class-viewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MeetingsTestPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Live Class System</h1>
        <p className="text-gray-600">
          Teachers can publish meeting links instantly. Students see them in real-time.
        </p>
      </div>
      
      {/* Teacher Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Teacher View</h2>
        <Suspense fallback={<div>Loading teacher interface...</div>}>
          <LiveClassPublisher 
            teacherId="teacher_123"
            teacherName="Dr. Rajesh Kumar"
          />
        </Suspense>
      </div>
      
      {/* Student Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Student Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Student 1 - Mathematics</h3>
            <Suspense fallback={<div>Loading student dashboard...</div>}>
              <LiveClassViewer 
                studentId="student_456"
                enrolledCourses={["math_101", "physics_201"]}
              />
            </Suspense>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Student 2 - General</h3>
            <Suspense fallback={<div>Loading student dashboard...</div>}>
              <LiveClassViewer 
                studentId="student_789"
                enrolledCourses={["history_301"]}
              />
            </Suspense>
          </div>
        </div>
      </div>
      
      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Simple workflow for instant live class publishing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-medium">1. Teacher Publishes</h3>
              <p className="text-sm text-gray-600">
                Teacher starts a meeting and publishes the link with course details
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-medium">2. Instant Updates</h3>
              <p className="text-sm text-gray-600">
                All enrolled students see the live class link immediately on their dashboard
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-medium">3. One-Click Join</h3>
              <p className="text-sm text-gray-600">
                Students click "Join Now" to enter the meeting directly in their browser
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">For Teachers:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Paste a meeting link (Zoom, Google Meet, etc.) in the publisher</li>
                <li>Add class title and optional course details</li>
                <li>Click "Publish Live Class" - it appears instantly for students</li>
                <li>Manage active classes and end them when done</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">For Students:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Live classes appear automatically on your dashboard</li>
                <li>Click "Join Now" to enter the meeting</li>
                <li>See class progress and teacher information</li>
                <li>No authentication needed - direct access to published links</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
