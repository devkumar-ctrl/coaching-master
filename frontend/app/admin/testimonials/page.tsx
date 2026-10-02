"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Star,
  User,
  Calendar,
  Filter,
  Search
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/page-header";

interface Testimonial {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  isVisible: boolean;
  position?: string;
  company?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export default function AdminTestimonialsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    email: "",
    content: "",
    rating: 5,
    position: "",
    company: "",
    location: "",
    status: "approved" as const,
    isVisible: true
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
      fetchTestimonials();
    }
  }, [session]);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, statusFilter, visibilityFilter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials?admin=true');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        toast.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(testimonial => testimonial.status === statusFilter);
    }

    if (visibilityFilter !== "all") {
      const isVisible = visibilityFilter === "visible";
      filtered = filtered.filter(testimonial => testimonial.isVisible === isVisible);
    }

    setFilteredTestimonials(filtered);
  };

  const handleCreateTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      toast.error('Name and content are required');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTestimonial),
      });

      if (response.ok) {
        toast.success('Testimonial created successfully');
        setShowCreateDialog(false);
        setNewTestimonial({
          name: "",
          email: "",
          content: "",
          rating: 5,
          position: "",
          company: "",
          location: "",
          status: "approved",
          isVisible: true
        });
        fetchTestimonials();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create testimonial');
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast.error('Failed to create testimonial');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/testimonials/${editingTestimonial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingTestimonial.name,
          email: editingTestimonial.email,
          content: editingTestimonial.content,
          rating: editingTestimonial.rating,
          position: editingTestimonial.position,
          company: editingTestimonial.company,
          location: editingTestimonial.location,
          status: editingTestimonial.status,
          isVisible: editingTestimonial.isVisible
        }),
      });

      if (response.ok) {
        toast.success('Testimonial updated successfully');
        setShowEditDialog(false);
        setEditingTestimonial(null);
        fetchTestimonials();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Testimonial ${newStatus} successfully`);
        fetchTestimonials();
      } else {
        toast.error(`Failed to ${newStatus} testimonial`);
      }
    } catch (error) {
      console.error(`Error ${newStatus} testimonial:`, error);
      toast.error(`Failed to ${newStatus} testimonial`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVisibilityToggle = async (id: string, isVisible: boolean) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible }),
      });

      if (response.ok) {
        toast.success(`Testimonial ${isVisible ? 'shown' : 'hidden'} successfully`);
        fetchTestimonials();
      } else {
        toast.error('Failed to update visibility');
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Testimonial deleted successfully');
        fetchTestimonials();
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: Testimonial['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><MessageSquare className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getVisibilityBadge = (isVisible: boolean) => {
    return isVisible ? (
      <Badge variant="outline" className="text-green-600 border-green-600">
        <Eye className="h-3 w-3 mr-1" />Visible
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-600 border-gray-600">
        <EyeOff className="h-3 w-3 mr-1" />Hidden
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
        title="Testimonials"
        description="Manage customer testimonials and reviews."
        actions={
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Testimonial</DialogTitle>
              <DialogDescription>
                Add a new customer testimonial
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTestimonial.email}
                  onChange={(e) => setNewTestimonial({...newTestimonial, email: e.target.value})}
                  placeholder="Customer email"
                />
              </div>
              <div>
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                  placeholder="Write the testimonial content..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Select value={newTestimonial.rating.toString()} onValueChange={(value) => setNewTestimonial({...newTestimonial, rating: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newTestimonial.position}
                    onChange={(e) => setNewTestimonial({...newTestimonial, position: e.target.value})}
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newTestimonial.company}
                    onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newTestimonial.location}
                  onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})}
                  placeholder="City, Country"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="visible"
                  checked={newTestimonial.isVisible}
                  onChange={(e) => setNewTestimonial({...newTestimonial, isVisible: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="visible">Visible on website</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTestimonial} disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create Testimonial"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{testimonials.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {testimonials.filter(t => t.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {testimonials.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visible</p>
                <p className="text-2xl font-bold text-blue-600">
                  {testimonials.filter(t => t.isVisible).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
          <CardDescription>Manage all customer testimonials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No testimonials found</p>
              </div>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <Card key={testimonial._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image || ""} alt={testimonial.name || "User"} />
                          <AvatarFallback>
                            {testimonial.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{testimonial.name || "Unknown User"}</h3>
                            {getStatusBadge(testimonial.status)}
                            {getVisibilityBadge(testimonial.isVisible)}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            {renderStars(testimonial.rating)}
                            <span className="text-sm text-muted-foreground ml-2">
                              {testimonial.rating}/5
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-3 line-clamp-3">
                            "{testimonial.content}"
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            {testimonial.email && (
                              <div>{testimonial.email}</div>
                            )}
                            {testimonial.position && testimonial.company && (
                              <div>{testimonial.position} at {testimonial.company}</div>
                            )}
                            {testimonial.location && (
                              <div>{testimonial.location}</div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(testimonial.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Dialog open={showEditDialog && editingTestimonial?._id === testimonial._id} onOpenChange={(open) => {
                          setShowEditDialog(open);
                          if (!open) setEditingTestimonial(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingTestimonial({...testimonial});
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Testimonial</DialogTitle>
                              <DialogDescription>
                                Update testimonial information
                              </DialogDescription>
                            </DialogHeader>
                            
                            {editingTestimonial && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingTestimonial.name}
                                    onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingTestimonial.email || ""}
                                    onChange={(e) => setEditingTestimonial({...editingTestimonial, email: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-content">Content</Label>
                                  <Textarea
                                    id="edit-content"
                                    value={editingTestimonial.content}
                                    onChange={(e) => setEditingTestimonial({...editingTestimonial, content: e.target.value})}
                                    rows={4}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-rating">Rating</Label>
                                  <Select 
                                    value={editingTestimonial.rating.toString()} 
                                    onValueChange={(value) => setEditingTestimonial({...editingTestimonial, rating: parseInt(value)})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">5 Stars</SelectItem>
                                      <SelectItem value="4">4 Stars</SelectItem>
                                      <SelectItem value="3">3 Stars</SelectItem>
                                      <SelectItem value="2">2 Stars</SelectItem>
                                      <SelectItem value="1">1 Star</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-position">Position</Label>
                                    <Input
                                      id="edit-position"
                                      value={editingTestimonial.position || ""}
                                      onChange={(e) => setEditingTestimonial({...editingTestimonial, position: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-company">Company</Label>
                                    <Input
                                      id="edit-company"
                                      value={editingTestimonial.company || ""}
                                      onChange={(e) => setEditingTestimonial({...editingTestimonial, company: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="edit-location">Location</Label>
                                  <Input
                                    id="edit-location"
                                    value={editingTestimonial.location || ""}
                                    onChange={(e) => setEditingTestimonial({...editingTestimonial, location: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select 
                                    value={editingTestimonial.status} 
                                    onValueChange={(value) => setEditingTestimonial({...editingTestimonial, status: value as 'pending' | 'approved' | 'rejected'})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="edit-visible"
                                    checked={editingTestimonial.isVisible}
                                    onChange={(e) => setEditingTestimonial({...editingTestimonial, isVisible: e.target.checked})}
                                    className="rounded"
                                  />
                                  <Label htmlFor="edit-visible">Visible on website</Label>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateTestimonial} disabled={actionLoading}>
                                {actionLoading ? "Updating..." : "Update Testimonial"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Testimonial Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {testimonial.status === 'pending' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(testimonial._id, 'approved')}
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(testimonial._id, 'rejected')}
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            
                            <DropdownMenuItem 
                              onClick={() => handleVisibilityToggle(testimonial._id, !testimonial.isVisible)}
                              disabled={actionLoading}
                            >
                              {testimonial.isVisible ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Show
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteTestimonial(testimonial._id)}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
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
