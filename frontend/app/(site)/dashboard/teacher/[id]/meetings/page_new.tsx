"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LiveClassPublisher from "@/components/meetings/live-class-publisher";

export default function TeacherMeetings() {
  const { data: session, status } = useSession();
  const params = useParams();
  const teacherId = params.id as string;

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/teacher/${teacherId}`}>
            <Button variant="outline" size="sm" className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {session?.user?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Live Class Publisher 🔴
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Publish meeting links that appear instantly on student dashboards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Class Publisher */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <LiveClassPublisher 
            teacherId={teacherId} 
            teacherName={session?.user?.name || 'Teacher'} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
