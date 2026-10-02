"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  BookOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Globe,
  FilePenLine,
  UploadCloud,
  Loader2,
  GraduationCap,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";

const CATEGORIES = [
  "cyber-security",
  "ethical-hacking",
  "ai-ml",
  "data-science",
  "iot-embedded",
  "robotics",
  "web-development",
  "ev-technology",
  "cloud-devops",
  "python",
];

const LEVELS = ["beginner", "intermediate", "advanced"];
const DELIVERY_MODES = ["live-online", "recorded", "hybrid", "classroom"];
const STATUSES = ["draft", "published", "archived"];

const inr = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");

interface Course {
  _id: string;
  title: string;
  tagline?: string;
  description?: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  duration?: string;
  level?: string;
  deliveryMode?: string;
  totalClasses?: number;
  image?: string | null;
  status: string;
  featured?: boolean;
  syllabus?: string;
  prerequisites?: string;
  outcomes?: string;
  materials?: string;
  assessments?: string;
  tags?: string[];
  teacherId?: string;
  teacherName?: string;
  teacherImage?: string | null;
  enrollmentCount?: number;
  averageRating?: number;
  createdAt: string;
}

const emptyForm = {
  title: "",
  tagline: "",
  description: "",
  category: "cyber-security",
  categoryCustom: "",
  level: "beginner",
  deliveryMode: "live-online",
  duration: "",
  totalClasses: "0",
  price: "0",
  compareAtPrice: "0",
  image: "",
  featured: false,
  status: "draft",
  teacherId: "",
  syllabus: "",
  prerequisites: "",
  outcomes: "",
  materials: "",
  assessments: "",
  tags: "",
};

type CourseForm = typeof emptyForm;

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-600 hover:bg-emerald-600",
  draft: "bg-amber-500 hover:bg-amber-500 text-white",
  archived: "bg-muted text-muted-foreground hover:bg-muted",
};

export default function AdminCoursesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) {
      redirect("/adm_n/login");
    } else if (session.user?.role !== "ADMIN") {
      redirect("/auth/signin");
    }
  }, [session, sessionStatus]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to load courses");
      const data = await res.json();
      setCourses(
        (Array.isArray(data) ? data : []).map((c: any) => ({
          ...c,
          featured: !!c.featured,
          price: c.price || 0,
          createdAt: c.createdAt || "",
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      loadCourses();
    }
  }, [session, loadCourses]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        (course.teacherName || "").toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, search, categoryFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((c) => c.status === "published").length,
      drafts: courses.filter((c) => c.status === "draft").length,
      featured: courses.filter((c) => c.featured).length,
    }),
    [courses]
  );

  const set = (key: keyof CourseForm) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditing(course);
    setForm({
      title: course.title || "",
      tagline: course.tagline || "",
      description: course.description || "",
      category: course.category || "other",
      categoryCustom: CATEGORIES.includes(course.category || "") ? "" : course.category || "",
      level: course.level || "beginner",
      deliveryMode: course.deliveryMode || "live-online",
      duration: course.duration || "",
      totalClasses: String(course.totalClasses || 0),
      price: String(course.price || 0),
      compareAtPrice: String(course.compareAtPrice || 0),
      image: course.image || "",
      featured: !!course.featured,
      status: course.status || "draft",
      teacherId: course.teacherId || "",
      syllabus: course.syllabus || "",
      prerequisites: course.prerequisites || "",
      outcomes: course.outcomes || "",
      materials: course.materials || "",
      assessments: course.assessments || "",
      tags: (course.tags || []).join(", "),
    });
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "courses");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || data.message || "Upload failed");
      }
      setForm((f) => ({ ...f, image: data.imageUrl }));
      toast.success("Banner uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitCategory = () => {
    if (CATEGORIES.includes(form.category)) return form.category;
    const custom = form.categoryCustom.trim();
    return custom || "other";
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      category: submitCategory(),
      level: form.level,
      deliveryMode: form.deliveryMode,
      duration: form.duration.trim(),
      totalClasses: parseInt(form.totalClasses) || 0,
      price: parseFloat(form.price) || 0,
      compareAtPrice: parseFloat(form.compareAtPrice) || 0,
      image: form.image.trim(),
      featured: form.featured,
      status: form.status,
      teacherId: form.teacherId.trim(),
      syllabus: form.syllabus.trim(),
      prerequisites: form.prerequisites.trim(),
      outcomes: form.outcomes.trim(),
      materials: form.materials.trim(),
      assessments: form.assessments.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      const res = await fetch(
        editing ? `/api/admin/courses/${editing._id}` : "/api/admin/courses",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      toast.success(editing ? "Course updated" : "Course created");
      setDialogOpen(false);
      loadCourses();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const patchCourse = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      toast.success("Course updated");
      loadCourses();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  const handleStatus = (course: Course, next: string) =>
    patchCourse(course._id, { status: next });

  const handleFeature = (course: Course) =>
    patchCourse(course._id, { featured: !course.featured });

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setBusyId(course._id);
    try {
      const res = await fetch(`/api/admin/courses/${course._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Course deleted");
      loadCourses();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const actionItems = (course: Course) => {
    if (course.status === "published") {
      return (
        <>
          <DropdownMenuItem onSelect={() => handleStatus(course, "draft")}>
            <FilePenLine className="mr-2 h-4 w-4" /> Move to Draft
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleStatus(course, "archived")}>
            <Globe className="mr-2 h-4 w-4" /> Archive
          </DropdownMenuItem>
        </>
      );
    }
    return (
      <>
        <DropdownMenuItem onSelect={() => handleStatus(course, "published")}>
          <Globe className="mr-2 h-4 w-4 text-emerald-600" /> Publish
        </DropdownMenuItem>
        {course.status === "archived" && (
          <DropdownMenuItem onSelect={() => handleStatus(course, "draft")}>
            <FilePenLine className="mr-2 h-4 w-4" /> Move to Draft
          </DropdownMenuItem>
        )}
      </>
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Courses"
        description="Create, edit and publish courses with banners and pricing."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "All Courses",
            value: stats.total,
            icon: <BookOpen className="h-4 w-4 text-purple-600" />,
            bg: "bg-purple-50 text-purple-600",
          },
          {
            label: "Published",
            value: stats.published,
            icon: <Globe className="h-4 w-4 text-emerald-600" />,
            bg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Drafts",
            value: stats.drafts,
            icon: <FilePenLine className="h-4 w-4 text-amber-600" />,
            bg: "bg-amber-50 text-amber-600",
          },
          {
            label: "Featured",
            value: stats.featured,
            icon: <Star className="h-4 w-4 text-yellow-600" />,
            bg: "bg-yellow-50 text-yellow-600",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold leading-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">All Courses</CardTitle>
            <CardDescription>{filtered.length} of {courses.length} courses</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-56 pl-8"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!filtered.length ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No courses match your filters.
              </p>
              <Button variant="outline" size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[260px]">Course</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Enrollments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{course.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {course.duration || course.level || course.category} ·{" "}
                              {course.tagline || course.teacherName || "No tagline"}
                              {course.averageRating ? (
                                <span className="ml-1 inline-flex items-center gap-0.5 text-yellow-600">
                                  <Star className="h-3 w-3 fill-current" />
                                  {course.averageRating}
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[11px]">
                          {course.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-medium">{inr(course.price)}</span>
                          {course.compareAtPrice && course.compareAtPrice > course.price ? (
                            <span className="text-xs text-muted-foreground line-through">
                              {inr(course.compareAtPrice)}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                          {course.enrollmentCount || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            STATUS_STYLES[course.status] || "bg-muted text-muted-foreground"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={course.featured ? "text-yellow-500" : "text-muted-foreground"}
                          onClick={() => handleFeature(course)}
                          title={course.featured ? "Unfeature" : "Feature"}
                          disabled={busyId === course._id}
                        >
                          <Star className={`h-4 w-4 ${course.featured ? "fill-current" : ""}`} />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {actionItems(course)}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => openEdit(course)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => handleDelete(course)}
                              disabled={busyId === course._id}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the course details below."
                : "Create a course. It will stay a draft until you publish it."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Course Banner</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-32 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg border bg-muted sm:w-56">
                  {form.image ? (
                    <img src={form.image} alt="Course banner" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-6 w-6" />
                      No banner
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="image-file" className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="h-4 w-4" />
                      )}
                      {uploading ? "Uploading..." : "Upload banner"}
                    </span>
                    <input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file);
                      }}
                    />
                  </Label>
                  <Input
                    className="h-9 text-sm"
                    placeholder="...or paste an image URL"
                    value={form.image}
                    onChange={(e) => set("image")(e.target.value)}
                  />
                  {form.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-fit text-xs text-muted-foreground"
                      onClick={() => set("image")("")}
                    >
                      <X className="mr-1 h-3 w-3" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title")(e.target.value)}
                  placeholder="e.g. Ethical Hacking Masterclass"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(e) => set("tagline")(e.target.value)}
                  placeholder="A short, punchy one-liner"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-24"
                  value={form.description}
                  onChange={(e) => set("description")(e.target.value)}
                  placeholder="What will students learn in this course?"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={CATEGORIES.includes(form.category) ? form.category : "other"}
                  onValueChange={(v) => {
                    if (v === "other") {
                      set("category")("other");
                    } else {
                      setForm((f) => ({ ...f, category: v, categoryCustom: "" }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other / Custom</SelectItem>
                  </SelectContent>
                </Select>
                {!CATEGORIES.includes(form.category) ? (
                  <Input
                    className="mt-2 h-9"
                    placeholder="Custom category name"
                    value={form.categoryCustom}
                    onChange={(e) => set("categoryCustom")(e.target.value)}
                  />
                ) : null}
              </div>
              <div>
                <Label>Level</Label>
                <Select value={form.level} onValueChange={set("level")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Mode</Label>
                <Select value={form.deliveryMode} onValueChange={set("deliveryMode")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(e) => set("duration")(e.target.value)}
                    placeholder="e.g. 6 Months"
                  />
                </div>
                <div>
                  <Label htmlFor="totalClasses">Total Classes</Label>
                  <Input
                    id="totalClasses"
                    type="number"
                    value={form.totalClasses}
                    onChange={(e) => set("totalClasses")(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price")(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Old Price (₹)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(e) => set("compareAtPrice")(e.target.value)}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={set("status")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacherId">Teacher ID</Label>
                <Input
                  id="teacherId"
                  value={form.teacherId}
                  onChange={(e) => set("teacherId")(e.target.value)}
                  placeholder="Optional — user/teacher ID"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => set("tags")(e.target.value)}
                  placeholder="Comma separated, e.g. cybersecurity, hacking, kali"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Featured on homepage</p>
                <p className="text-xs text-muted-foreground">
                  Highlight this course across the site.
                </p>
              </div>
              <Switch checked={form.featured} onCheckedChange={set("featured")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="syllabus">Syllabus</Label>
                <Textarea
                  id="syllabus"
                  className="min-h-20"
                  value={form.syllabus}
                  onChange={(e) => set("syllabus")(e.target.value)}
                  placeholder="Module-wise curriculum, one topic per line"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="outcomes">Learning Outcomes</Label>
                <Textarea
                  id="outcomes"
                  className="min-h-20"
                  value={form.outcomes}
                  onChange={(e) => set("outcomes")(e.target.value)}
                  placeholder="What will students be able to do after this course?"
                />
              </div>
              <div>
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  className="min-h-20"
                  value={form.prerequisites}
                  onChange={(e) => set("prerequisites")(e.target.value)}
                  placeholder="Skills or knowledge expected before starting"
                />
              </div>
              <div>
                <Label htmlFor="materials">Materials</Label>
                <Textarea
                  id="materials"
                  className="min-h-20"
                  value={form.materials}
                  onChange={(e) => set("materials")(e.target.value)}
                  placeholder="Resources, tools and study material"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="assessments">Assessments</Label>
                <Textarea
                  id="assessments"
                  className="min-h-20"
                  value={form.assessments}
                  onChange={(e) => set("assessments")(e.target.value)}
                  placeholder="Tests, projects and certification details"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving || uploading}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editing ? (
                  "Save Changes"
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}