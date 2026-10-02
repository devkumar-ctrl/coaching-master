"use client"

import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone,
  PhoneOff,
  Users,
  MessageCircle,
  Monitor,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface DailyMeetingProps {
  roomUrl: string;
  roomId: string;
  userName?: string;
}

export default function DailyMeeting({ roomUrl, roomId, userName = "Participant" }: DailyMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Daily call frame
    const callFrame = DailyIframe.createFrame(containerRef.current, {
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '8px'
      },
      showLeaveButton: true,
      showFullscreenButton: true,
      showLocalVideo: true,
      showParticipantsBar: true,
      activeSpeakerMode: true,
      theme: {
        colors: {
          accent: '#3B82F6',
          accentText: '#FFFFFF',
          background: '#FFFFFF',
          backgroundAccent: '#F8FAFC',
          baseText: '#1F2937',
          border: '#E5E7EB',
          mainAreaBg: '#F9FAFB',
          mainAreaBgAccent: '#F3F4F6',
          mainAreaText: '#111827',
          supportiveText: '#6B7280'
        }
      }
    });

    callFrameRef.current = callFrame;

    // Event listeners
    callFrame
      .on('loading', () => {
        setIsLoading(true);
        setError(null);
      })
      .on('loaded', () => {
        setIsLoading(false);
      })
      .on('started-camera', () => {
        setVideoEnabled(true);
      })
      .on('camera-error', () => {
        setVideoEnabled(false);
        toast.error('Camera access denied or not available');
      })
      .on('joined-meeting', () => {
        setIsJoined(true);
        setIsLoading(false);
        toast.success('Joined meeting successfully!');
      })
      .on('left-meeting', () => {
        setIsJoined(false);
        toast.info('Left the meeting');
      })
      .on('participant-joined', (event) => {
        setParticipantCount(Object.keys(callFrame.participants()).length);
        if (event.participant.user_name) {
          toast.success(`${event.participant.user_name} joined the meeting`);
        }
      })
      .on('participant-left', (event) => {
        setParticipantCount(Object.keys(callFrame.participants()).length);
        if (event.participant.user_name) {
          toast.info(`${event.participant.user_name} left the meeting`);
        }
      })
      .on('error', (event) => {
        console.error('Daily.co error:', event);
        setError(event.errorMsg || 'An error occurred');
        setIsLoading(false);
        toast.error('Meeting error: ' + (event.errorMsg || 'Unknown error'));
      });

    // Join the meeting
    callFrame.join({
      url: roomUrl,
      userName: userName,
      startVideoOff: false,
      startAudioOff: false
    }).catch((error) => {
      console.error('Failed to join meeting:', error);
      setError('Failed to join meeting');
      setIsLoading(false);
      toast.error('Failed to join meeting');
    });

    // Cleanup
    return () => {
      if (callFrame) {
        callFrame.destroy();
      }
    };
  }, [roomUrl, userName]);

  const toggleAudio = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalAudio(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalVideo(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  const leaveMeeting = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
    }
  };

  const toggleScreenShare = () => {
    if (callFrameRef.current) {
      if (callFrameRef.current.localScreenshare()) {
        callFrameRef.current.stopScreenShare();
      } else {
        callFrameRef.current.startScreenShare();
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Meeting Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Joining Meeting: {roomId}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Connecting to meeting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Meeting: {roomId}</span>
          </div>
          
          {isJoined && (
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-green-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Users className="h-4 w-4" />
              <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isJoined && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleAudio}
                className={audioEnabled ? '' : 'bg-red-50 border-red-200'}
              >
                {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-600" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleVideo}
                className={videoEnabled ? '' : 'bg-red-50 border-red-200'}
              >
                {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-600" />}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleScreenShare}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </>
          )}
          
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

      {/* Meeting Container */}
      <div className="flex-1 p-4">
        <div 
          ref={containerRef} 
          className="w-full h-full bg-gray-900 rounded-lg overflow-hidden shadow-lg"
          style={{ minHeight: '500px' }}
        />
      </div>

      {/* Footer with additional info */}
      <div className="bg-white border-t px-4 py-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>🎥 Powered by Daily.co</span>
            {isJoined && (
              <span className="text-green-600 font-medium">● Connected</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span>Share meeting: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              /meetings/join/{roomId}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
