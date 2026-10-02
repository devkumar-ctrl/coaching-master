"use client"

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Users,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

export default function CustomWebRTCMeeting({ roomId }: { roomId: string }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize local media with better error handling
  const initializeLocalMedia = async () => {
    try {
      console.log('Requesting camera and microphone access...');
      
      // First try with video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: true
      });
      
      console.log('Media stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      console.log('Audio tracks:', stream.getAudioTracks());
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Video element srcObject set');
        
        // Ensure video plays
        try {
          await localVideoRef.current.play();
          console.log('Video is playing');
        } catch (playError) {
          console.error('Video play error:', playError);
        }
      }
      
      return stream;
    } catch (error) {
      console.error('Media access error:', error);
      
      // Try audio only if video fails
      try {
        console.log('Video failed, trying audio only...');
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        
        localStreamRef.current = audioStream;
        setVideoEnabled(false);
        toast.warning('Camera not available, audio only mode');
        return audioStream;
        
      } catch (audioError) {
        console.error('Audio access error:', audioError);
        setMediaError('Could not access camera or microphone. Please check permissions.');
        throw audioError;
      }
    }
  };

  // Join meeting
  const joinMeeting = async () => {
    try {
      setIsJoining(true);
      setMediaError(null);
      
      console.log('Starting to join meeting...');
      
      // Initialize local media
      await initializeLocalMedia();
      
      setIsConnected(true);
      toast.success('🎥 Meeting started successfully!');
      
    } catch (error) {
      console.error('Error joining meeting:', error);
      setMediaError('Failed to start meeting. Please check camera/microphone permissions.');
      toast.error('Failed to start meeting');
    } finally {
      setIsJoining(false);
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    console.log('Leaving meeting...');
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Clear video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setIsConnected(false);
    setMediaError(null);
    toast.info('Left the meeting');
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !audioEnabled;
        console.log('Audio track enabled:', track.enabled);
      });
      setAudioEnabled(!audioEnabled);
      toast.success(audioEnabled ? 'Microphone muted' : 'Microphone unmuted');
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled;
        console.log('Video track enabled:', track.enabled);
      });
      setVideoEnabled(!videoEnabled);
      toast.success(videoEnabled ? 'Camera stopped' : 'Camera started');
    }
  };

  // Copy meeting link
  const copyMeetingLink = async () => {
    try {
      const meetingUrl = `${window.location.origin}/meetings/join/${roomId}`;
      await navigator.clipboard.writeText(meetingUrl);
      setCopied(true);
      toast.success('Meeting link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up...');
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle video load events
  useEffect(() => {
    const videoElement = localVideoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded');
      };
      
      const handleCanPlay = () => {
        console.log('Video can play');
      };
      
      const handleError = (e: any) => {
        console.error('Video element error:', e);
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center">
              <Video className="h-6 w-6 text-blue-600" />
              Join Meeting: {roomId}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mediaError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p className="font-medium">Media Access Error</p>
                <p className="text-sm mt-1">{mediaError}</p>
                <p className="text-xs mt-2">
                  Please click the camera/microphone icon in your browser's address bar and allow access.
                </p>
              </div>
            )}
            
            <div className="text-center">
              <div className="relative w-full max-w-md mx-auto mb-6">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                    <VideoOff className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  Preview
                </div>
              </div>
              
              <div className="flex justify-center gap-3 mb-6">
                <Button
                  variant={audioEnabled ? "outline" : "destructive"}
                  size="sm"
                  onClick={toggleAudio}
                  disabled={!localStreamRef.current}
                  className="flex items-center gap-2"
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={videoEnabled ? "outline" : "destructive"}
                  size="sm"
                  onClick={toggleVideo}
                  disabled={!localStreamRef.current}
                  className="flex items-center gap-2"
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMeetingLink}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Button 
                onClick={joinMeeting}
                disabled={isJoining}
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Start Meeting
                  </>
                )}
              </Button>

              <div className="mt-4 text-sm text-gray-600">
                <p>• Click the button above to start your meeting</p>
                <p>• Allow camera and microphone access when prompted</p>
                <p>• Share the meeting link with others to join</p>
                <p>• Meeting ID: <code className="bg-gray-100 px-1 rounded">{roomId}</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Meeting: {roomId}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-green-50 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Users className="h-4 w-4" />
            <span>1 participant</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyMeetingLink}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Share
          </Button>
          
          <Button 
            onClick={leaveMeeting}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <PhoneOff className="h-4 w-4" />
            Leave
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 gap-4 h-full max-w-4xl mx-auto">
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              You {!audioEnabled && '(muted)'}
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
              ● LIVE
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-t px-4 py-4">
        <div className="flex justify-center gap-4">
          <Button
            variant={audioEnabled ? "outline" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="flex items-center gap-2"
          >
            {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            {audioEnabled ? 'Mute' : 'Unmute'}
          </Button>
          
          <Button
            variant={videoEnabled ? "outline" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="flex items-center gap-2"
          >
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            {videoEnabled ? 'Stop Video' : 'Start Video'}
          </Button>

          <Button
            onClick={leaveMeeting}
            variant="destructive"
            size="lg"
            className="flex items-center gap-2"
          >
            <PhoneOff className="h-5 w-5" />
            End Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
