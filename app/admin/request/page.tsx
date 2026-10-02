"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, User, Mail, MessageSquare, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/page-header";

interface TeacherRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  qualification: string;
  experience: string;
  specialization: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  documents?: string[];
}

export default function AdminRequestsPage() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<TeacherRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TeacherRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<TeacherRequest | null>(null);

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
      fetchRequests();
    }
  }, [session]);

  useEffect(() => {
    filterRequests();
  }, [requests, selectedStatus, searchTerm]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/teacher-applications");
      if (!response.ok) throw new Error("Failed to load applications");
      const data = await response.json();

      const mapped: TeacherRequest[] = (Array.isArray(data) ? data : []).map(
        (r: any, index: number) => ({
          id: r._id?.toString?.() || r.userId || String(index),
          name: r.name || "Unknown",
          email: r.email || "",
          phone: r.phone || "",
          qualification: Array.isArray(r.qualifications)
            ? r.qualifications.join(", ")
            : r.qualification || "",
          experience: r.experience || "",
          specialization: Array.isArray(r.specialization)
            ? r.specialization.join(", ")
            : r.specialization || "",
          message: r.bio || r.message || "",
          status: (["pending", "approved", "rejected"].includes(
              String(r.status).toLowerCase()
            )
              ? String(r.status).toLowerCase()
              : "pending") as TeacherRequest["status"],
          createdAt: r.appliedAt || r.createdAt || new Date().toISOString(),
        })
      );

      setRequests(mapped);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load teacher applications");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleRequestAction = async (requestId: string, action: "approve" | "reject") => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "approve"
            ? { role: "COACH", isVerified: true }
            : { isVerified: false }
        ),
      });
      if (!response.ok) throw new Error("Request failed");

      toast.success(
        action === "approve"
          ? "Teacher application approved"
          : "Teacher application rejected"
      );
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} application. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading teacher requests...</p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  return (
    <div>
      <AdminPageHeader
        title="Teacher Applications"
        description="Manage applications from aspiring technology faculty members."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder="Search by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-muted-foreground">
              {requests.length === 0 
                ? "No teacher applications have been submitted yet."
                : "No requests match your current filters."
              }
            </p>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{request.name}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          {request.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Applied: {formatDate(request.createdAt)}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm"><strong>Qualification:</strong> {request.qualification}</p>
                        <p className="text-sm"><strong>Experience:</strong> {request.experience}</p>
                        <p className="text-sm"><strong>Specialization:</strong> {request.specialization}</p>
                      </div>
                      
                      {request.message && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            <MessageSquare className="h-4 w-4 inline mr-1" />
                            {request.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Teacher Application Details</DialogTitle>
                              <DialogDescription>
                                Review the complete application from {request.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p className="text-sm font-medium">{selectedRequest.name}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="text-sm font-medium">{selectedRequest.email}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p className="text-sm font-medium">{selectedRequest.phone || "Not provided"}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <Label>Qualification</Label>
                                  <p className="text-sm">{selectedRequest.qualification}</p>
                                </div>
                                
                                <div>
                                  <Label>Experience</Label>
                                  <p className="text-sm">{selectedRequest.experience}</p>
                                </div>
                                
                                <div>
                                  <Label>Specialization</Label>
                                  <p className="text-sm">{selectedRequest.specialization}</p>
                                </div>
                                
                                {selectedRequest.message && (
                                  <div>
                                    <Label>Message</Label>
                                    <p className="text-sm whitespace-pre-line">{selectedRequest.message}</p>
                                  </div>
                                )}
                                
                                {selectedRequest.status === "pending" && (
                                  <div className="flex justify-end space-x-2 pt-4">
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => handleRequestAction(selectedRequest.id, "reject")}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button 
                                      onClick={() => handleRequestAction(selectedRequest.id, "approve")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {request.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRequestAction(request.id, "reject")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleRequestAction(request.id, "approve")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
