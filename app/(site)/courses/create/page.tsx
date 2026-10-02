"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function CoursesCreate() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      redirect("/auth/signin");
    }
    
    if (session.user.role !== "COACH") {
      redirect("/");
    }
    
    // Redirect to the teacher's create course page
    redirect(`/dashboard/teacher/create-course`);
  }, [session, status]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}
