require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");
const Project = require("./models/Project");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(filePath, fileName, folder) {
  const fileBuffer = fs.readFileSync(filePath);
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName,
    folder: `/webncode/projects/${folder}`,
    useUniqueFileName: false,
  });
  console.log("  Uploaded:", result.url);
  return result.url;
}

const BRAIN = "C:/Users/lenovo/.gemini/antigravity-ide/brain/018a13a8-dcc2-4821-bece-cc19ae1b1da1";

const newProjects = [
  {
    title: "School ERP Pro",
    slug: "school-erp-pro",
    shortDescription: "Complete school management ERP — students, fees, admissions, attendance, reports, and parent portal in one platform.",
    description: "School ERP Pro is a comprehensive enterprise resource planning system built specifically for K-12 schools and educational institutions. It unifies student information management, fee collection, online admissions, attendance tracking, result management, parent communication, and administrative reporting in a single centralized platform. Schools can eliminate paper records, automate workflows, and give parents real-time access to their child's academic journey.",
    category: "Education",
    features: [
      "Student information management",
      "Fee collection & receipt generation",
      "Online admissions & enrollment",
      "Attendance management",
      "Result & marksheet management",
      "Parent portal with real-time updates",
      "Staff & HR management",
      "Multi-branch support",
      "Role-based access control",
      "Analytics & reports dashboard",
      "SMS & email notifications",
      "Certificate generation"
    ],
    demoUrl: "https://demo.webncode.com/school-erp-pro",
    color: "#1E40AF", accentColor: "#DBEAFE",
    ikFolder: "school-erp-pro",
    images: [path.join(BRAIN, "school_erp_dashboard_1789805538261.jpg")],
    names: ["school-erp-1.jpg"],
  },
  {
    title: "Attendance Management System",
    slug: "attendance-management-system",
    shortDescription: "Digital attendance tracking system with biometric sync, parent notifications, and monthly attendance analytics.",
    description: "Attendance Management System enables schools and coaching institutes to track student and staff attendance digitally. It supports biometric device integration, manual entry, and automated parent notifications for absences. Teachers get class-wise attendance grids, institutions get monthly analytics and low-attendance alerts, while parents get instant SMS notifications when their child is marked absent.",
    category: "Education",
    features: [
      "Class-wise digital attendance",
      "Biometric device integration",
      "Manual attendance entry",
      "Instant parent SMS/email alerts",
      "Monthly attendance reports",
      "Low attendance alerts",
      "Subject-wise attendance tracking",
      "Teacher dashboard",
      "Holiday calendar integration",
      "Export attendance reports"
    ],
    demoUrl: "https://demo.webncode.com/attendance-management-system",
    color: "#059669", accentColor: "#D1FAE5",
    ikFolder: "attendance-management",
    images: [path.join(BRAIN, "attendance_dashboard_1789805556650.jpg")],
    names: ["attendance-1.jpg"],
  },
  {
    title: "Result Management System",
    slug: "result-management-system",
    shortDescription: "Automated exam result, marksheet, rank calculation, and report card generation system for schools and colleges.",
    description: "Result Management System streamlines the entire academic result workflow — from marks entry to report card generation. Teachers enter subject-wise marks, and the system automatically calculates totals, percentages, grades, and class ranks. Administrators can generate marksheets, push results to the parent portal, and export performance analytics reports. Supports annual, semester, and periodic examinations.",
    category: "Education",
    features: [
      "Subject-wise marks entry",
      "Automatic grade & rank calculation",
      "Class-wise performance reports",
      "Report card generation",
      "Parent portal result access",
      "Top performers leaderboard",
      "Exam type configuration",
      "Multiple grading systems",
      "Result publication control",
      "Performance analytics charts",
      "Marksheet printing",
      "Year-wise result history"
    ],
    demoUrl: "https://demo.webncode.com/result-management-system",
    color: "#7C3AED", accentColor: "#EDE9FE",
    ikFolder: "result-management",
    images: [path.join(BRAIN, "result_management_dashboard_1789805570631.jpg")],
    names: ["result-1.jpg"],
  },
  {
    title: "Timetable Management System",
    slug: "timetable-management-system",
    shortDescription: "Intelligent timetable generation system with conflict detection, teacher assignment, and multi-class scheduling.",
    description: "Timetable Management System helps educational institutions build clash-free weekly timetables with ease. Administrators can assign teachers to subjects, configure room capacities, and the system flags scheduling conflicts in real time. Generate class-wise and teacher-wise timetables, publish them to the faculty portal, and make instant updates when substitutions are needed.",
    category: "Education",
    features: [
      "Weekly timetable grid builder",
      "Real-time conflict detection",
      "Teacher-to-subject assignment",
      "Room & lab allocation",
      "Class-wise schedule generation",
      "Teacher-wise schedule view",
      "Substitution management",
      "Multi-section multi-class support",
      "Timetable publish & share",
      "Print-ready timetable export"
    ],
    demoUrl: "https://demo.webncode.com/timetable-management-system",
    color: "#D97706", accentColor: "#FEF3C7",
    ikFolder: "timetable-management",
    images: [path.join(BRAIN, "timetable_management_dashboard_1789805584466.jpg")],
    names: ["timetable-1.jpg"],
  },
];

async function seed() {
  console.log("\n=== Seeding 4 New Projects ===\n");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  let ok = 0;
  for (const proj of newProjects) {
    console.log("Seeding:", proj.title);
    const existing = await Project.findOne({ slug: proj.slug });
    if (existing) {
      console.log("  Already exists, skipping:", proj.slug);
      continue;
    }

    let uploadedImages = [];
    for (let i = 0; i < proj.images.length; i++) {
      const fp = proj.images[i];
      if (fs.existsSync(fp)) {
        const url = await uploadImage(fp, proj.names[i], proj.ikFolder);
        uploadedImages.push(url);
      } else {
        console.log("  File not found:", fp);
      }
    }

    try {
      await Project.create({
        title: proj.title, slug: proj.slug,
        shortDescription: proj.shortDescription,
        description: proj.description,
        category: proj.category, features: proj.features,
        demoUrl: proj.demoUrl, color: proj.color,
        accentColor: proj.accentColor,
        images: uploadedImages, isFeatured: false,
      });
      console.log("  Saved:", proj.title);
      ok++;
    } catch(e) {
      console.error("  Error:", e.message);
    }
  }

  console.log("\nDone! " + ok + " new projects added.");
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
