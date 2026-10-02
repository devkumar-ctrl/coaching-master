"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  Clock, 
  Users, 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Settings,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff
} from "lucide-react";
import { toast } from "sonner";
// import JitsiMeetingRoom from "@/components/meetings/jitsi-meeting-room";

interface MeetingAccess {
  canJoin: boolean;
  role: 'moderator' | 'participant';
  meeting: {
    id: string;
    topic: string;
    roomId: string;
    domain: string;
    scheduledAt: string;
    duration: number;
    status: string;
  };
  access: {
    url: string;
    embedUrl: string;
    roomName: string;
    userInfo: {
      displayName: string;
      email: string;
      role: 'moderator' | 'participant';
    };
    config: {
      startWithAudioMuted: boolean;
      startWithVideoMuted: boolean;
      enableWelcomePage: boolean;
      enableClosePage: boolean;
      hideDisplayName: boolean;
      disableModeratorIndicator: boolean;
      backgroundAlpha: number;
    };
  };
}

export default function MeetingJoinPage({ meetingId }: { meetingId: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Meeting: {meetingId}</h1>
      <div className="mt-4 p-4 border rounded">
        <p>Meeting functionality temporarily disabled for debugging.</p>
        <p>Meeting ID: {meetingId}</p>
      </div>
    </div>
  );
}
