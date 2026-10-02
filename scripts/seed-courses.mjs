// Re-runnable seed script for the courses collection.
// Usage (from backend/): MONGODB_URI=... node scripts/seed-courses.mjs
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
});

const now = new Date();

const courses = [
  {
    title: "Cyber Security: Zero to Hero",
    description:
      "Master ethical hacking, network security and cyber defense. Practical labs with Kali Linux, real-world attack simulations and defensive strategies.",
    category: "cyber-security",
    price: 14999,
    duration: "8 weeks",
    level: "beginner",
    deliveryMode: "live-online",
    totalClasses: 24,
    syllabus:
      "Week 1-2: Networking fundamentals\nWeek 3-4: Linux & Kali for security\nWeek 5: Ethical hacking & penetration testing\nWeek 6: Web app & network defense\nWeek 7: Incident response basics\nWeek 8: Capstone security project",
    prerequisites: "Basic computer literacy. No prior security knowledge required.",
    outcomes:
      "Perform basic penetration tests\nHarden systems against common attacks\nAnalyze network traffic for threats\nUnderstand the ethical hacking lifecycle",
    materials: "Kali Linux setup guide, lab workbook, capture-the-flag challenges",
    assessments: "Weekly quizzes, hands-on lab exercises, final security audit project",
    tags: ["cyber security", "ethical hacking", "networking", "kali"],
  },
  {
    title: "Certified Ethical Hacker (CEH v12)",
    description:
      "Industry-aligned CEH preparation: reconnaissance, scanning, exploitation, web app attacks, wireless hacking and reporting — with exam-focused mock tests.",
    category: "ethical-hacking",
    price: 24999,
    duration: "12 weeks",
    level: "intermediate",
    deliveryMode: "hybrid",
    totalClasses: 36,
    syllabus:
      "Module 1: Introduction to ethical hacking\nModule 2: Footprinting & reconnaissance\nModule 3: Network scanning & enumeration\nModule 4: System hacking\nModule 5: Web application & SQL injection attacks\nModule 6: Wireless & mobile hacking\nModule 7: Social engineering\nModule 8: Reporting & mitigation",
    prerequisites: "Knowledge of networking basics. Cyber Security Zero to Hero recommended.",
    outcomes:
      "Cover the full CEH exam blueprint\nRun Nmap, Metasploit, Burp Suite and Wireshark\nWrite professional penetration test reports\nClear CEH v12 mock exams",
    materials: "CEH v12 study guide, practice lab VMs, question banks",
    assessments: "Module-wise assessments, 3 full-length mock exams, final offensive lab",
    tags: ["CEH", "ethical hacking", "certification", "offensive security"],
  },
  {
    title: "AI & Machine Learning: Intelligent Systems",
    description:
      "Python, TensorFlow and neural networks to build real-world AI. Covers supervised/unsupervised learning, deep learning and deployment of ML models.",
    category: "ai-ml",
    price: 19999,
    duration: "12 weeks",
    level: "intermediate",
    deliveryMode: "live-online",
    totalClasses: 30,
    syllabus:
      "Week 1-3: Python for data science\nWeek 4-5: Statistics & math for ML\nWeek 6-7: Supervised learning (regression & classification)\nWeek 8: Unsupervised learning\nWeek 9-10: Neural networks & deep learning\nWeek 11-12: Model deployment & capstone",
    prerequisites: "Basic Python programming. Curiosity about how AI works.",
    outcomes:
      "Build and train ML models in Python\nImplement neural networks with TensorFlow\nTune models for accuracy on real datasets\nDeploy an ML model as an API",
    materials: "Jupyter notebooks, curated datasets, Google Colab access",
    assessments: "Weekly coding assignments, model-building projects, capstone AI project",
    tags: ["AI", "machine learning", "python", "tensorflow", "deep learning"],
  },
  {
    title: "Data Science: Analytics Mastery",
    description:
      "Python, SQL, statistics and visualization for analytics. From data cleaning to big data, dashboards and business insight.",
    category: "data-science",
    price: 19999,
    duration: "10 weeks",
    level: "beginner",
    deliveryMode: "live-online",
    totalClasses: 28,
    syllabus:
      "Week 1: Python fundamentals for analytics\nWeek 2-3: SQL & databases\nWeek 4: Statistics & probability\nWeek 5: Data cleaning & EDA\nWeek 6: Data visualization (Matplotlib, Power BI)\nWeek 7-8: Machine learning for analytics\nWeek 9-10: Big data intro & capstone project",
    prerequisites: "Comfort with basic math. No coding experience needed.",
    outcomes:
      "Query and manipulate data with SQL\nVisualize insights with Power BI and Python\nApply statistics to solve business problems\nDeliver a full analytics project",
    materials: "Datasets library, SQL playground, dashboard templates",
    assessments: "SQL challenges, visualization tasks, capstone analytics dashboard",
    tags: ["data science", "data analytics", "sql", "power bi", "python"],
  },
  {
    title: "IoT & Embedded Systems",
    description:
      "Industrial IoT, microcontrollers, sensors, PLC/SCADA and smart automation. Hardware + software with hands-on lab kits and industry projects.",
    category: "iot-embedded",
    price: 15999,
    duration: "8 weeks",
    level: "intermediate",
    deliveryMode: "hybrid",
    totalClasses: 22,
    syllabus:
      "Week 1-2: Electronics basics & microcontrollers (Arduino/ESP32)\nWeek 3: Sensors, actuators & wiring\nWeek 4: Embedded C & firmware\nWeek 5-6: IoT protocols (MQTT, HTTP) & cloud\nWeek 7: PLC & industrial automation intro\nWeek 8: Capstone IoT product",
    prerequisites: "Willingness to tinker with hardware. Basic programming helps.",
    outcomes:
      "Build IoT devices with ESP32/Arduino\nRead sensors and control actuators\nPublish device data to the cloud\nDesign a small industrial automation setup",
    materials: "IoT starter kit (board, sensors, wires), cloud sandbox",
    assessments: "Circuit build tasks, firmware labs, final IoT capstone device",
    tags: ["IoT", "embedded", "arduino", "esp32", "automation"],
  },
  {
    title: "Robotics & Automation",
    description:
      "Design, build and program robots. Covers kinematics, sensors, motor control, ROS basics and industrial automation projects.",
    category: "robotics",
    price: 16999,
    duration: "10 weeks",
    level: "intermediate",
    deliveryMode: "hybrid",
    totalClasses: 26,
    syllabus:
      "Week 1-2: Robotics fundamentals & kinematics\nWeek 3-4: Motor control & actuators\nWeek 5-6: Sensors, vision & perception\nWeek 7-8: Programming robots (Python/C++)\nWeek 9: ROS basics\nWeek 10: Final robot build & demo",
    prerequisites: "Basic programming. IoT & Embedded Systems recommended.",
    outcomes:
      "Assemble and wire a working robot\nProgram movement and obstacle avoidance\nApply ROS to a small robot\nShowcase a robotics capstone project",
    materials: "Robot kit, sensor pack, code samples",
    assessments: "Build milestones, programming challenges, final robot demo",
    tags: ["robotics", "automation", "ros", "embedded"],
  },
  {
    title: "Full Stack Development (MERN)",
    description:
      "MongoDB, Express, React and Node.js — build, deploy and ship production web applications with live industry projects.",
    category: "web-development",
    price: 24999,
    duration: "14 weeks",
    level: "beginner",
    deliveryMode: "live-online",
    totalClasses: 42,
    syllabus:
      "Week 1-3: HTML, CSS & JavaScript\nWeek 4-7: React & modern frontend\nWeek 8-10: Node.js & Express APIs\nWeek 11-12: MongoDB & Mongoose\nWeek 13: Deployment & performance\nWeek 14: Capstone full-stack project",
    prerequisites: "No prior experience required. Strong work ethic a must.",
    outcomes:
      "Build responsive React interfaces\nDesign REST APIs with Node/Express\nModel data with MongoDB\nDeploy a full-stack app to production",
    materials: "Project starter templates, deployment guides, code reviews",
    assessments: "Weekly builds, 3 portfolio projects, final full-stack capstone",
    tags: ["full stack", "mern", "react", "node", "javascript", "mongodb"],
  },
  {
    title: "EV Technology",
    description:
      "Electric vehicle fundamentals: batteries, motors, controllers, charging infrastructure and EV design with hands-on lab demos.",
    category: "ev-technology",
    price: 12999,
    duration: "8 weeks",
    level: "advanced",
    deliveryMode: "hybrid",
    totalClasses: 20,
    syllabus:
      "Week 1: EV industry overview & components\nWeek 2-3: Battery technology & BMS\nWeek 4: Motors & motor controllers\nWeek 5: Power electronics & converters\nWeek 6: Charging infrastructure\nWeek 7-8: EV design project & demo",
    prerequisites: "Electrical/electronics fundamentals. Strong interest in EVs.",
    outcomes:
      "Explain EV powertrain architecture\nSize batteries and motors for a vehicle\nUnderstand BMS and charging systems\nComplete an EV concept design",
    materials: "Component sample kits, simulation tools",
    assessments: "Component quizzes, system design tasks, EV design project",
    tags: ["EV", "electric vehicle", "battery", "electronics"],
  },
  {
    title: "Cloud & DevOps Engineering",
    description:
      "AWS, Docker, Kubernetes, CI/CD and infrastructure as code. Run services the way modern tech companies do.",
    category: "cloud-devops",
    price: 21999,
    duration: "12 weeks",
    level: "intermediate",
    deliveryMode: "live-online",
    totalClasses: 34,
    syllabus:
      "Week 1-2: Linux & shell scripting\nWeek 3-4: AWS core services\nWeek 5-6: Docker & containers\nWeek 7-8: Kubernetes\nWeek 9-10: CI/CD pipelines\nWeek 11: Infrastructure as code (Terraform)\nWeek 12: Capstone DevOps project",
    prerequisites: "Comfortable using a terminal. Some programming exposure.",
    outcomes:
      "Deploy apps on AWS\nContainerize and orchestrate with Docker/K8s\nAutomate builds with CI/CD\nCode infrastructure with Terraform",
    materials: "AWS sandbox credits, pipeline templates, YAML cheat sheets",
    assessments: "Hands-on labs, pipeline builds, final DevOps deployment project",
    tags: ["devops", "aws", "docker", "kubernetes", "ci/cd"],
  },
  {
    title: "Python Programming: Zero to Pro",
    description:
      "From your first print statement to automation and APIs. Python essentials for anyone starting a coding career.",
    category: "python",
    price: 9999,
    duration: "6 weeks",
    level: "beginner",
    deliveryMode: "live-online",
    totalClasses: 18,
    syllabus:
      "Week 1: Setup & Python basics\nWeek 2: Data structures & control flow\nWeek 3: Functions & modules\nWeek 4: OOP in Python\nWeek 5: File handling, APIs & automation\nWeek 6: Final project",
    prerequisites: "None. Just a computer and internet connection.",
    outcomes:
      "Write clean Python programs\nAutomate repetitive tasks\nConsume REST APIs\nBuild a portfolio mini-project",
    materials: "Practice problem sets, reference book list",
    assessments: "Coding challenges, mini projects, final automation project",
    tags: ["python", "programming", "beginner"],
  },
];

async function run() {
  await client.connect();
  const db = client.db();
  const col = db.collection("courses");

  const res = await col.deleteMany({ tags: "yuvabot-dummy" });
  console.log(`Removed ${res.deletedCount} previous seeded courses`);

  const docs = courses.map((c) => ({
    ...c,
    tags: [...new Set([...(c.tags || []), "yuvabot-dummy"])],
    image: null,
    status: "published",
    teacherId: null,
    teacherName: "Expert Faculty",
    teacherEmail: null,
    enrolledStudents: [],
    enrolledCount: 0,
    createdAt: now,
    updatedAt: now,
  }));

  await col.insertMany(docs);
  console.log(`Inserted ${docs.length} courses`);

  const total = await col.countDocuments({}); 
  console.log(`Total courses in collection now: ${total}`);

  await client.close();
}

run().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});