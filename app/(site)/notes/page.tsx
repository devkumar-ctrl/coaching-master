"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  BookOpen,
  Star,
  Clock,
  Eye,
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  subject: string;
  category: string;
  description: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  downloadCount: number;
  rating: number;
  uploadDate: string;
  tags: string[];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, selectedCategory]);

  const fetchNotes = async () => {
    try {
      // Mock data for now
      const mockNotes: Note[] = [
        {
          id: "1",
          title: "Modern Indian History - Complete Notes",
          subject: "History",
          category: "prelims",
          description: "Comprehensive notes covering the complete Cyber Security fundamentals syllabus",
          downloadUrl: "/notes/modern-history.pdf",
          thumbnailUrl: "/thumbnails/history-notes.jpg",
          fileSize: "2.4 MB",
          downloadCount: 1250,
          rating: 4.8,
          uploadDate: "2025-01-15",
          tags: ["Cyber Security", "Foundations", "Networking", "Threats"]
        },
        {
          id: "2",
          title: "Indian Geography - Physical Features",
          subject: "Geography",
          category: "prelims",
          description: "Detailed notes on physical geography of India with maps and diagrams",
          downloadUrl: "/notes/geography-physical.pdf",
          fileSize: "3.1 MB",
          downloadCount: 980,
          rating: 4.7,
          uploadDate: "2025-01-12",
          tags: ["Geography", "Physical", "Maps", "Diagrams"]
        },
        {
          id: "3",
          title: "Indian Polity - Constitutional Framework",
          subject: "Polity",
          category: "prelims",
          description: "Constitutional provisions, amendments, and important articles explained",
          downloadUrl: "/notes/polity-constitution.pdf",
          fileSize: "1.8 MB",
          downloadCount: 1450,
          rating: 4.9,
          uploadDate: "2025-01-10",
          tags: ["Polity", "Constitution", "Amendments", "Articles"]
        },
        {
          id: "4",
          title: "Economic Survey 2024 - Key Highlights",
          subject: "Economics",
          category: "current-affairs",
          description: "Important points from the latest industry survey for tech careers",
          downloadUrl: "/notes/economic-survey-2024.pdf",
          fileSize: "1.2 MB",
          downloadCount: 890,
          rating: 4.6,
          uploadDate: "2025-01-08",
          tags: ["Economics", "Economic Survey", "Current Affairs", "2024"]
        },
        {
          id: "5",
          title: "Science & Technology - Recent Developments",
          subject: "Science & Technology",
          category: "current-affairs",
          description: "Latest developments in AI and Machine Learning technologies",
          downloadUrl: "/notes/science-tech-recent.pdf",
          fileSize: "2.8 MB",
          downloadCount: 750,
          rating: 4.5,
          uploadDate: "2025-01-05",
          tags: ["Science", "Technology", "Recent", "Developments"]
        }
      ];
      
      setNotes(mockNotes);
      setFilteredNotes(mockNotes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    setFilteredNotes(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Study Notes & Materials</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Access comprehensive study notes, summaries, and materials prepared by our expert faculty. 
          All resources are regularly updated and aligned with the latest industry skill standards.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Study Notes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">15</div>
            <div className="text-sm text-muted-foreground">Subjects Covered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Downloads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">4.8★</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes by title, subject, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="prelims">Foundation</TabsTrigger>
            <TabsTrigger value="mains">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] bg-muted relative">
              {note.thumbnailUrl ? (
                <Image
                  src={note.thumbnailUrl}
                  alt={note.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute top-2 left-2">
                <Badge>{note.subject}</Badge>
              </div>
              
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">
                  {note.category.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2 line-clamp-2">{note.title}</CardTitle>
              <CardDescription className="line-clamp-3 mb-4">
                {note.description}
              </CardDescription>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  {note.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {note.downloadCount}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {note.fileSize}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Updated: {new Date(note.uploadDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need More Study Materials?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our courses to get access to exclusive study materials, live sessions, 
            and personalized guidance from expert faculty.
          </p>
          <Link href="/courses">
            <Button size="lg">
              Explore Courses
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
