"use client"

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  MessageCircle, 
  Share, 
  Phone,
  PhoneOff,
  Settings,
  Maximize,
  Minimize,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface JitsiMeetingRoomProps {
  roomId: string;
  domain?: string;
  userInfo: {
    displayName: string;
    email: string;
    role?: string; // Made optional since we don't need role-based features
  };
  config?: {
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    enableRecording?: boolean;
    enableChat?: boolean;
    enableScreenShare?: boolean;
  };
  onMeetingEnd?: () => void;
  onParticipantJoined?: (participant: any) => void;
  onParticipantLeft?: (participant: any) => void;
}

export default function JitsiMeetingRoom({
  roomId,
  domain = "meet.jit.si",
  userInfo,
  config = {},
  onMeetingEnd,
  onParticipantJoined,
  onParticipantLeft
}: JitsiMeetingRoomProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [isMuted, setIsMuted] = useState(config.startWithAudioMuted || false);
  const [isVideoMuted, setIsVideoMuted] = useState(config.startWithVideoMuted || false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://${domain}/external_api.js`;
        script.async = true;
        script.onload = () => resolve(window.JitsiMeetExternalAPI);
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadJitsiScript();

        if (!jitsiContainerRef.current) {
          throw new Error('Container ref not available');
        }

        // Jitsi Meet configuration
        const options = {
          roomName: roomId,
          width: '100%',
          height: 500,
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: config.startWithAudioMuted || false,
            startWithVideoMuted: config.startWithVideoMuted || false,
            enableWelcomePage: false,
            enableClosePage: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            enableLayerSuspension: true,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
            resolution: 720,
            maxFullResolutionParticipants: 2,
            channelLastN: 20,
            // Disable lobby and authentication - anyone can join
            enableLobbyChat: false,
            disableLobbyPassword: true,
            enableInsecureRoomNameWarning: false,
            requireDisplayName: false,
            // Recording settings - simplified
            recordingService: config.enableRecording ? {
              enabled: true,
              sharingEnabled: true // Anyone can record for simplicity
            } : { enabled: false },
            // Chat settings
            disableChat: !config.enableChat,
            // Screen sharing
            desktopSharingFrameRate: {
              min: 5,
              max: 30
            },
            // Security settings for public rooms
            enableUserRolesBasedOnToken: false,
            enableFeaturesBasedOnToken: false
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop',
              'chat', 'recording', 'livestreaming', 'etherpad',
              'sharedvideo', 'settings', 'raisehand', 'videoquality',
              'filmstrip', 'feedback', 'stats', 'shortcuts'
            ].filter(button => {
              // Filter buttons based on permissions
              if (button === 'recording' && !config.enableRecording) return false;
              if (button === 'chat' && !config.enableChat) return false;
              if (button === 'desktop' && !config.enableScreenShare) return false;
              return true;
            }),
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            DISABLE_PRESENCE_STATUS: false,
            DISABLE_RINGING: false,
            AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
            AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',
            POLICY_LOGO: null,
            LOCAL_THUMBNAIL_RATIO: 16 / 9,
            REMOTE_THUMBNAIL_RATIO: 1,
            LIVE_STREAMING_HELP_LINK: 'https://jitsi.org/live',
            MOBILE_APP_PROMO: false
          },
          userInfo: {
            displayName: userInfo.displayName,
            email: userInfo.email
          }
        };

        // Initialize Jitsi Meet API
        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
        apiRef.current.addEventListeners({
          readyToClose: () => {
            setIsConnected(false);
            onMeetingEnd?.();
          },
          participantJoined: (participant: any) => {
            setParticipantCount(prev => prev + 1);
            onParticipantJoined?.(participant);
            toast.success(`${participant.displayName} joined the meeting`);
          },
          participantLeft: (participant: any) => {
            setParticipantCount(prev => Math.max(0, prev - 1));
            onParticipantLeft?.(participant);
            toast.info(`${participant.displayName} left the meeting`);
          },
          audioMuteStatusChanged: (event: any) => {
            setIsMuted(event.muted);
          },
          videoMuteStatusChanged: (event: any) => {
            setIsVideoMuted(event.muted);
          },
          endpointTextMessageReceived: (event: any) => {
            // Handle chat messages if needed
            console.log('Chat message received:', event);
          },
          videoConferenceJoined: () => {
            setIsConnected(true);
            setIsLoading(false);
            toast.success('Successfully joined the meeting!');
          },
          videoConferenceLeft: () => {
            setIsConnected(false);
          },
          participantRoleChanged: (event: any) => {
            console.log('Participant role changed:', event);
          }
        });

        // Set display name and email
        if (userInfo.displayName) {
          apiRef.current.executeCommand('displayName', userInfo.displayName);
        }

      } catch (error) {
        console.error('Error initializing Jitsi:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize meeting');
        setIsLoading(false);
        toast.error('Failed to join meeting');
      }
    };

    initializeJitsi();

    // Cleanup
    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomId, domain, userInfo, config, onMeetingEnd, onParticipantJoined, onParticipantLeft]);

  const toggleAudio = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleVideo');
    }
  };

  const toggleChat = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleChat');
    }
  };

  const toggleScreenShare = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleShareScreen');
    }
  };

  const hangUp = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('hangup');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      jitsiContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Meeting Error
          </CardTitle>
          <CardDescription>Failed to join the meeting room</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Meeting Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "🔴 Live" : "⏸️ Connecting..."}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
                disabled={!isConnected}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVideo}
                disabled={!isConnected}
              >
                {isVideoMuted ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
              
              {config.enableChat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleChat}
                  disabled={!isConnected}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              
              {config.enableScreenShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleScreenShare}
                  disabled={!isConnected}
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                disabled={!isConnected}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={hangUp}
                disabled={!isConnected}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Jitsi Meeting Container */}
      <Card className="relative">
        <CardContent className="p-0">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Connecting to meeting...</p>
              </div>
            </div>
          )}
          
          <div 
            ref={jitsiContainerRef}
            className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-900"
            style={{ minHeight: '500px' }}
          />
        </CardContent>
      </Card>
      
      {/* Meeting Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Room ID</p>
              <p className="text-muted-foreground">{roomId}</p>
            </div>
            <div>
              <p className="font-medium">Display Name</p>
              <p className="text-muted-foreground">{userInfo.displayName}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="text-muted-foreground">{isConnected ? 'Connected' : 'Disconnected'}</p>
            </div>
            <div>
              <p className="font-medium">Participants</p>
              <p className="text-muted-foreground">{participantCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
