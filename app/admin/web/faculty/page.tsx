"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Star,
  Award,
  BookOpen
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  qualifications?: string[];
  experience?: number;
  specialization?: string[];
  rating?: number;
  totalStudents?: number;
  totalCourses?: number;
  isVerified?: boolean;
  status?: string;
  createdAt?: string;
}

export default function AdminWebFacultyPage() {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    qualifications: "",
    experience: "",
    specialization: "",
    totalStudents: "",
    rating: "",
    status: "",
    isVerified: false
  });

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/adm_n/login");
    } else if (session.user?.role !== "ADMIN") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchTeachers();
    }
  }, [session]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/faculty");
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          qualifications: formData.qualifications.split(",").map(q => q.trim()),
          specialization: formData.specialization.split(",").map(s => s.trim()),
          experience: parseInt(formData.experience) || 0,
          totalStudents: parseInt(formData.totalStudents) || 0,
          rating: parseFloat(formData.rating) || 0,
          status: formData.status || "Active",
          isVerified: formData.isVerified
        })
      });

      if (response.ok) {
        await fetchTeachers();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    try {
      const response = await fetch(`/api/admin/faculty/${selectedTeacher._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          qualifications: formData.qualifications.split(",").map(q => q.trim()),
          specialization: formData.specialization.split(",").map(s => s.trim()),
          experience: parseInt(formData.experience) || 0,
          totalStudents: parseInt(formData.totalStudents) || 0,
          rating: parseFloat(formData.rating) || 0,
          status: formData.status || "Active",
          isVerified: formData.isVerified
        })
      });

      if (response.ok) {
        await fetchTeachers();
        setIsDialogOpen(false);
        setSelectedTeacher(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const response = await fetch(`/api/admin/faculty/${teacherId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        await fetchTeachers();
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      bio: "",
      qualifications: "",
      experience: "",
      specialization: "",
      totalStudents: "",
      rating: "",
      status: "",
      isVerified: false
    });
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      bio: teacher.bio || "",
      qualifications: teacher.qualifications?.join(", ") || "",
      experience: teacher.experience?.toString() || "",
      specialization: teacher.specialization?.join(", ") || "",
      totalStudents: teacher.totalStudents?.toString() || "0",
      rating: teacher.rating?.toString() || "0",
      status: teacher.status || "",
      isVerified: teacher.isVerified || false
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedTeacher(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialization?.some(spec => 
      spec.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Faculty"
        description="Manage teachers and faculty members."
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Teacher
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{teachers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Teachers</p>
                <p className="text-2xl font-bold">
                  {teachers.filter(t => t.isVerified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">
                  {teachers.reduce((sum, t) => sum + (t.totalCourses || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">
                  {teachers.reduce((sum, t) => sum + (t.totalStudents || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search teachers by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Members</CardTitle>
          <CardDescription>Manage all teaching staff and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {teacher.image ? (
                            <img
                              src={teacher.image}
                              alt={teacher.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="font-medium text-primary">
                              {teacher.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialization?.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {(teacher.specialization?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(teacher.specialization?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {teacher.experience ? `${teacher.experience} years` : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{teacher.totalCourses || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{teacher.totalStudents || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{teacher.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.isVerified ? "default" : "secondary"}>
                        {teacher.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(teacher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No teachers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTeacher ? "Edit Teacher" : "Add New Teacher"}
            </DialogTitle>
            <DialogDescription>
              {selectedTeacher 
                ? "Update teacher information and qualifications" 
                : "Create a new teacher profile"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={selectedTeacher ? handleUpdateTeacher : handleCreateTeacher} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description about the teacher..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                  placeholder="PhD, M.Tech, etc. (comma separated)"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                placeholder="Mathematics, Physics, etc. (comma separated)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalStudents">Total Students</Label>
                <Input
                  id="totalStudents"
                  type="number"
                  value={formData.totalStudents}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalStudents: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  placeholder="Active, Coming Soon, etc."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVerified"
                checked={formData.isVerified}
                onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <Label htmlFor="isVerified">Verified Teacher</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedTeacher ? "Update Teacher" : "Create Teacher"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
