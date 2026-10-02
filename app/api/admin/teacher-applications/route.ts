import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET /api/admin/teacher-applications - Get all teacher applications
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Get all users who applied to be teachers (have application data)
    const applications = await db.collection("teacher_applications")
      .find({})
      .sort({ appliedAt: -1 })
      .toArray();

    // If no specific applications collection, get from users with pending role requests
    if (applications.length === 0) {
      const userApplications = await db.collection("users")
        .find({ 
          $or: [
            { roleRequest: "COACH" },
            { role: "COACH", isVerified: false }
          ]
        })
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json(
        userApplications.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone || '',
          location: user.location || '',
          bio: user.bio || '',
          qualifications: user.qualifications || [],
          specialization: user.specialization || [],
          experience: user.experience || '',
          achievements: user.achievements || [],
          languages: user.languages || ['English'],
          status: user.role === 'COACH' && !user.isVerified ? 'PENDING' : (user.roleRequest === 'COACH' ? 'PENDING' : 'APPROVED'),
          appliedAt: user.roleRequestDate || user.createdAt || new Date().toISOString(),
          documents: user.documents || {}
        }))
      );
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching teacher applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST /api/admin/teacher-applications - Create mock applications for demo
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Create some mock applications for demo
    const mockApplications = [
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91-9876543210",
        location: "New Delhi, India",
        bio: "Experienced technology trainer with 15+ years of teaching experience. Former industry professional with expertise in Cyber Security and Software Engineering.",
        qualifications: ["Ph.D. in Public Administration", "M.A. Political Science", "B.A. History"],
        specialization: ["General Studies", "Public Administration", "Indian Polity", "Current Affairs"],
        experience: "15+ years of teaching experience in technology training. Former security engineer. Trained 500+ successful candidates.",
        achievements: [
          "Former Security Engineer, Banking Sector",
          "Author of 3 books on cyber security",
          "500+ successful students",
          "Featured in multiple educational magazines"
        ],
        languages: ["English", "Hindi", "Bengali"],
        status: "PENDING",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        documents: {
          resume: "rajesh_kumar_resume.pdf",
          certificates: ["phd_certificate.pdf", "industry_service_certificate.pdf"]
        }
      },
      {
        name: "Prof. Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91-9876543211",
        location: "Mumbai, Maharashtra",
        bio: "Data Science and AI specialist with focus on Machine Learning training. University professor with research background.",
        qualifications: ["M.Phil. Geography", "M.A. Geography", "B.Sc. Environmental Science"],
        specialization: ["Geography", "Environment", "Disaster Management", "Climate Change"],
        experience: "12 years of university teaching and 8 years of technology training experience.",
        achievements: [
          "Published 25+ research papers",
          "Guest lecturer at multiple universities",
          "Environmental consultant for government projects",
          "200+ successful tech candidates"
        ],
        languages: ["English", "Hindi", "Marathi"],
        status: "PENDING",
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        documents: {
          resume: "priya_sharma_resume.pdf",
          certificates: ["mphil_certificate.pdf", "teaching_experience.pdf"]
        }
      },
      {
        name: "Amit Singh",
        email: "amit.singh@example.com",
        phone: "+91-9876543212",
        location: "Jaipur, Rajasthan",
        bio: "History and Culture expert specializing in Ancient and Medieval Indian History. Published author and researcher.",
        qualifications: ["M.A. History", "B.A. History", "Diploma in Archaeology"],
        specialization: ["Ancient History", "Medieval History", "Art & Culture", "Archaeology"],
        experience: "10 years of teaching experience with focus on AI & ML training and hands-on projects.",
        achievements: [
          "Author of 'Ancient India Comprehensive Guide'",
          "Winner of Best Teacher Award 2023",
          "Research associate at Archaeological Survey of India",
          "300+ successful students"
        ],
        languages: ["English", "Hindi", "Rajasthani"],
        status: "APPROVED",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        documents: {
          resume: "amit_singh_resume.pdf",
          certificates: ["ma_certificate.pdf", "asi_certificate.pdf"]
        }
      }
    ];

    // Insert into teacher_applications collection
    const result = await db.collection("teacher_applications").insertMany(mockApplications);

    return NextResponse.json({ 
      message: 'Mock applications created successfully',
      insertedCount: result.insertedCount 
    });
  } catch (error) {
    console.error("Error creating mock applications:", error);
    return NextResponse.json(
      { error: "Failed to create applications" },
      { status: 500 }
    );
  }
}
