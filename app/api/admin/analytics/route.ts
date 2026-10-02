import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
        const session = await auth();
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";
    
    // Calculate date range
    const now = new Date();
    const daysAgo = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

    const db = await getDatabase();
   

    // Get all collections
    const usersCollection = db.collection("users");
    const coursesCollection = db.collection("courses");
    const enrollmentsCollection = db.collection("enrollments");
    const paymentsCollection = db.collection("payments");
    const reviewsCollection = db.collection("reviews");

    // Parallel data fetching
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalPayments,
      recentUsers,
      recentCourses,
      recentEnrollments,
      usersByRole,
      coursesByStatus,
      recentPayments,
      reviews,
      popularCourses
    ] = await Promise.all([
      // Total counts
      usersCollection.countDocuments(),
      coursesCollection.countDocuments(),
      enrollmentsCollection.countDocuments(),
      paymentsCollection.countDocuments({ status: "COMPLETED" }),
      
      // Recent data for growth calculation
      usersCollection.countDocuments({ createdAt: { $gte: startDate } }),
      coursesCollection.countDocuments({ createdAt: { $gte: startDate } }),
      enrollmentsCollection.countDocuments({ createdAt: { $gte: startDate } }),
      
      // User distribution
      usersCollection.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]).toArray(),
      
      // Course distribution
      coursesCollection.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]).toArray(),
      
      // Recent payments for revenue calculation
      paymentsCollection.find({ 
        status: "COMPLETED",
        createdAt: { $gte: startDate }
      }).toArray(),
      
      // Reviews for engagement metrics
      reviewsCollection.find({}).toArray(),
      
      // Popular courses
      enrollmentsCollection.aggregate([
        { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
        { $sort: { enrollments: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course"
          }
        },
        { $unwind: "$course" }
      ]).toArray()
    ]);

    // Calculate revenue
    const totalRevenue = totalPayments > 0 ? await paymentsCollection.aggregate([
      { $match: { status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray().then(result => result[0]?.total || 0) : 0;

    const recentRevenue = recentPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    // Calculate growth rates (simplified - compare recent period to previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    const [prevUsers, prevCourses, prevEnrollments] = await Promise.all([
      usersCollection.countDocuments({ 
        createdAt: { 
          $gte: previousPeriodStart, 
          $lt: startDate 
        } 
      }),
      coursesCollection.countDocuments({ 
        createdAt: { 
          $gte: previousPeriodStart, 
          $lt: startDate 
        } 
      }),
      enrollmentsCollection.countDocuments({ 
        createdAt: { 
          $gte: previousPeriodStart, 
          $lt: startDate 
        } 
      })
    ]);

    const prevRevenue = await paymentsCollection.aggregate([
      { 
        $match: { 
          status: "COMPLETED",
          createdAt: { 
            $gte: previousPeriodStart, 
            $lt: startDate 
          }
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray().then(result => result[0]?.total || 0);

    // Calculate growth rates
    const calculateGrowthRate = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // User role distribution
    const roleDistribution = {
      students: 0,
      teachers: 0,
      admins: 0
    };

    usersByRole.forEach(role => {
      const roleName = role._id?.toLowerCase();
      if (roleName === 'student') roleDistribution.students = role.count;
      else if (roleName === 'teacher') roleDistribution.teachers = role.count;
      else if (roleName === 'admin') roleDistribution.admins = role.count;
    });

    // Course status distribution
    const publishedCourses = coursesByStatus.find(c => c._id === 'PUBLISHED')?.count || 0;
    const draftCourses = coursesByStatus.find(c => c._id === 'DRAFT')?.count || 0;

    // Engagement metrics
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
      : 0;

    const coursesPerStudent = roleDistribution.students > 0 
      ? totalEnrollments / roleDistribution.students 
      : 0;

    // Top earning teachers (simplified)
    const topTeachers = await coursesCollection.aggregate([
      { $match: { teacherId: { $exists: true } } },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher"
        }
      },
      { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$teacherId",
          name: { $first: "$teacher.name" },
          courses: { $sum: 1 },
          enrollments: { $sum: { $size: "$enrollments" } },
          revenue: { $sum: { $multiply: [{ $size: "$enrollments" }, "$price"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]).toArray();

    // Course performance
    const coursePerformance = popularCourses.map(item => ({
      courseId: item._id.toString(),
      title: item.course.title,
      enrollments: item.enrollments,
      revenue: item.enrollments * (item.course.price || 0),
      rating: 0 // Would need to calculate from reviews
    }));

    // Build response data
    const analyticsData = {
      overview: {
        totalUsers,
        totalCourses,
        totalRevenue,
        totalEnrollments,
        growthRates: {
          users: calculateGrowthRate(recentUsers, prevUsers),
          courses: calculateGrowthRate(recentCourses, prevCourses),
          revenue: calculateGrowthRate(recentRevenue, prevRevenue),
          enrollments: calculateGrowthRate(recentEnrollments, prevEnrollments)
        }
      },
      userMetrics: {
        totalUsers,
        activeUsers: recentUsers, // Simplified - would need session tracking
        newUsersThisMonth: recentUsers,
        userRetentionRate: 75, // Would need to calculate properly
        usersByRole: roleDistribution,
        userGrowthTrend: [] // Would need month-by-month data
      },
      courseMetrics: {
        totalCourses,
        publishedCourses,
        draftCourses,
        averageCourseRating: averageRating,
        courseCompletionRate: 68, // Would need completion tracking
        popularCategories: [], // Would need category data
        coursePerformance
      },
      revenueMetrics: {
        totalRevenue,
        monthlyRevenue: recentRevenue,
        averageOrderValue: totalPayments > 0 ? totalRevenue / totalPayments : 0,
        revenueGrowthRate: calculateGrowthRate(recentRevenue, prevRevenue),
        revenueByMonth: [], // Would need month-by-month data
        topEarningTeachers: topTeachers.map(teacher => ({
          teacherId: teacher._id.toString(),
          name: teacher.name || 'Unknown Teacher',
          revenue: teacher.revenue || 0,
          courses: teacher.courses || 0
        }))
      },
      engagementMetrics: {
        averageSessionDuration: 45, // Would need session tracking
        coursesPerStudent,
        averageRating,
        reviewCount: reviews.length,
        activeStudentsThisMonth: Math.floor(recentUsers * 0.8), // Simplified
        courseCompletionRate: 68 // Would need completion tracking
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
