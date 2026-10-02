"use client"

import { use } from 'react';
import SimpleMeetingJoin from "@/components/meetings/simple-meeting-join";

export default function MeetingJoinRoute({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  
  return <SimpleMeetingJoin meetingId={id} />;
}
