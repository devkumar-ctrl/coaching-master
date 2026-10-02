"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Upload, 
  BookOpen, 
  Plus,
  Trash2,
  Save,
  X,
  Info,
  AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

interface SyllabusColumn {
  id: string;
  name: string;
  width?: string;
}

interface SyllabusRow {
  id: string;
  [key: string]: string; // Dynamic columns
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  duration: string;
  level: string;
  deliveryMode: string;
  totalClasses: number;
  syllabus?: string;
  prerequisites?: string;
  outcomes?: string;
  materials?: string;
  assessments?: string;
  tags?: string[];
  status: "draft" | "published";
  teacherId: string;
  createdAt: string;
}

export default function EditCourse() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("basic");
  const [course, setCourse] = useState<Course | null>(null);
  
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    level: "intermediate",
    image: null as File | null,
    imagePreview: null as string | null,
    deliveryMode: "live-online",
    totalClasses: "",
    prerequisites: "",
    outcomes: "",
    tags: [] as string[],
    materials: "",
    assessments: "",
    status: "draft" as "draft" | "published"
  });

  // Syllabus table state with dynamic columns
  const [syllabusColumns, setSyllabusColumns] = useState<SyllabusColumn[]>([
    { id: "module", name: "Module", width: "w-[150px]" },
    { id: "topic", name: "Topic", width: "w-[200px]" },
    { id: "duration", name: "Duration", width: "w-[120px]" },
    { id: "description", name: "Description" }
  ]);
  
  const [syllabusTable, setSyllabusTable] = useState<SyllabusRow[]>([
    { 
      id: "1", 
      module: "Module 1", 
      topic: "Introduction", 
      duration: "2 hours", 
      description: "Basic concepts and overview" 
    }
  ]);
  
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newColumnName, setNewColumnName] = useState("");

  // Fetch course data
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const courseData: Course = await response.json();
      setCourse(courseData);
      
      // Populate form with existing data
      setCourseForm({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        price: courseData.price.toString(),
        duration: courseData.duration,
        level: courseData.level,
        image: null,
        imagePreview: courseData.image || null,
        deliveryMode: courseData.deliveryMode,
        totalClasses: courseData.totalClasses.toString(),
        prerequisites: courseData.prerequisites || "",
        outcomes: courseData.outcomes || "",
        tags: courseData.tags || [],
        materials: courseData.materials || "",
        assessments: courseData.assessments || "",
        status: courseData.status
      });

      // Parse and populate syllabus if exists
      if (courseData.syllabus) {
        parseSyllabusData(courseData.syllabus);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      alert("Failed to load course data");
    } finally {
      setFetchLoading(false);
    }
  };

  const parseSyllabusData = (syllabusText: string) => {
    const lines = syllabusText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return;
    
    // Check if this is the new dynamic format
    const headerLine = lines[0];
    const separatorLine = lines[1];
    
    if (separatorLine.includes('=')) {
      // New dynamic format
      const headers = headerLine.split(' | ').map(h => h.trim());
      const dataLines = lines.slice(2);
      
      // Set columns
      const columns = headers.map((header, index) => ({
        id: header.toLowerCase().replace(/\s+/g, '_'),
        name: header,
        width: index === 0 ? "w-[150px]" : index === headers.length - 1 ? "" : "w-[150px]"
      }));
      setSyllabusColumns(columns);
      
      // Set rows
      const rows = dataLines.map((line, index) => {
        const values = line.split(' | ').map(v => v.trim());
        const row: SyllabusRow = { id: (index + 1).toString() };
        
        headers.forEach((header, headerIndex) => {
          const fieldId = header.toLowerCase().replace(/\s+/g, '_');
          row[fieldId] = values[headerIndex] || '';
        });
        
        return row;
      });
      setSyllabusTable(rows);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseForm(prev => ({ ...prev, imagePreview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !courseForm.tags.includes(tag)) {
      setCourseForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setCourseForm(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  // Syllabus table functions
  const addSyllabusRow = () => {
    const newRow: SyllabusRow = {
      id: Date.now().toString(),
    };
    
    // Initialize all column values for the new row
    syllabusColumns.forEach(col => {
      if (col.id === "module") {
        newRow[col.id] = `Module ${syllabusTable.length + 1}`;
      } else if (col.id === "topic") {
        newRow[col.id] = "New Topic";
      } else if (col.id === "duration") {
        newRow[col.id] = "1 hour";
      } else if (col.id === "description") {
        newRow[col.id] = "Add description";
      } else {
        newRow[col.id] = "Enter value";
      }
    });
    
    setSyllabusTable(prev => [...prev, newRow]);
  };

  const deleteSyllabusRow = (id: string) => {
    setSyllabusTable(prev => prev.filter(row => row.id !== id));
  };

  const startEditing = (rowId: string, field: string) => {
    const row = syllabusTable.find(r => r.id === rowId);
    if (row) {
      setEditingCell({ rowId, field });
      setEditValue(row[field] || "");
    }
  };

  const saveEdit = () => {
    if (editingCell) {
      setSyllabusTable(prev => 
        prev.map(row => 
          row.id === editingCell.rowId 
            ? { ...row, [editingCell.field]: editValue }
            : row
        )
      );
      setEditingCell(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Column management functions
  const addColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: SyllabusColumn = {
        id: newColumnName.toLowerCase().replace(/\s+/g, '_'),
        name: newColumnName.trim(),
        width: "w-[150px]"
      };
      
      setSyllabusColumns(prev => [...prev, newColumn]);
      
      // Add the new column to all existing rows with default value
      setSyllabusTable(prev => 
        prev.map(row => ({
          ...row,
          [newColumn.id]: "Enter value"
        }))
      );
      
      setNewColumnName("");
    }
  };

  const deleteColumn = (columnId: string) => {
    // Don't allow deleting if only one column remains
    if (syllabusColumns.length <= 1) return;
    
    setSyllabusColumns(prev => prev.filter(col => col.id !== columnId));
    
    // Remove the column from all rows
    setSyllabusTable(prev => 
      prev.map(row => {
        const newRow = { ...row };
        delete newRow[columnId];
        return newRow;
      })
    );
  };

  const convertSyllabusToText = () => {
    const columnHeaders = syllabusColumns.map(col => col.name).join(' | ');
    let result = `${columnHeaders}\n${'='.repeat(50)}\n`;
    
    result += syllabusTable.map(row => {
      const rowData = syllabusColumns.map(col => row[col.id] || '').join(' | ');
      return rowData;
    }).join('\n');
    
    return result;
  };

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    console.log('📊 Image details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2)
    });

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Image size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'courses');

    console.log('📤 Uploading image via server API');
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('📊 Upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.log('❌ Server upload failed:', errorData);
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('✅ Upload successful:', data);
    return data.imageUrl;
  };

  const handleUpdateCourse = async (e: React.FormEvent, status: 'draft' | 'published' = courseForm.status) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Handle image upload if there's a new image
      let imageUrl = course?.image; // Keep existing image by default
      
      if (courseForm.image) {
        console.log('🖼️ New image detected, uploading...');
        imageUrl = await handleImageUpload(courseForm.image);
        console.log('✅ Image uploaded successfully:', imageUrl);
      }
      
      // Convert syllabus table to structured text
      const syllabusText = convertSyllabusToText();
      
      const courseData = {
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        image: imageUrl, // Include the image URL
        price: parseFloat(courseForm.price) || 0,
        duration: courseForm.duration,
        level: courseForm.level,
        deliveryMode: courseForm.deliveryMode,
        totalClasses: parseInt(courseForm.totalClasses) || 1,
        syllabus: syllabusText,
        prerequisites: courseForm.prerequisites,
        outcomes: courseForm.outcomes,
        materials: courseForm.materials,
        assessments: courseForm.assessments,
        tags: courseForm.tags,
        status: status
      };

      console.log("Updating course with data:", courseData);

      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update course');
      }

      console.log("Course updated successfully:", responseData);
      const message = status === 'published' 
        ? "Course updated and published successfully!" 
        : "Course updated and saved as draft.";
      alert(message);
      router.push(`/dashboard/teacher/${session?.user?.id}`);
    } catch (error) {
      console.error("Error updating course:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to update course: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Course not found</h3>
          <p className="text-muted-foreground mb-4">
            The course you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Link href={`/dashboard/teacher/${session?.user?.id}`}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard/teacher/${session?.user?.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground">
            Update your course details and publish changes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={course.status === "published" ? "default" : "secondary"}>
            {course.status}
          </Badge>
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <form onSubmit={(e) => handleUpdateCourse(e, courseForm.status)}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Syllabus</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Basics</CardTitle>
                    <CardDescription>
                      Essential information about your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Course Title *</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Cyber Security: Zero to Hero"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Course Description *</Label>
                      <Textarea
                        id="description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide a comprehensive description of your course..."
                        rows={4}
                        required
                      />
                    </div>

                    {/* Course Image Upload */}
                    <div>
                      <Label htmlFor="courseImage">Course Image</Label>
                      <div className="mt-2">
                        {(courseForm.imagePreview || course?.image) && (
                          <div className="mb-4">
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={courseForm.imagePreview || course?.image || ''}
                                alt="Course preview"
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setCourseForm(prev => ({ 
                                    ...prev, 
                                    image: null, 
                                    imagePreview: null 
                                  }));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <input
                          id="courseImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file size (10MB limit)
                              if (file.size > 10 * 1024 * 1024) {
                                alert('File size must be less than 10MB');
                                return;
                              }

                              setCourseForm(prev => ({ ...prev, image: file }));
                              
                              // Create preview URL
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setCourseForm(prev => ({ 
                                  ...prev, 
                                  imagePreview: e.target?.result as string 
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Upload a course image (JPG, PNG, or GIF up to 10MB). Recommended size: 800x600px
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={courseForm.category}
                          onValueChange={(value) => setCourseForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cyber-security">Cyber Security</SelectItem>
                            <SelectItem value="ethical-hacking">Ethical Hacking</SelectItem>
                            <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                            <SelectItem value="data-science">Data Science</SelectItem>
                            <SelectItem value="iot-embedded">IoT & Embedded</SelectItem>
                            <SelectItem value="robotics">Robotics</SelectItem>
                            <SelectItem value="web-development">Web Development</SelectItem>
                            <SelectItem value="ev-technology">EV Technology</SelectItem>
                            <SelectItem value="cloud-devops">Cloud & DevOps</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="level">Course Level *</Label>
                        <Select
                          value={courseForm.level}
                          onValueChange={(value) => setCourseForm(prev => ({ ...prev, level: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="5999"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="duration">Duration *</Label>
                        <Input
                          id="duration"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="6 months"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="totalClasses">Total Classes *</Label>
                        <Input
                          id="totalClasses"
                          type="number"
                          value={courseForm.totalClasses}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, totalClasses: e.target.value }))}
                          placeholder="50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryMode">Delivery Mode *</Label>
                      <Select
                        value={courseForm.deliveryMode}
                        onValueChange={(value) => setCourseForm(prev => ({ ...prev, deliveryMode: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="live-online">Live Online</SelectItem>
                          <SelectItem value="recorded">Recorded</SelectItem>
                          <SelectItem value="hybrid">Hybrid (Live + Recorded)</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Course Status</Label>
                      <Select
                        value={courseForm.status}
                        onValueChange={(value: "draft" | "published") => setCourseForm(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft (Private)</SelectItem>
                          <SelectItem value="published">Published (Live)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Image</CardTitle>
                    <CardDescription>
                      Upload a new course thumbnail or keep the existing one
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70">
                          {courseForm.imagePreview ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={courseForm.imagePreview}
                                alt="Course preview"
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> new course image
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 5MB)</p>
                            </div>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🔧 Interactive Syllabus Table</CardTitle>
                    <CardDescription>
                      Modify your course syllabus structure. Add custom columns and edit content directly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Column Management */}
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-blue-900">🔧 Customize Table Columns</h4>
                      <p className="text-sm text-blue-700">Add or remove columns to customize your syllabus table</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {syllabusColumns.map((col, index) => (
                          <div key={col.id} className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border">
                            <span className="text-sm font-medium">{col.name}</span>
                            {syllabusColumns.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteColumn(col.id)}
                                className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new column (e.g., Resources, Prerequisites)"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addColumn();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addColumn}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Column
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Syllabus Structure</h4>
                      <Button 
                        type="button" 
                        onClick={addSyllabusRow}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {syllabusColumns.map((col) => (
                              <TableHead key={col.id} className={col.width || ""}>
                                {col.name}
                              </TableHead>
                            ))}
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {syllabusTable.map((row) => (
                            <TableRow key={row.id}>
                              {syllabusColumns.map((col) => (
                                <TableCell key={`${row.id}-${col.id}`}>
                                  {editingCell?.rowId === row.id && editingCell?.field === col.id ? (
                                    <div className="flex items-center gap-2">
                                      {col.id === 'description' ? (
                                        <Textarea
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="min-h-[60px] resize-none"
                                          autoFocus
                                        />
                                      ) : (
                                        <Input
                                          value={editValue}
                                          onChange={(e) => setEditValue(e.target.value)}
                                          className="h-8"
                                          autoFocus
                                        />
                                      )}
                                      <div className="flex flex-col gap-1">
                                        <Button size="sm" variant="ghost" onClick={saveEdit}>
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div 
                                      className="cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center"
                                      onClick={() => startEditing(row.id, col.id)}
                                    >
                                      {row[col.id] || 'Click to edit'}
                                    </div>
                                  )}
                                </TableCell>
                              ))}
                              
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSyllabusRow(row.id)}
                                  className="text-red-600 hover:text-red-700"
                                  disabled={syllabusTable.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                      <p>💡 <strong>How to use:</strong></p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><strong>Add custom columns:</strong> Type a column name and click "Add Column" to customize your syllabus table</li>
                        <li><strong>Remove columns:</strong> Click the × button next to any column name to remove it</li>
                        <li><strong>Edit cells:</strong> Click on any cell to edit it directly with save/cancel options</li>
                        <li><strong>Add rows:</strong> Use the "Add Row" button to add new modules or topics</li>
                        <li><strong>Professional display:</strong> Your custom table will be displayed beautifully on the course page</li>
                        <li><strong>Flexible structure:</strong> Create any columns you need (Resources, Prerequisites, Assignments, etc.)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prerequisites">Prerequisites</Label>
                      <Textarea
                        id="prerequisites"
                        value={courseForm.prerequisites}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, prerequisites: e.target.value }))}
                        placeholder="What students should know before taking this course..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="outcomes">Learning Outcomes</Label>
                      <Textarea
                        id="outcomes"
                        value={courseForm.outcomes}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, outcomes: e.target.value }))}
                        placeholder="What students will achieve after completing this course..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="materials">Course Materials</Label>
                      <Textarea
                        id="materials"
                        value={courseForm.materials}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, materials: e.target.value }))}
                        placeholder="Books, PDFs, videos, and other resources included..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assessments">Assessments & Evaluation</Label>
                      <Textarea
                        id="assessments"
                        value={courseForm.assessments}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, assessments: e.target.value }))}
                        placeholder="How students will be assessed (tests, assignments, projects)..."
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label>Course Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {courseForm.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => handleTagRemove(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="tag-input"
                          placeholder="Add tags (e.g., History, Geography)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleTagAdd(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.getElementById('tag-input') as HTMLInputElement;
                            if (input.value) {
                              handleTagAdd(input.value);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {courseForm.imagePreview ? (
                      <Image
                        src={courseForm.imagePreview}
                        alt="Course preview"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold line-clamp-2">
                      {courseForm.title || "Course Title"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                      {courseForm.description || "Course description will appear here..."}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-green-600">
                        ₹{courseForm.price || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{courseForm.duration || "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Classes</span>
                      <span>{courseForm.totalClasses || "0"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={courseForm.status === "published" ? "default" : "secondary"}>
                        {courseForm.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Modules</span>
                      <span>{syllabusTable.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  {/* Update Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "💾 Update Course"}
                  </Button>
                  
                  {/* Status Toggle Buttons */}
                  {courseForm.status === 'draft' && (
                    <Button 
                      type="button"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
                      disabled={loading}
                      onClick={(e) => handleUpdateCourse(e, 'published')}
                    >
                      {loading ? "Publishing..." : "🚀 Update & Publish"}
                    </Button>
                  )}
                  
                  {courseForm.status === 'published' && (
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full" 
                      disabled={loading}
                      onClick={(e) => handleUpdateCourse(e, 'draft')}
                    >
                      {loading ? "Unpublishing..." : "📝 Update & Unpublish"}
                    </Button>
                  )}
                  
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium">💡 Pro Tip:</p>
                      <p><strong>Update:</strong> Saves changes with current status</p>
                      <p><strong>Update & Publish:</strong> Saves and makes course live</p>
                      <p><strong>Update & Unpublish:</strong> Saves and makes course private</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
