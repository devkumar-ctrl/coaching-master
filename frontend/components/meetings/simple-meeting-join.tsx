"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DailyMeeting from './daily-meeting';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Video } from "lucide-react";

interface DailyRoomResponse {
  id: string;
  roomName: string;
  daily?: {
    roomId: string;
    roomUrl: string;
    url: string;
    privacy: string;
  };
}

export default function SimpleMeetingJoin({ meetingId }: { meetingId: string }) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [room, setRoom] = useState<DailyRoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (!session?.user) {
      router.replace(`/auth/signin?callbackUrl=/meetings/join/${meetingId}`);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/daily/meetings?id=${encodeURIComponent(meetingId)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error || 'Could not load meeting details');
          return;
        }
        const data = await res.json();
        if (!cancelled) setRoom(data);
      } catch (e) {
        if (!cancelled) setError('Failed to load meeting. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [meetingId, session, sessionStatus, router]);

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Connecting to live class...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Unable to join
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard/student/' + session?.user?.id)}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (room?.daily?.roomUrl) {
    return (
      <DailyMeeting
        roomUrl={room.daily.roomUrl}
        roomId={room.roomName || meetingId}
        userName={session?.user?.name || "Student"}
      />
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Live Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This class uses Daily.co. Make sure DAILY_API_KEY is configured to create a joinable room.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}