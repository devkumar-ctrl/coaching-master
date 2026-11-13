"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarClock,
  FileVideo,
  Loader2,
  Plus,
  Radio,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";

interface CourseOption {
  _id: string;
  title: string;
}

interface LessonRow {
  id: string;
  title: string;
  type: "live" | "recorded";
  courseTitle: string;
  moduleTitle: string;
  scheduledAt: string | null;
  duration: number | null;
  status: string;
  joinState: string;
  isPublished: boolean;
  roomConfigured?: boolean;
}

function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AdminLessonsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"live" | "recorded">("live");
  const [form, setForm] = useState({
    title: "",
    description: "",
    moduleTitle: "Lessons",
    scheduledAt: toLocalInput(new Date(Date.now() + 86_400_000)),
    duration: "60",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    videoUrl: "",
    videoPublicId: "",
    isPublished: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) redirect("/auth/signin");
    if (session && session.user?.role !== "ADMIN" && session.user?.role !== "COACH") {
      redirect("/dashboard");
    }
  }, [session, sessionStatus]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to load courses");
      const data: CourseOption[] = await res.json();
      setCourses(data);
      if (data.length && !selectedCourse) setSelectedCourse(data[0]._id);
    } catch {
      toast.error("Failed to load courses");
    }
  }, [selectedCourse]);

  const loadLessons = useCallback(async (courseId: string) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons?courseId=${courseId}`);
      if (!res.ok) throw new Error("Failed to load lessons");
      setLessons(await res.json());
    } catch {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (selectedCourse) void loadLessons(selectedCourse);
  }, [selectedCourse, loadLessons]);

  const openDialog = (nextMode: "live" | "recorded") => {
    setMode(nextMode);
    setForm({
      title: "",
      description: "",
      moduleTitle: "Lessons",
      scheduledAt: toLocalInput(new Date(Date.now() + 86_400_000)),
      duration: "60",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      videoUrl: "",
      videoPublicId: "",
      isPublished: true,
    });
    setDialogOpen(true);
  };

  const handleVideoUpload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "lessons");
      const res = await fetch("/api/upload/video", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setForm((prev) => ({
        ...prev,
        videoUrl: data.url,
        videoPublicId: data.publicId,
        duration: data.duration ? String(data.duration) : prev.duration,
      }));
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error("Select a course first");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    if (mode === "recorded" && !form.videoUrl.trim()) {
      toast.error("Upload a video or paste a video URL");
      return;
    }
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {
        courseId: selectedCourse,
        type: mode,
        title: form.title.trim(),
        description: form.description.trim(),
        moduleTitle: form.moduleTitle.trim() || "Lessons",
        isPublished: form.isPublished,
      };
      if (mode === "live") {
        payload.scheduledAt = new Date(form.scheduledAt).toISOString();
        payload.duration = Number(form.duration) || 60;
        payload.timezone = form.timezone;
      } else {
        payload.videoUrl = form.videoUrl.trim();
        payload.videoPublicId = form.videoPublicId;
        payload.duration = Number(form.duration) || undefined;
        payload.source = "upload";
      }

      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save lesson");
      toast.success(data.message || "Lesson saved");
      if (mode === "live" && data.dailyConfigured === false) {
        toast.info("Add DAILY_API_KEY to make live rooms joinable.");
      }
      setDialogOpen(false);
      void loadLessons(selectedCourse);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save lesson");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Lesson deleted");
      void loadLessons(selectedCourse);
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  const sorted = useMemo(
    () => [...lessons].sort((a, b) => (a.scheduledAt || "").localeCompare(b.scheduledAt || "")),
    [lessons]
  );

  return (
    <div>
      <AdminPageHeader
        title="Lessons & Live Classes"
        description="Schedule live classes and publish recorded lessons for each course."
        actions={
          <>
            <Button variant="outline" onClick={() => openDialog("recorded")}>
              <FileVideo className="mr-2 h-4 w-4" /> Add recorded lesson
            </Button>
            <Button onClick={() => openDialog("live")}>
              <Plus className="mr-2 h-4 w-4" /> Schedule live class
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Course</CardTitle>
          <CardDescription>Choose a course to manage its lessons.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full sm:w-96">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lessons</CardTitle>
          <CardDescription>{sorted.length} item(s) in this course.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : sorted.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No lessons yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">
                      {lesson.title}
                      <span className="block text-xs text-muted-foreground">{lesson.moduleTitle}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        {lesson.type === "live" ? (
                          <Radio className="h-3 w-3" />
                        ) : (
                          <FileVideo className="h-3 w-3" />
                        )}
                        {lesson.type === "live" ? "Live" : "Recorded"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lesson.scheduledAt ? new Date(lesson.scheduledAt).toLocaleString() : "—"}
                      {lesson.duration ? ` · ${lesson.duration}m` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lesson.isPublished ? "default" : "secondary"}>
                        {lesson.isPublished ? "Published" : "Draft"}
                      </Badge>
                      {lesson.type === "live" && lesson.roomConfigured === false && (
                        <span className="mt-1 block text-xs text-muted-foreground">Room not configured</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {mode === "live" ? <CalendarClock className="h-5 w-5" /> : <FileVideo className="h-5 w-5" />}
              {mode === "live" ? "Schedule Live Class" : "Add Recorded Lesson"}
            </DialogTitle>
            <DialogDescription>
              {mode === "live"
                ? "A Daily.co room is created automatically and enrolled students are notified."
                : "Upload a video or paste a URL to add an on-demand lesson."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Title</Label>
              <Input
                id="lesson-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Introduction to React"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-module">Module</Label>
              <Input
                id="lesson-module"
                value={form.moduleTitle}
                onChange={(e) => setForm({ ...form, moduleTitle: e.target.value })}
                placeholder="e.g. Module 1: Fundamentals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-desc">Description</Label>
              <Textarea
                id="lesson-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            {mode === "live" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="lesson-when">Date & time</Label>
                    <Input
                      id="lesson-when"
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lesson-duration">Duration (min)</Label>
                    <Input
                      id="lesson-duration"
                      type="number"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-tz">Timezone</Label>
                  <Input
                    id="lesson-tz"
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="lesson-video">Video</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="lesson-video"
                    type="file"
                    accept="video/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleVideoUpload(file);
                    }}
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                </div>
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="…or paste a video URL"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
              <Label htmlFor="lesson-published" className="cursor-pointer">
                Publish now
              </Label>
              <Switch
                id="lesson-published"
                checked={form.isPublished}
                onCheckedChange={(checked) => setForm({ ...form, isPublished: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={busy || uploading}>
              {busy ? "Saving..." : mode === "live" ? "Schedule class" : "Add lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
