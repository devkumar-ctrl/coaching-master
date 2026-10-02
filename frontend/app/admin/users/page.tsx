"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  BookOpen,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/page-header";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'STUDENT' | 'COACH' | 'ADMIN';
  phone?: string;
  location?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  // Teacher specific
  qualifications?: string[];
  specialization?: string[];
  experience?: string;
  totalStudents?: number;
  totalCourses?: number;
  // Student specific
  enrolledCourses?: number;
  completedCourses?: number;
}

interface UserStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "STUDENT",
    phone: "",
    location: "",
    bio: ""
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
      fetchUsers();
      fetchStats();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched users:', data); // Debug log
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
        toast.error(`Failed to fetch users: ${response.status}`);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched stats:', data); // Debug log
        setStats(data);
      } else {
        console.error('Failed to fetch stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
        fetchStats();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success('User created successfully');
        setShowCreateDialog(false);
        setNewUser({
          name: "",
          email: "",
          role: "STUDENT",
          phone: "",
          location: "",
          bio: ""
        });
        fetchUsers();
        fetchStats();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
          location: editingUser.location,
          bio: editingUser.bio,
          role: editingUser.role,
          isVerified: editingUser.isVerified
        }),
      });

      if (response.ok) {
        toast.success('User updated successfully');
        setShowEditDialog(false);
        setEditingUser(null);
        fetchUsers();
        fetchStats();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerificationToggle = async (userId: string, isVerified: boolean) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified }),
      });

      if (response.ok) {
        toast.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
        fetchUsers();
        fetchStats();
      } else {
        toast.error('Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error('Failed to update verification status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
        fetchStats();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'COACH':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><GraduationCap className="h-3 w-3 mr-1" />Teacher</Badge>;
      case 'STUDENT':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><BookOpen className="h-3 w-3 mr-1" />Student</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge variant="outline" className="text-green-600 border-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        <XCircle className="h-3 w-3 mr-1" />Unverified
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter.toUpperCase();
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "verified" && user.isVerified) ||
                         (statusFilter === "unverified" && !user.isVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof User];
    const bValue = b[sortBy as keyof User];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
        title="Users"
        description="Manage all users and their roles."
        actions={
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specified role
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="COACH">Teacher</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newUser.location}
                  onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newUser.bio}
                  onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                  placeholder="Enter bio"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-blue-600">All platform users</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{stats?.totalStudents || 0}</p>
                <p className="text-xs text-green-600">Active learners</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold">{stats?.totalTeachers || 0}</p>
                <p className="text-xs text-purple-600">Course instructors</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{stats?.verifiedUsers || 0}</p>
                <p className="text-xs text-yellow-600">Verified accounts</p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="coach">Teachers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Latest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="role-asc">Role A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage all platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.image || ""} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            {getRoleBadge(user.role)}
                            {getVerificationBadge(user.isVerified)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {user.phone}
                              </div>
                            )}
                            {user.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {user.location}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {user.role === 'COACH' && (
                            <div className="flex gap-4 text-sm">
                              <span>Courses: {user.totalCourses || 0}</span>
                              <span>Students: {user.totalStudents || 0}</span>
                            </div>
                          )}
                          
                          {user.role === 'STUDENT' && (
                            <div className="flex gap-4 text-sm">
                              <span>Enrolled: {user.enrolledCourses || 0}</span>
                              <span>Completed: {user.completedCourses || 0}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                Complete user information and statistics
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedUser.image || ""} alt={selectedUser.name} />
                                    <AvatarFallback className="text-lg">
                                      {selectedUser.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                      {getRoleBadge(selectedUser.role)}
                                      {getVerificationBadge(selectedUser.isVerified)}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {selectedUser.email}
                                      </div>
                                      {selectedUser.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4" />
                                          {selectedUser.phone}
                                        </div>
                                      )}
                                      {selectedUser.location && (
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          {selectedUser.location}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedUser.bio && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Bio</h4>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                      {selectedUser.bio}
                                    </p>
                                  </div>
                                )}

                                {selectedUser.role === 'COACH' && (
                                  <>
                                    {selectedUser.qualifications && selectedUser.qualifications.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Qualifications</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedUser.qualifications.map((qual, index) => (
                                            <Badge key={index} variant="outline">
                                              {qual}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {selectedUser.specialization && selectedUser.specialization.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Specialization</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedUser.specialization.map((spec, index) => (
                                            <Badge key={index} variant="secondary">
                                              {spec}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2">Teaching Stats</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span>Total Courses:</span>
                                            <span>{selectedUser.totalCourses || 0}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Total Students:</span>
                                            <span>{selectedUser.totalStudents || 0}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {selectedUser.role === 'STUDENT' && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Learning Stats</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span>Enrolled Courses:</span>
                                          <span>{selectedUser.enrolledCourses || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Completed:</span>
                                          <span>{selectedUser.completedCourses || 0}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingUser({...user});
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                Update user information and settings
                              </DialogDescription>
                            </DialogHeader>
                            
                            {editingUser && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-role">Role</Label>
                                  <Select 
                                    value={editingUser.role} 
                                    onValueChange={(value) => setEditingUser({...editingUser, role: value as User['role']})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="STUDENT">Student</SelectItem>
                                      <SelectItem value="COACH">Teacher</SelectItem>
                                      <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-phone">Phone</Label>
                                  <Input
                                    id="edit-phone"
                                    value={editingUser.phone || ""}
                                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-location">Location</Label>
                                  <Input
                                    id="edit-location"
                                    value={editingUser.location || ""}
                                    onChange={(e) => setEditingUser({...editingUser, location: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-bio">Bio</Label>
                                  <Textarea
                                    id="edit-bio"
                                    value={editingUser.bio || ""}
                                    onChange={(e) => setEditingUser({...editingUser, bio: e.target.value})}
                                    rows={3}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="edit-verified"
                                    checked={editingUser.isVerified}
                                    onChange={(e) => setEditingUser({...editingUser, isVerified: e.target.checked})}
                                    className="rounded"
                                  />
                                  <Label htmlFor="edit-verified">Verified Account</Label>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateUser} disabled={actionLoading}>
                                {actionLoading ? "Updating..." : "Update User"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleVerificationToggle(user._id, !user.isVerified)}
                              disabled={actionLoading}
                            >
                              {user.isVerified ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Unverify User
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify User
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Settings className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {user.role !== 'STUDENT' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleRoleChange(user._id, 'STUDENT')}
                                    disabled={actionLoading}
                                  >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Make Student
                                  </DropdownMenuItem>
                                )}
                                {user.role !== 'COACH' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleRoleChange(user._id, 'COACH')}
                                    disabled={actionLoading}
                                  >
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    Make Teacher
                                  </DropdownMenuItem>
                                )}
                                {user.role !== 'ADMIN' && user._id !== session?.user?.id && (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      if (confirm('Are you sure you want to make this user an admin? This will give them full administrative privileges.')) {
                                        handleRoleChange(user._id, 'ADMIN');
                                      }
                                    }}
                                    disabled={actionLoading}
                                    className="text-red-600"
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            
                            {user._id !== session?.user?.id && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteUser(user._id)}
                                  disabled={actionLoading}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
