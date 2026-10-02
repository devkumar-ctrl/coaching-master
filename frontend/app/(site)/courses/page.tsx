"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users, Clock, MapPin, GraduationCap, Filter, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  duration: string;
  level: string;
  enrolledCount?: number;
  enrollmentCount?: number;
  status: "draft" | "published";
  teacherId: string;
  teacherName?: string;
  deliveryMode: string;
  totalClasses: number;
  syllabus?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const fetchedCourses = await response.json();
      const coursesWithId = fetchedCourses.map((course: any) => ({
        ...course,
        id: course.id || course._id
      }));
      
      setCourses(coursesWithId);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-blue-100 text-blue-800";
      case "advanced": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "cyber-security": return "bg-red-100 text-red-800";
      case "ethical-hacking": return "bg-rose-100 text-rose-800";
      case "ai-ml": return "bg-purple-100 text-purple-800";
      case "data-science": return "bg-blue-100 text-blue-800";
      case "iot-embedded": return "bg-cyan-100 text-cyan-800";
      case "robotics": return "bg-amber-100 text-amber-800";
      case "web-development": return "bg-green-100 text-green-800";
      case "ev-technology": return "bg-lime-100 text-lime-800";
      case "cloud-devops": return "bg-indigo-100 text-indigo-800";
      case "python": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Training Programs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hands-on programs in IoT, Embedded Systems, Robotics, AI, Cyber Security, EV and beyond — with live industry projects and placement support
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">
              {courses.reduce((acc, course) => acc + (course.enrollmentCount ?? course.enrolledCount ?? 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Aspirants</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">
              {new Set(courses.map(course => course.teacherId)).size}
            </div>
            <p className="text-sm text-muted-foreground">Expert Faculty</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {courses.length === 0 ? "No courses available" : "No courses match your filters"}
          </h3>
          <p className="text-muted-foreground">
            {courses.length === 0 
              ? "Check back later for new courses from our expert faculty."
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-gradient-to-r from-blue-500 to-purple-600">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                )}
                
                <div className="absolute top-2 left-2">
                  <Badge className={getCategoryBadgeColor(course.category)}>
                    {course.category.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="absolute top-2 right-2">
                  <Badge className={getLevelBadgeColor(course.level)}>
                    {course.level.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">By {course.teacherName}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{course.totalClasses} classes</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="capitalize">{course.deliveryMode.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{course.enrollmentCount ?? course.enrolledCount ?? 0} enrolled</span>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{course.price.toLocaleString()}
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button>
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
