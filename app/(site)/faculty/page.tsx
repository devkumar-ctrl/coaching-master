"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  MapPin, 
  Clock,
  GraduationCap,
  Search,
  Filter,
  Mail,
  Phone,
  Globe,
  LinkedinIcon,
  Loader
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

interface Faculty {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio: string;
  specialization: string[];
  qualifications: string[];
  experience: string;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  location: string;
  languages: string[];
  achievements: string[];
  isVerified: boolean;
  socialLinks: {
    linkedin?: string;
    website?: string;
  };
  subjects: string[];
  totalReviews: number;
  joinedDate: string;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    filterFaculty();
  }, [faculty, searchTerm, selectedSpecialization]);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/faculty');
      if (response.ok) {
        const data = await response.json();
        setFaculty(data);
      } else {
        console.error('Failed to fetch faculty');
        setFaculty([]);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFaculty = () => {
    let filtered = faculty;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.specialization.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        member.subjects.some(subject => 
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(member =>
        member.specialization.includes(selectedSpecialization) ||
        member.subjects.includes(selectedSpecialization)
      );
    }

    setFilteredFaculty(filtered);
  };

  // Get unique specializations for filter
  const getSpecializations = () => {
    const specs = new Set<string>();
    faculty.forEach(member => {
      member.specialization.forEach(spec => {
        if (spec && spec.trim() !== '') {
          specs.add(spec);
        }
      });
      member.subjects.forEach(subject => {
        if (subject && subject.trim() !== '') {
          specs.add(subject);
        }
      });
    });
    return Array.from(specs);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading faculty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Expert Faculty</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Learn from the best minds in technology education. Our faculty comprises industry professionals, 
          subject matter experts, and experienced educators dedicated to your success.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{faculty.length}+</div>
            <div className="text-sm text-muted-foreground">Expert Faculty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {faculty.reduce((sum, f) => sum + f.totalStudents, 0)}+
            </div>
            <div className="text-sm text-muted-foreground">Students Taught</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {faculty.reduce((sum, f) => sum + f.totalCourses, 0)}+
            </div>
            <div className="text-sm text-muted-foreground">Courses Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {faculty.length > 0 ? (faculty.reduce((sum, f) => sum + f.rating, 0) / faculty.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search faculty by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {getSpecializations().map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Faculty Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-semibold mb-2">No Faculty Found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedSpecialization !== "all" 
              ? "Try adjusting your search or filters" 
              : "No faculty members available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member) => (
            <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {member.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                        {member.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{member.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({member.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm line-clamp-3">
                  {member.bio}
                </CardDescription>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1">
                  {member.specialization.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {member.specialization.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.specialization.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-sm">{member.totalStudents}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-sm">{member.totalCourses}</div>
                      <div className="text-xs text-muted-foreground">Courses</div>
                    </div>
                  </div>
                </div>

                {/* Experience and Location */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{member.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{member.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                 
                  {member.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={member.socialLinks.linkedin} target="_blank">
                        <LinkedinIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {member.socialLinks.website && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={member.socialLinks.website} target="_blank">
                        <Globe className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Join Our Faculty Team</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Are you an expert educator passionate about helping students achieve their tech dreams? 
          We're always looking for talented instructors to join our team.
        </p>
        <Button size="lg" asChild>
          <Link href="/apply-faculty">
            Apply to Teach
          </Link>
        </Button>
      </div>
    </div>
  );
}
