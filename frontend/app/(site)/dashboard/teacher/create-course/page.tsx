"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Info
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

export default function CreateCourse() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  
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
    assessments: ""
  });

  // Syllabus table state with dynamic columns
  const [syllabusColumns, setSyllabusColumns] = useState<SyllabusColumn[]>([
    { id: "Sr No.1", name: "Sr No.", width: "w-[150px]" },
    { id: "topic", name: "Topic", width: "w-[200px]" },
    { id: "duration", name: "Duration", width: "w-[120px]" },
    { id: "description", name: "Description" }
  ]);
  
  const [syllabusTable, setSyllabusTable] = useState<SyllabusRow[]>([
    { 
      id: "1", 
      module: "Sr No. 1", 
      topic: "Introduction", 
      duration: "2 hours", 
      description: "Basic concepts and overview" 
    }
  ]);
  
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newColumnName, setNewColumnName] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📸 Image file selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2)
      });
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        console.warn('⚠️ File size exceeds 10MB limit');
        alert('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.warn('⚠️ Invalid file type:', file.type);
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      setCourseForm(prev => ({ ...prev, image: file }));
      
      console.log('🔄 Generating image preview');
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('✅ Image preview generated');
        setCourseForm(prev => ({ ...prev, imagePreview: e.target?.result as string }));
      };
      reader.onerror = (error) => {
        console.error('❌ Error generating image preview:', error);
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
      if (col.id === "Sr No.1") {
        newRow[col.id] = `Sr No. ${syllabusTable.length + 1}`;
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
        width: "w-[190px]"
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

  const renameColumn = (columnId: string, newName: string) => {
    setSyllabusColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, name: newName } : col
      )
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

  const handleCreateCourse = async (e: React.FormEvent, status: 'draft' | 'published' = 'published') => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🚀 Starting course creation process');
      
      // Convert syllabus table to structured text
      const syllabusText = convertSyllabusToText();
      
      let imageUrl = null;
      
      // Upload image to Cloudinary if provided
      if (courseForm.image) {
        console.log('📸 Image provided, starting upload process');
        console.log('📊 Image details:', {
          name: courseForm.image.name,
          size: courseForm.image.size,
          type: courseForm.image.type
        });
        
        try {
          // Get signed upload parameters
          console.log('� Using server-side upload');
          
          // Create FormData for server-side upload
          const formData = new FormData();
          formData.append('file', courseForm.image);
          formData.append('folder', 'courses');
          
          console.log('📤 Uploading image via server API');
          
          // Upload via our server API
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          console.log('📊 Upload response status:', uploadResponse.status);
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error('❌ Server upload failed:', errorData);
            throw new Error(errorData.error || 'Failed to upload image');
          }
          
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl;
          
          console.log('✅ Image uploaded successfully:', {
            imageUrl: uploadResult.imageUrl,
            message: uploadResult.message
          });
          
        } catch (imageError) {
          console.error('❌ Image upload failed:', imageError);
          const errorMessage = imageError instanceof Error ? imageError.message : 'Unknown error occurred';
          alert(`Failed to upload image: ${errorMessage}`);
          setLoading(false);
          return;
        }
      } else {
        console.log('ℹ️ No image provided, skipping upload');
      }
      
      const courseData = {
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
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
        status: status,
        image: imageUrl
      };

      console.log("📋 Creating course with data:", courseData);

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create course');
      }

      console.log("✅ Course created successfully:", responseData);
      const message = status === 'published' 
        ? "Course published successfully! Students can now enroll." 
        : "Course saved as draft. You can publish it later.";
      alert(message);
      router.push(`/dashboard/teacher/${session?.user?.id}`);
    } catch (error) {
      console.error("❌ Error creating course:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create course: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Link href={`/dashboard/teacher/${session?.user?.id}`}>
          <Button variant="outline" size="sm" className="w-fit hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">Create Professional Course</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Design and launch your technology training course with comprehensive details
          </p>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-accent/30 dark:bg-accent/20 rounded-lg border border-accent">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
              {session?.user?.name?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="font-medium text-sm">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">Tech Trainer</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleCreateCourse(e, 'published')}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-accent/20 dark:bg-accent/10">
                <TabsTrigger value="basic" className="text-xs sm:text-sm">Basic Info</TabsTrigger>
                <TabsTrigger value="content" className="text-xs sm:text-sm">Syllabus</TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs sm:text-sm">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Course Basics</CardTitle>
                    <CardDescription className="text-sm">
                      Essential information about your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Course Title *</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Cyber Security: Zero to Hero"
                        required
                        className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">Course Description *</Label>
                      <Textarea
                        id="description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide a comprehensive description of your course..."
                        rows={4}
                        required
                        className="mt-2 resize-none transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                        <Select
                          value={courseForm.category}
                          onValueChange={(value) => setCourseForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="mt-2">
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
                        <Label htmlFor="level" className="text-sm font-medium">Course Level *</Label>
                        <Select
                          value={courseForm.level}
                          onValueChange={(value) => setCourseForm(prev => ({ ...prev, level: value }))}
                        >
                          <SelectTrigger className="mt-2">
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
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="5999"
                          required
                          className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="duration" className="text-sm font-medium">Duration *</Label>
                        <Input
                          id="duration"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="6 months"
                          required
                          className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="totalClasses" className="text-sm font-medium">Total Classes *</Label>
                        <Input
                          id="totalClasses"
                          type="number"
                          value={courseForm.totalClasses}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, totalClasses: e.target.value }))}
                          placeholder="50"
                          required
                          className="mt-2 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryMode" className="text-sm font-medium">Delivery Mode *</Label>
                      <Select
                        value={courseForm.deliveryMode}
                        onValueChange={(value) => setCourseForm(prev => ({ ...prev, deliveryMode: value }))}
                      >
                        <SelectTrigger className="mt-2">
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
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Course Image</CardTitle>
                    <CardDescription className="text-sm">
                      Upload an attractive course thumbnail
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-accent/30 hover:bg-accent/50 dark:bg-accent/10 dark:hover:bg-accent/20 transition-colors">
                          {courseForm.imagePreview ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={courseForm.imagePreview}
                                alt="Course preview"
                                fill
                                className="object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <p className="text-white text-sm font-medium">Click to change image</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-center text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> course image
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, GIF, or WebP (MAX. 10MB)</p>
                            </div>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Interactive Syllabus Table</CardTitle>
                    <CardDescription className="text-sm">
                      Create a structured syllabus with modules and topics. Click on any cell to edit it directly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Column Management */}
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 sm:p-6 rounded-lg border border-primary/20 space-y-3">
                      <h4 className="font-medium text-primary text-sm sm:text-base">🔧 Customize Table Columns</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Add or remove columns to customize your syllabus table</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {syllabusColumns.map((col, index) => (
                          <div key={col.id} className="flex items-center gap-1 bg-background px-2 sm:px-3 py-1 rounded-full border shadow-sm">
                            <span className="text-xs sm:text-sm font-medium">{col.name}</span>
                            {syllabusColumns.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteColumn(col.id)}
                                className="h-4 w-4 sm:h-5 sm:w-5 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              >
                                <X className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Add new column (e.g., Resources, Prerequisites)"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          className="flex-1 text-sm"
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
                          className="w-full sm:w-auto"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Add Column
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <h4 className="font-medium text-base sm:text-lg">Syllabus Structure</h4>
                      <Button 
                        type="button" 
                        onClick={addSyllabusRow}
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto hover:bg-accent"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Add Row
                      </Button>
                    </div>
                    
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-accent/30 dark:bg-accent/10">
                              {syllabusColumns.map((col) => (
                                <TableHead key={col.id} className={`${col.width || ""} text-xs sm:text-sm font-semibold`}>
                                  {col.name}
                                </TableHead>
                              ))}
                              <TableHead className="w-[60px] sm:w-[80px] text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {syllabusTable.map((row) => (
                              <TableRow key={row.id} className="hover:bg-accent/20 dark:hover:bg-accent/5 transition-colors">
                                {syllabusColumns.map((col) => (
                                  <TableCell key={`${row.id}-${col.id}`} className="p-2 sm:p-3">
                                    {editingCell?.rowId === row.id && editingCell?.field === col.id ? (
                                      <div className="flex items-center gap-1 sm:gap-2">
                                        {col.id === 'description' ? (
                                          <Textarea
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="min-h-[60px] resize-none text-xs sm:text-sm"
                                            autoFocus
                                          />
                                        ) : (
                                          <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="h-7 sm:h-8 text-xs sm:text-sm"
                                            autoFocus
                                          />
                                        )}
                                        <div className="flex flex-col gap-1">
                                          <Button size="sm" variant="ghost" onClick={saveEdit} className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-950">
                                            <Save className="h-2 w-2 sm:h-3 sm:w-3 text-green-600" />
                                          </Button>
                                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-950">
                                            <X className="h-2 w-2 sm:h-3 sm:w-3 text-red-600" />
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div 
                                        className="cursor-pointer hover:bg-accent/30 dark:hover:bg-accent/10 p-1 sm:p-2 rounded min-h-[28px] sm:min-h-[32px] flex items-center text-xs sm:text-sm transition-colors"
                                        onClick={() => startEditing(row.id, col.id)}
                                      >
                                        {row[col.id] || 'Click to edit'}
                                      </div>
                                    )}
                                  </TableCell>
                                ))}
                                
                                <TableCell className="p-2 sm:p-3">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteSyllabusRow(row.id)}
                                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                    disabled={syllabusTable.length === 1}
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-muted-foreground bg-accent/20 dark:bg-accent/10 p-3 sm:p-4 rounded-lg border border-accent">
                      <p className="font-medium mb-2">💡 <strong>How to use:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
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
                
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="prerequisites" className="text-sm font-medium">Prerequisites</Label>
                      <Textarea
                        id="prerequisites"
                        value={courseForm.prerequisites}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, prerequisites: e.target.value }))}
                        placeholder="What students should know before taking this course..."
                        rows={3}
                        className="mt-2 resize-none text-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="outcomes" className="text-sm font-medium">Learning Outcomes</Label>
                      <Textarea
                        id="outcomes"
                        value={courseForm.outcomes}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, outcomes: e.target.value }))}
                        placeholder="What students will achieve after completing this course..."
                        rows={4}
                        className="mt-2 resize-none text-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="materials" className="text-sm font-medium">Course Materials</Label>
                      <Textarea
                        id="materials"
                        value={courseForm.materials}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, materials: e.target.value }))}
                        placeholder="Books, PDFs, videos, and other resources included..."
                        rows={3}
                        className="mt-2 resize-none text-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assessments" className="text-sm font-medium">Assessments & Evaluation</Label>
                      <Textarea
                        id="assessments"
                        value={courseForm.assessments}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, assessments: e.target.value }))}
                        placeholder="How students will be assessed (tests, assignments, projects)..."
                        rows={4}
                        className="mt-2 resize-none text-sm transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Course Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-3 mt-2">
                        {courseForm.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
                            onClick={() => handleTagRemove(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          id="tag-input"
                          placeholder="Add tags (e.g., History, Geography)"
                          className="flex-1 text-sm"
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
                          className="w-full sm:w-auto"
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
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="sticky top-4 sm:top-6 lg:top-8 space-y-4 lg:space-y-6">
              {/* Course Preview */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Course Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-accent/30 dark:bg-accent/10 rounded-lg overflow-hidden border border-accent">
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
                        <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 text-sm sm:text-base">
                      {courseForm.title || "Course Title"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                      {courseForm.description || "Course description will appear here..."}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-primary">
                        ₹{courseForm.price || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{courseForm.duration || "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Classes</span>
                      <span className="font-medium">{courseForm.totalClasses || "0"}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Modules</span>
                      <span className="font-medium">{syllabusTable.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6 space-y-3">
                  {/* Primary Publish Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover:scale-[1.02] text-sm sm:text-base" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publishing...
                      </div>
                    ) : "🚀 Publish Course"}
                  </Button>
                  
                  {/* Save as Draft Button */}
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full hover:bg-accent transition-all hover:scale-[1.02] text-sm sm:text-base" 
                    disabled={loading}
                    onClick={(e) => handleCreateCourse(e, 'draft')}
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </div>
                    ) : "📝 Save as Draft"}
                  </Button>
                  
                  <div className="flex items-start gap-2 p-3 sm:p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <p className="font-medium text-primary mb-1">💡 Pro Tip:</p>
                      <p className="text-muted-foreground leading-relaxed"><strong>Publish:</strong> Makes your course live for students to enroll</p>
                      <p className="text-muted-foreground leading-relaxed"><strong>Save as Draft:</strong> Saves your work, you can finish and publish later</p>
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
