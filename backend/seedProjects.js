/**
 * seedProjects.js
 * Run: node backend/seedProjects.js  (from project root)
 *   or: node seedProjects.js         (from backend folder)
 */
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

const ASSETS = path.join(__dirname, "../src/assets/projects");

const projectsData = [
  {
    title: "Web Builder Pro",
    slug: "web-builder-pro",
    shortDescription: "Professional school website builder with customizable templates and instant publishing.",
    description: "Web Builder Pro enables schools to create, customize, and launch professional websites without coding. Schools can select templates, manage pages, galleries, notices, faculty information, admissions content, and publish their website with ease.",
    category: "Education",
    features: ["Multiple website templates","Drag and drop customization","School profile management","Notice board management","Gallery management","Faculty profiles","Admission pages","News and announcements","Mobile responsive design","SEO optimization","Custom domain support","Cloud hosting"],
    demoUrl: "https://demo.webncode.com/web-builder-pro",
    color: "#7C3AED", accentColor: "#EDE9FE",
    localImages: null,
    remoteImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
    ],
  },
  {
    title: "Timetable Pro",
    slug: "timetable-pro",
    shortDescription: "Smart timetable and academic management platform for schools and educational institutions.",
    description: "Timetable Pro helps schools manage faculty schedules, class timetables, homework assignments, and teaching activities. Teachers can view schedules, submit daily reports, assign homework, track completed topics, and stay organized through a centralized dashboard.",
    category: "Education",
    features: ["Faculty timetable management","Class timetable scheduling","Teacher dashboard","Homework assignment","Daily teaching reports","Period management","Class-wise schedules","Academic planning","Teacher activity tracking","Notifications and updates"],
    demoUrl: "https://demo.webncode.com/timetable-pro",
    color: "#2563EB", accentColor: "#DBEAFE",
    ikFolder: "timetable-pro",
    localImages: [
      { file: path.join(ASSETS,"time-table-pro/ttp1.jpeg"), name: "ttp1.jpeg" },
      { file: path.join(ASSETS,"time-table-pro/ttp2.jpeg"), name: "ttp2.jpeg" },
      { file: path.join(ASSETS,"time-table-pro/ttp3.jpeg"), name: "ttp3.jpeg" },
    ],
  },
  {
    title: "Star Sports",
    slug: "star-sports",
    shortDescription: "Sports ground booking and management platform for sports facility owners.",
    description: "Star Sports helps sports ground owners manage bookings, schedules, customer records, and accounts from a single platform. Owners can track upcoming bookings, prevent booking clashes, manage payments, monitor ground utilization, and maintain complete operational control.",
    category: "Sports",
    features: ["Ground booking management","Booking calendar","Clash-free scheduling","Customer management","Payment tracking","Account management","Booking history","Ground availability tracking","Daily revenue reports","Dashboard analytics"],
    demoUrl: "https://demo.webncode.com/star-sports",
    color: "#F97316", accentColor: "#FFEDD5",
    localImages: null,
    remoteImages: [
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"
    ],
  },
  {
    title: "Test Manager Pro",
    slug: "daily-test-manager-pro",
    shortDescription: "Complete daily test, assessment, ranking, and student performance tracking platform for schools.",
    description: "Daily Test Manager Pro helps schools conduct and manage daily tests, periodic assessments, and student performance tracking. Teachers can assign subjects, enter marks, generate rankings, monitor class performance, and analyze academic progress.",
    category: "Education",
    features: ["Daily test management","Periodic assessment management","Subject-wise marks entry","Automatic rank calculation","Class and section rankings","Teacher subject assignment","Student performance analytics","Parent portal access","Result publishing","Progress reports","Performance comparison","Academic dashboards"],
    demoUrl: "https://demo.webncode.com/daily-test-manager-pro",
    color: "#059669", accentColor: "#D1FAE5",
    ikFolder: "daily-test-pro",
    localImages: [
      { file: path.join(ASSETS,"daily-test-pro/tmp1.png"), name: "tmp1.png" },
      { file: path.join(ASSETS,"daily-test-pro/tmp2.png"), name: "tmp2.png" },
      { file: path.join(ASSETS,"daily-test-pro/tmp3.png"), name: "tmp3.png" },
    ],
  },
  {
    title: "HireHub",
    slug: "hirehub",
    shortDescription: "Candidate and recruitment management platform for employers, consultants, and job seekers.",
    description: "HireHub streamlines the hiring process by helping organizations manage job postings, candidate applications, interviews, and recruitment workflows. Employers can track applicants, shortlist candidates, schedule interviews, and manage hiring activities from a single dashboard.",
    category: "HR",
    features: ["Job posting management","Candidate database","Resume management","Interview scheduling","Applicant tracking","Recruitment dashboard","Employer portal","Candidate profiles","Status tracking","Hiring analytics"],
    demoUrl: "https://demo.webncode.com/hirehub",
    color: "#8B5CF6", accentColor: "#EDE9FE",
    localImages: null,
    remoteImages: [
      "https://images.unsplash.com/photo-1521737711867-e3b90473bd58?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop"
    ],
  },
  {
    title: "Sports Academy Pro",
    slug: "sports-academy-pro",
    shortDescription: "Complete sports academy management platform for academies, coaching centres, and clubs.",
    description: "Sports Academy Pro gives sports academies full control over student enrollments, batch scheduling, fee collection, attendance tracking, performance records, and coach management — all from one powerful dashboard.",
    category: "Sports",
    features: ["Student enrollment management","Batch and group scheduling","Fee collection & receipts","Attendance tracking","Performance records","Coach management","Parent communication","Academy dashboard","Revenue analytics","Certificate generation"],
    demoUrl: "https://demo.webncode.com/sports-academy-pro",
    color: "#F97316", accentColor: "#FFEDD5",
    ikFolder: "sports-academy-pro",
    localImages: [
      { file: path.join(ASSETS,"sports-academy-pro/sap1.png"), name: "sap1.png" },
      { file: path.join(ASSETS,"sports-academy-pro/sap2.png"), name: "sap2.png" },
      { file: path.join(ASSETS,"sports-academy-pro/sap3.png"), name: "sap3.png" },
    ],
  },
  {
    title: "Syllabus Tracker",
    slug: "syllabus-tracker",
    shortDescription: "Real-time syllabus tracking and curriculum progress management for schools.",
    description: "Syllabus Tracker allows teachers and administrators to define curriculum chapters, track teaching progress chapter-by-chapter, monitor completion percentages per class, and generate syllabus completion reports — ensuring every subject stays on schedule.",
    category: "Education",
    features: ["Chapter-wise syllabus mapping","Teacher progress updates","Class-wise completion tracking","Subject syllabus reports","Academic calendar integration","HOD dashboard","Parent visibility","Alerts and reminders","Curriculum analytics"],
    demoUrl: "https://demo.webncode.com/syllabus-tracker",
    color: "#0EA5E9", accentColor: "#E0F2FE",
    ikFolder: "syllabus-tracker",
    localImages: [
      { file: path.join(ASSETS,"time-table-pro/ttp1.jpeg"), name: "st1.jpeg" },
      { file: path.join(ASSETS,"time-table-pro/ttp2.jpeg"), name: "st2.jpeg" },
      { file: path.join(ASSETS,"time-table-pro/ttp3.jpeg"), name: "st3.jpeg" },
    ],
  },
  {
    title: "Broker Connect",
    slug: "broker-connect",
    shortDescription: "Property and real estate broker management platform for agents and agencies.",
    description: "Broker Connect helps real estate agents and agencies manage property listings, client inquiries, site visits, follow-ups, deal closures, and commission tracking from a centralized CRM. Brokers get full pipeline visibility and never miss a lead.",
    category: "Services",
    features: ["Property listings management","Client inquiry tracking","Site visit scheduling","Follow-up reminders","Deal pipeline management","Commission calculation","Agent dashboard","Document management","Lead source tracking","Revenue analytics"],
    demoUrl: "https://demo.webncode.com/broker-connect",
    color: "#1D4ED8", accentColor: "#DBEAFE",
    localImages: null,
    remoteImages: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    ],
  },
];

async function seed() {
  console.log("\n=== WebNCode Project Seeder ===\n");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await Project.countDocuments();
  if (existing > 0) {
    console.log("Clearing", existing, "existing project(s)...");
    await Project.deleteMany({});
  }

  let ok = 0;
  for (const proj of projectsData) {
    console.log("\nSeeding:", proj.title);
    let images = [];
    if (proj.localImages && proj.localImages.length > 0) {
      for (const img of proj.localImages) {
        if (fs.existsSync(img.file)) {
          const url = await uploadImage(img.file, img.name, proj.ikFolder);
          images.push(url);
        } else {
          console.log("  Warning - not found:", img.file);
        }
      }
    } else if (proj.remoteImages) {
      images = proj.remoteImages;
      console.log("  Using", images.length, "remote URL(s)");
    }
    try {
      await Project.create({
        title: proj.title, slug: proj.slug,
        shortDescription: proj.shortDescription,
        description: proj.description,
        category: proj.category, features: proj.features,
        demoUrl: proj.demoUrl, color: proj.color,
        accentColor: proj.accentColor, images, isFeatured: false,
      });
      console.log("  Saved:", proj.title);
      ok++;
    } catch (e) {
      console.error("  Error:", proj.title, "-", e.message);
    }
  }

  console.log("\nDone! " + ok + "/" + projectsData.length + " projects seeded.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error("Fatal:", e); process.exit(1); });
