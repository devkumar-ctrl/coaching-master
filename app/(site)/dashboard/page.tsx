"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      redirect("/auth/signin");
      return;
    }
    const role = session.user.role;
    const id = session.user.id;
    if (role === "ADMIN") {
      redirect("/admin");
    } else if (role === "COACH") {
      redirect(`/dashboard/teacher/${id}`);
    } else {
      redirect(`/dashboard/student/${id}`);
    }
  }, [session, status]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}