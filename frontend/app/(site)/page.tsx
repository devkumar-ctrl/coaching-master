"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Rocket,
  Briefcase,
  Calendar,
  Video,
  Award,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  Sparkles,
  Target,
  Globe,
  Star,
  Infinity as InfinityIcon,
  Eye,
  Brain,
  Stethoscope,
  Languages,
  Download,
  Quote,
  Trophy,
  Newspaper,
  FileText,
  PlayCircle,
  Library,
  HelpCircle,
  Building2,
} from "lucide-react";

const HERO_ROTATOR = [
  "Enterprise Automation",
  "Agentic Workflows",
  "Scalable Infrastructure",
  "Personalised Apps",
];

const PARTNER_CHIPS = [
  "Vishlesan I-Hub, IIT Patna",
  "NASSCOM",
  "NSDC",
  "Skill India",
  "European HEA",
  "MIA",
  "SSC-NASSCOM",
];

const ACCREDITATIONS = [
  {
    icon: Globe,
    title: "EU Credit System Recognised",
    description:
      "EU Credit system accredited by European HEA - Globally recognised degree",
  },
  {
    icon: ShieldCheck,
    title: "Joint Certification with Tech Leaders",
    description:
      "Joint Certification in Next Gen Technologies with leading technology partners",
  },
  {
    icon: Award,
    title: "National Skill Framework Aligned",
    description:
      "SSC-NASSCOM aligned skill badges recognised by National Skill Framework",
  },
  {
    icon: BadgeIcon,
    title: "NOS Verified Curriculum",
    description:
      "Curriculum verified by National Occupational Standards (NSDC & Skill India)",
  },
];

const CO_DESIGNED_POINTS = [
  "IIT Standard Faculty & Learning Framework",
  "Co-Designed with Professionals",
  "Joint Certification in Next Gen Technologies",
  "AI-enabled Industry CoLab Projects",
];

type CourseEntry = {
  id: string;
  group: "degree" | "professional";
  typeLabel: string;
  title: string;
  partners: string[];
  duration: string;
  batch: string;
  highlight?: string;
};

const HOME_COURSES: CourseEntry[] = [
  {
    id: "ms-ai-systems",
    group: "degree",
    typeLabel: "Degree",
    title: "MS in Computer Science : AI Systems & ML Engineering",
    partners: ["European", "MIA"],
    duration: "12-15 months",
    batch: "20th Oct, 2026",
    highlight: "European- HEA Licensed",
  },
  {
    id: "ms-cloud",
    group: "degree",
    typeLabel: "Degree",
    title: "MS in Computer Science : Cloud & AI Infrastructure Engineering",
    partners: ["European", "MIA"],
    duration: "12-15 months",
    batch: "30th Oct, 2026",
    highlight: "European- HEA Licensed",
  },
  {
    id: "pro-data-science",
    group: "professional",
    typeLabel: "Professional Certification",
    title: "Professional Certification in Data Science and Agentic AI",
    partners: ["IIT Patna", "NSDC", "Skill India"],
    duration: "8-10 months",
    batch: "20th Oct, 2026",
    highlight: "Vishlesan I-Hub, IIT Patna",
  },
  {
    id: "pro-software",
    group: "professional",
    typeLabel: "Professional Certification",
    title: "Professional Certification in Software Development with AI & DevOps",
    partners: ["IIT Patna", "NSDC", "Skill India"],
    duration: "8-10 months",
    batch: "30th Oct, 2026",
    highlight: "Vishlesan I-Hub, IIT Patna",
  },
  {
    id: "adv-data-science",
    group: "professional",
    typeLabel: "Advanced Certification",
    title: "Advanced Certification in Data Science and AI",
    partners: ["Nasscom", "Skill India", "NSDC"],
    duration: "6-8 months",
    batch: "20th Oct, 2026",
    highlight: "NASSCOM",
  },
  {
    id: "adv-software",
    group: "professional",
    typeLabel: "Advanced Certification",
    title: "Advanced Certification in Software Development and Agentic AI",
    partners: ["Nasscom", "Skill India", "NSDC"],
    duration: "6-8 months",
    batch: "30th Oct, 2026",
    highlight: "NASSCOM",
  },
];

const DOMAINS = [
  { label: "Autonomous Edge AI", icon: Cpu },
  { label: "Computer Vision", icon: Eye },
  { label: "Machine Learning", icon: Brain },
  { label: "Medical AI", icon: Stethoscope },
  { label: "AI Language Processing", icon: Languages },
];

type PlacementStory = {
  name: string;
  role: string;
  domain: string;
  background: string;
  experience: string;
  placedAt: string;
  quote: string;
};

const PLACEMENTS: PlacementStory[] = [
  {
    name: "Kamya Malhotra",
    role: "Statistical Programmer",
    domain: "Data Science",
    background: "Non Tech",
    experience: "Working Professional",
    placedAt: "Novartis",
    quote:
      "AlmaBetter’s curriculum is the best curriculum available online. AlmaBetter’s program is engaging, comprehensive, and student-centered. If you’re serious about accelerating your tech career, you cannot ask for a better platform than AlmaBetter.",
  },
  {
    name: "Daneyal Ahmad",
    role: "Software Engineer",
    domain: "Engineer",
    background: "Tech",
    experience: "Working Professional",
    placedAt: "Leading tech company",
    quote:
      "One of the key factors in completing this milestone was following AlmaBetter's structured learning path. The hands-on projects, mentorship sessions, and real-world challenges helped me apply concepts effectively and stay on track.",
  },
  {
    name: "Divya Kumari",
    role: "Data Scientist",
    domain: "Data Science",
    background: "Tech",
    experience: "Working Professional",
    placedAt: "Leading tech company",
    quote:
      "AlmaBetter provided a structured learning experience with practical projects and great mentorship. It helped me gain confidence in data analytics and machine learning. Thank you for the support!",
  },
  {
    name: "Aditya Sharma",
    role: "Data Scientist",
    domain: "Data Science",
    background: "Non Tech",
    experience: "Working Professional",
    placedAt: "Leading tech company",
    quote:
      "Thank you so much for giving me the opportunity to grow and develop in this field. Your support and encouragement have been invaluable in helping me enhance my skills and gain new knowledge",
  },
  {
    name: "Shouvik Saha",
    role: "Engineer Trainee",
    domain: "Engineer",
    background: "Tech",
    experience: "Working Professional",
    placedAt: "Leading tech company",
    quote:
      "AlmaBetter has been the turning point in my career, and I am truly grateful to have been a part of this journey.",
  },
  {
    name: "Vivek Mishra",
    role: "Associate AI Engineer",
    domain: "AI Engineer",
    background: "Tech",
    experience: "Working Professional",
    placedAt: "Leading tech company",
    quote:
      "My journey with AlmaBetter has been incredibly transformative. The platform's structured curriculum, hands-on projects, and personalized mentorship helped me master data science and machine learning.",
  },
  {
    name: "Yogesh Ginti",
    role: "Frontend Developer-I",
    domain: "Web Development",
    background: "Tech",
    experience: "Working Professional",
    placedAt: "Leading tech company",
    quote:
      "The course content was comprehensive, well-structured, and highly relevant to industry needs. The hands-on approach and expert guidance played a crucial role in enhancing my skills, ultimately helping me secure my job.",
  },
];

const HIRING_PARTNERS = [
  "Novartis",
  "TATA Steel",
  "TCS",
  "Infosys",
  "Accenture",
  "Quantzig",
  "Paisabazaar",
  "Quantiphi",
  "Datametica",
  "ZingHR",
  "Bond India",
  "Bridgei2i",
  "Meesho",
  "MamaEarth",
  "BlackBuck",
  "The Math Company",
];

const FOUNDERS = [
  {
    name: "Ravi Gupta",
    role: "Co-Founder, CEO",
    quote:
      "We're on a mission to make outcome-oriented learning accessible to the young India.",
    tagline: "Your Success, Our Mission!",
  },
  {
    name: "Alok Anand",
    role: "Co-Founder, COO",
    quote:
      "Our goal is to deliver personalised learning that empowers young India to master cutting-edge tech.",
    tagline: "Your Growth, Our Purpose!",
  },
];

const BACKERS = [
  { name: "Vidit Atrey", role: "Co-Founder & CEO, Meesho" },
  { name: "Varun Alagh", role: "Co-Founder, MamaEarth" },
  { name: "Sanjeev Barnwal", role: "Co-Founder & CEO, Meesho" },
  { name: "Rajesh Yabaji", role: "Co-Founder & CEO, BlackBuck" },
  { name: "Rahul Dalmia", role: "Banker, Polymer Technology" },
];

const WALL_INTRO_QUOTE =
  "AlmaBetter's curriculum is the best curriculum available online. AlmaBetter's program is engaging, comprehensive, and student-centered. If you're serious about accelerating your tech career, you cannot ask for a better platform than AlmaBetter.";

type LongStory = {
  name: string;
  role: string;
  text: string;
};

const WALL_STORIES: LongStory[] = [
  {
    name: "Arkoparavo Pradhan",
    role: "Data Analyst",
    text: `Hey everyone, my name is Arkoparavo Pradhan, and I am from West Bengal Calcutta. I recently graduated in 2022 from Maulana Abul Kalam Azad University of Technology. I have always wanted to learn about data science and build a career in this exciting domain. So I decided to go with AlmaBetter's Full Stack Data Science program because of the unique features provided by them. I secured a job offer from TATA Steel within a few months of the program's commencement. I now hold six months of experience as a data analyst at TATA Steel. Almabetter offers a pay-after-placement model and a robust and industry-relevant curriculum, which is like a cherry on the cake. I was already fascinated by the placement guarantee, but as I enrolled and progressed in the learning process, I also really enjoyed the curriculum and the study material AlmaBetter provided. Another thing that I enjoyed was the mock interviews, where I was able to explore myself. Mock interviews also helped me boost my confidence and face any questions or tasks with conviction during the actual job interview. It is one of the best features of AlmaBetter's placement program. The AlmaX Placement program is a 6-week program where students are prepared for the corporate world. The placement program also offers exciting and helpful features such as resume and profile-building sessions. The best part about this program is that it is designed, so students don't feel overwhelmed. Everything here is chronological and prepares us to crack every job interview. Also, the mentors were always ready to help me whenever I felt stuck. AlmaBetter is the perfect place to start if you want a robust data science program. The constant support from the AlmaBetter team is something that will make your learning journey delightful.`,
  },
  {
    name: "Saubhagya Verma",
    role: "Analytics Conslt.",
    text: `Saubhagya Verma secured a pre-placement offer from Quantzig within 26 weeks of the program commencement. Let's hear what Saubhagya has to say about his experience at AlmaBetter. Hello everyone, my name is Saubhagya Verma. I am a BBA graduate with work experience in content writing. I wanted to switch my field to Data Science and hence decided to learn Data Science at AlmaBetter. I secured a pre-placement offer from Quantzig within 26 weeks of the program commencement. Data Science caught my interest when I worked with analysts in my former job for an advertisement campaign. I was impressed by these analysts' work, and I immediately realized that I had to switch to this field as Data Science is the future. I was looking for an affordable and rewarding institute to learn data science and fortunately came across AlmaBetter. Once I was sure about pursuing Data Science, I started looking for online institutes which provide the best curriculum for this vast field. AlmaBetter provides risk-free education with the help of their unique Pay After Placement model and a placement guarantee to young students. I was not financially sound, so AlmaBetter proved to be very cost-effective and empowering. Moreover, the curriculum is student-centered and filled with exciting elements like Capstone Projects and personalized guidance from mentors through one-on-one mentorship sessions. AlmaBetter has made it possible for students from any domain and background to excel in Data Science. My learning experience at AlmaBetter was exactly like I wanted it to be. It was fun, insightful, and very different from my previous experiences. Regular assignments and quizzes kept students engaged and occupied. The constant interaction with mentors and peers helped me learn and understand challenging concepts effortlessly. The one-on-one mentorship sessions were my favorite part of the curriculum, which made AlmaBetter's curriculum stand out. The placement drive played a vital role in securing my current role. The best part of the AlmaX Placement Drive is that I was provided with a dedicated career coach who guided me throughout the placement process. I also learned how to present my ideas to my connections and make the best possible use of my time to engage more people in my network. Multiple Mock Interviews prepared me well for the job interview, and the resume-building session helped me create the most acceptable resume. AlmaBetter provided me with a scope to learn Data Science amidst the chaos of the pandemic, and it was a very unique experience. AlmaBetter's curriculum is one of a kind and student-centered. My only advice for upcoming students would be to trust the process and stay patient. Saubhagya Verma.`,
  },
  {
    name: "Kamya Malhotra",
    role: "Stat. Programmer",
    text: `Kamya Malhotra secured a pre-placement offer from Novartis within 20 weeks of the program commencement. Let's hear what Kamya has to say about her experience at AlmaBetter. Hi everyone, my name is Kamya Malhotra, and I hold a bachelor's degree in B.Sc (Maths) from Delhi University. I am currently pursuing my M.Sc from the same university. I wanted to upskill myself in Data Science and decided to join the AlmaBetter Pro Program. I secured a job at Novartis as Associate Statistical Programmer within 20 weeks of the program commencement. The primary reason why Data Science caught my attention was that I like to play with Data and get meaningful insights from it. Also, it is mind-blowing to see how one can discover interesting facts through huge data. The demand for data scientists is increasing day by day, so I thought of building my career in this domain to grow and become independent. AlmaBetter is the best platform to learn Data Science. Once I decided to upskill, I searched for the best online platforms, and fortunately, I came across AlmaBetter. The best feature that caught my attention was the Pay after Placement with a placement guarantee. Also, exciting features like One-on-one mentorship sessions are beneficial for students trying to learn data science from scratch. AlmaBetter's student-centered curriculum prepared me well for all my interviews, and I learned and grasped all the required knowledge needed to have a successful career in Data Science. AlmaBetter's Pro Program also helped me boost my confidence, and I was able to answer questions in the job interview without any fear. My learning experience at AlmaBetter was fabulous, and I'll always be thankful to the entire AlmaBetter team. I can assure you that AlmaBetter is the right place for learning data science and landing your dream job. My only advice to upcoming students would be to work hard and trust AlmaBetter's unique curriculum. If you are hungry to learn data science, you will build a successful career. Kamya Malhotra.`,
  },
  {
    name: "Vanshika Raj",
    role: "ML Engineer",
    text: `Vanshika Raj from Cohort Aravali secured six pre-placement offers from Paisabazaar, Quantiphi, Lumen, Dunnhumby, The Math Company and Datametica within 32 weeks of program commencement. Let's hear what Vanshika has to say about her experience at AlmaBetter. "Hello Everyone! I am Vanshika Raj. I did my B.Tech in Electronics and Instrumentation from Techno India, Kolkata. After that, I worked as a Data Analyst at Tata Consultancy Services for about 2 years. It all started when I stumbled onto an article that talked about the ways in which Data Science and Machine Learning practices were being utilized to solve problems on a global scale. On reading more about the applications of Data Science in various industries, I decided to learn Data Science and transition into this field. For that purpose, I started looking for online Data Science courses. I soon discovered that most of the institutes that provide Data Science related courses either charge a hefty upfront payment or don't provide a comprehensive curriculum. After browsing through tens of such websites, I came across AlmaBetter and finally found a course worth taking. AlmaBetter has a unique Pay-After-Placement model under which students gain Data Science skills in a risk-free manner. Here, the students don't have to pay for the courses upfront. Instead, they pay the course fee in small installments after they get placed with a minimum salary of 6 LPA. This innovative model ensures that students can wholly focus on their studies without worrying about the fees or even placements. Talking about the curriculum, we had live classes led by instructors who were well-versed in all Data Science concepts. After sitting through live classes, we used to clear all our doubts in the doubt-solving sessions and actively participate in the quizzes that followed. This ensured that we thoroughly understood all the concepts that were being taught in the class. At the end of the day, a daily learning report was also provided to all the students. This report motivated me to put more efforts into learning the topics that I found hard to master. Overall, the curriculum was thorough and tailored to make one succeed. We also had one-on-one Mentorship Sessions regularly with experienced Data Scientists. Having industry practitioners as mentors helped me to stay focused on my goals and improve my communication skills, problem-solving abilities and self-confidence. Interacting with mentors also broadened my network and helped me to get a deep understanding of the work that was being done in the industry. Along with mentorship sessions, AMA Sessions were also conducted every weekend with accomplished folks from the Data Science Industry. These sessions were really insightful and motivated me to keep working hard. Apart from Data Science skills, AlmaBetter also provided its students with a proper communication training. This ensured that we were confident about our answers in interviews. To reduce the stress of an actual job interview, we had a series of mock interviews as well. During my mock interviews, the mentor used a semi-structured interview format rather than a formal one and this helped me in articulating my answers better. These interviews improved my communication skills, gave a boost to my confidence level and thus, prepared me for my real job interview. I would like to thank AlmaBetter for giving me such a holistic learning experience, over just a Data Science course. This was, by far, the best learning experience of my life. I couldn't be happier with the kind of work I'm doing and the amount of difference I am making in the industry. To other students who wish to join AlmaBetter, I want to say that if you have a knack for solving complex Data Science problems, you should definitely join AlmaBetter. The program offered here is robust, well-guided and most importantly, has proven to work. AlmaBetter provides you with a very clear roadmap to success. I say this because I've seen my batchmates getting placed at some of the most accredited companies and this was possible only due to the efforts put in by the AlmaBetter team. All you need to do as a student is to work hard and believe in their process. Vanshika Raj`,
  },
  {
    name: "Vaibhav Thorat",
    role: "Software Developer",
    text: `Vaibhav, a fresher, secured a high-paying job at Bond India with the help of AlmaBetter's robust curriculum and unique offerings. Let's hear about his experience at AlmaBetter. Hey everyone, my name is Vaibhav Thorat, and I am from Amravati. After high school, I joined Aurangabad Government Engineering College for BTech. After graduating, I worked in a production house for 2-3 years. During that time, I was interested in learning Web Development, and that's when I fortunately came across AlmaBetter. Before enrolling in AlmaBetter's Full Stack Web Development course, I thoroughly reviewed the program and curriculum to ensure I got the best education. Moreover, I also shared the course details with a couple of friends working in the same domain to double-check. The response I received from them helped me stick with my decision to enroll in AlmaBetter's course as they were satisfied with the program and said this is more than enough to get you placed and boost your knowledge and skills. AlmaBetter also provides this excellent opportunity to interact and learn from industry experts, which enhances your confidence. I remember a couple of mentors who helped me throughout the journey: Shubham Lal sir, Soumya ma'am, and Monish sir. They used to take doubt-clearing sessions after every class for 15-20 minutes, which helped me a lot and created a comfortable environment for all the learners. Another great feature of AlmaBetter is that they provide career development sessions, which helped me develop my skills to stand tall in the tech world. I am a fresher and working with seniors at the company confidently. This shows what I have learned at AlmaBetter is at par with the current industry standards.`,
  },
  {
    name: "Sri Srinivasan",
    role: "Junior Developer",
    text: `“AlmaBetter provides incredible features like one-on-one mentorship sessions and multiple coding problems to prepare you to appear in the interviews of big companies.” Hey everyone, my name is Sri Srinivasan, and I am from Coimbatore, Tamil Nadu. After completing high school in 2019, I pursued a Chartered Accountant course at the Insitute of Chartered Accountants of India. After a while, I realized that I am interested in the tech world and should look for ways to switch my career. Fortunately, I came across AlmaBetter and enrolled in their Full Stack Web Development course. I secured a job offer from MatDun soon after the program's commencement. My learning experience at AlmaBetter was made easy by weekly doubt resolution. Every week a mentor helped us in clearing all our doubts. Moreover, on weekends there was a different mentor to clear doubts about the concepts we learned during the week. Every doubt is resolved with the assistance of industry experts. Another great feature of AlmaBetter is that they train students to be more comfortable in problem-solving through various resources. AlmaBetter's dashboard is the perfect place to solve coding problems and problem-solving approach questions. All these daily assignments help us in sharpening our technical skills regularly. Once you enter the AlmaX Placement program, you are guided by a specially trained placement team throughout the journey. Once we gain knowledge through AlmaBetter's training, the placement team can quickly place you in 10-15 days. Several companies approached us for a job interview, which was a delightful experience. I can assure you that the AlmaBetter Placement Team works relentlessly towards placing their learners in top companies. I will recommend AlmaBetter to other aspiring learners like me and my friends for three reasons: A structured course, robust curriculum, and the affordable placement program fee. Learners can pay their placement program fee in easy monthly installments after getting placed at a high-paying company. However, learners should match the hard work done by the AlmaBetter team to get the desired results. If you collaborate with the AlmaBetter team, your success is guaranteed!`,
  },
  {
    name: "Soumyajit Das",
    role: "Business Analyst",
    text: `Soumyajit Das from Cohort Aravali secured multiple pre-placement offers from Aryng and Bridgei2i within 21 weeks of the program. Let's hear what Soumyajit has to say about his experience at AlmaBetter. Hello everyone, my name is Soumyajit Das. I did my masters in Mechanical Engineering from NIT Rourkela. I have 4 years of working experience in the field of analytics with Indian Navy and currently, I'm working as a Business Analyst at Bridgei2i. As I did not have any former education in the field of data science, I thought it would be better to do a course online and subsequently, I searched for the best courses on Google. But I ended up choosing an institute which charged me a lot of money for their course but their curriculum wasn't upto the mark. Even after completion of the course I could feel that my learning was incomplete. Luckily, I got to know about AlmaBetter. I was a bit hesitant about pursuing the course at first. I thought what if this turns out to be similar to my prior experience with online learning. But their job guarantee feature and the pay after placement model made me feel that I was making the right decision while choosing AlmaBetter. Since the students only pay after they are placed with 6 LPA or more, I knew the main focus of AlmaBetter was to educate and prepare students so that they can get jobs. I personally feel that this is a great initiative as it eliminates the concept of student debt so that students focus only on learning and not on how they'll repay their college loans. Coming to the curriculum, I'd like to say that I feel that this is the sort of robust curriculum that every student needs. My learning experience at AlmaBetter was entirely different from my previous learning experiences. They made learning fun with the use of visual effects and gamification while teaching. The curriculum is structured in such a way so that there can be a smooth transition between each module. Regular doubt solving sessions helped me move on to the next module only after understanding the previous module thoroughly. The daily assignments, capstone projects, mentorship sessions and the placement drive all are designed to make you industry-ready. Capstone projects gave me the opportunity to work with projects which were similar to real life projects with large datasets. I learnt so many things. It didn't just help me improve my technical skills but it also helped me to get to know batchmates better. I got to know about their insights, how they think and approach the problem. Also, team collaboration helped me learn how to work in teams efficiently. Along with projects, what helped me the most were the AMA Sessions. They were held weekly with industry experts and helped me understand how models are being implemented to provide practical solutions. I got to hear about their experiences and journeys, which was very inspiring. I also got to know about so many prospects that data science holds through these one-on-one interactions. Another thing about AlmaBetter is that they prepare students for interviews in their one month long placement drive. The drive includes mock interviews which played a massive role in helping me secure the job. I have given around 30 mock interviews. Imagine, 1 interview consists of 3 rounds so this exercise was essentially the same as giving 10 real interviews. It not just helped me to prepare the technical stuff but also boosted my confidence and I learnt how to articulate my answers in a better way. If I were to describe my journey at AlmaBetter in one phrase, I'd call it 'Life Changing'. So, to all the students who are enthusiastic about entering the Data Science world and wish to join AlmaBetter, I'd like to say that we were the first batch of AlmaBetter and before completion of the course, 50% students of our batch got placed. The jobs part is taken care of by the AlmaHire team, but you have to be ready to grab the opportunity whenever it is presented to you. Trust them and enjoy the ride. Soumyajit Das.`,
  },
  {
    name: "Shirsh Verma",
    role: "Analytics Asst. Mgr.",
    text: `Shirsh Verma secured a pre-placement offer from Tata Insights and Quants within 15 weeks of the program commencement. Let's hear what Shirsh has to say about his experience at AlmaBetter. Hi everyone, my name is Shirsh Verma. I hold a Bachelor's degree in Physical Science from Kirori Mal College, Delhi University. Post-graduation, I joined AlmaBetter to hone my Data Science skills. Within 15 weeks of the program commencement, I got placed as the Assistant Manager of Analytics at Tata Insights and Quants. My journey at AlmaBetter was amazing. Because of AlmaBetter's Pay-After-Placement model, I focused on learning Data Science concepts without worrying about placements or course fees. And throughout the journey, I learnt so much from my instructors, mentors and peers. The adventurous AlmaBetter journey made me better. I enrolled in AlmaBetter's Premium Program, which covered the A to Z of Data Science. The curriculum consisted of live classes, which were followed by doubt-solving sessions and quizzes. And all of the instructors taught through gamification of concepts which made learning fun. I also received feedback and learning reports regularly, ensuring that I knew where I was lacking and could improve in those places. After being introduced to their robust curriculum, I was confident that I could easily get placed at a good firm with their training. The mentorship and AMA Sessions were the best thing about the curriculum. These sessions helped me clear all my doubts and gave me a brief idea of how the Data Science Industry works. Each time I had my mentorship session, I felt more confident about myself. These interactions with industry experts truly helped me grow professionally as well as personally. AlmaBetter's unique curriculum also included working on Capstone Projects. For these industry-related projects, we collaborated with our peers and solved interesting Data Science problems. It was a fantastic experience as I got to learn so much from my batchmates. Capstone projects also gave me solid hands-on experience working with data-centric models and helped me brush up my team skills. In my opinion, AlmaBetter stands for honesty. When they say they won't ask for a single penny till you get a job with a 6 LPA salary or more, they mean it. It's impressive how the AlmaBetter team invests in their students and makes their dreams come true without any upfront payment. Most of the institutes charge a lot for their Data Science courses and give no job guarantee. But AlmaBetter is different. They put an end to the job-seeking struggle that graduates face. I didn't even have a Computer Science background, yet I got placed within weeks of joining AlmaBetter. To all those looking to join AlmaBetter, I want to say that I've seen how dedicated the AlmaBetter team is, and I can vouch for the efforts they put in getting all the students placed. So, if you want a successful career in the Data Science domain, AlmaBetter is just the place for you. Shirsh Verma`,
  },
  {
    name: "Isaac Ebenezer",
    role: "Software Developer",
    text: `Isaac Ebenezer, a person with a coding background yet unable to grasp the art of coding, enrolled in AlmaBetter's Full Stack Web Development course and secured a high-paying tech job at ZingHR. Let's hear what Isaac has to say about his experience at AlmaBetter. Hey everyone, my name is Isaac Ebenezer, and I am from Hyderabad. I completed my graduation in the stream BSc in 2022. After completing college, I was looking for opportunities to upskill and secure a high-paying tech job. Fortunately, I came across AlmaBetter through a YouTube Ad I decided to enroll in the Full Stack Web Development course. I saw the results through AlmaBetter's Success Stories they have shown in the last couple of years, and it boosted my trust in AlmaBetter, and now I am the next success story. While I am from a coding background, I did not know anything about coding, which is an essential skill for a tech job. I learned the art of coding from scratch with the help of AlmaBetter's mentors and instructors, who are also industry experts working in top tech companies. The educators at AlmaBetter explained all the essential topics well and helped me create projects. It is a great learning platform to upskill and express your talents. I think the opportunity to interact with industry leaders helped in several ways. Moreover, during my time at AlmaBetter, I was always motivated to perform better while getting the required support and feedback from the mentors. The career development skills I learned from AlmaBetter played a massive role in getting a high-paying job. I can say whatever I have worked on during my job, I have already trained for it during my time at AlmaBetter, making my work and life easier.`,
  },
  {
    name: "Sharad Tawade",
    role: "System Engineer",
    text: `Hey everyone, my name is Sharad Tawade, and I am from Mumbai. I completed BE in Electrical from Mumbai University and an MBA-OPERATION from Welingkar Institute Of Management. I also hold a work experience of 4+ years in the automation and IoT field. Therefore, I wanted to learn more about the fascinating field of data science. Hence, I decided to enroll in AlmaBetter's Full Stack Data Science program and secured a job offer from Bombay Softwares within 37 weeks of the program's commencement. The unique feature of AlmaBetter's program is that it provides a risk-free learning environment. The Pay after-placement model is a blessing for every data science enthusiast. Moreover, the placement guarantee works as a cherry on top. I also liked the quality of the study materials and lectures provided by the AlmaBetter team. The placement drive is crucial and beneficial for young data science enthusiasts seeking a robust training program. AlmaBetter provides a dedicated career coach to every student, and mock interviews help boost students' confidence. I also enjoyed resume-building sessions and communication training with Utter. Several striking features made AlmaBetter's curriculum stand out from other institutes. For example, one-on-one mentorship sessions with industry experts helped us gain insights into the data science field. Also, working on real-world capstone projects with like-minded peers boosted my teamwork skills. AlmaBetter also provides daily learning reports with constructive feedback, which is extremely helpful. My previous experience is not related to data science, but I want to learn Data science, so I choose AlmaBetter. Their curriculum helped me learn and grow faster in data science. The projects will not only give you marks but also give you a little experience in working on a team project. The concept of learning for free, getting placed in a good company, and then paying them is impressive. Almabetter's Mentors are highly skilled and support you at every stage. My Advice to students is just to follow AlmaBetter's procedure and learn continuously; then, you will definitely get an excellent job in the data science domain.`,
  },
];

const BYTES_POSTS = [
  { title: "How to Install Matplotlib in Python with Detailed Steps", date: "20 Oct 2023" },
  { title: "List of Operating System: Top Operating System List for 2026", date: "06 Sept 2023" },
  { title: "Top 12 Advanced Features of MS Excel in 2026", date: "19 Sept 2023" },
  { title: "What are the Advantages and Disadvantages of MS Excel", date: "14 Dec 2023" },
  { title: "Exploring The Major Domains of AI (Artificial Intelligence)", date: "17 Oct 2023" },
  { title: "Top 15 Azure DevOps Interview Questions and Answers (2026)", date: "19 Apr 2024" },
  { title: "How to Uninstall Node JS in Ubuntu? (Step by Step Guide)", date: "17 Oct 2023" },
  { title: "Top Pay After Placement Courses in India", date: "22 Jun 2023" },
  { title: "Top HTML5 and HTML Interview Questions and Answers (2026)", date: "23 Apr 2024" },
  { title: "What is the Time Complexity of Merge Sort Algorithm?", date: "10 Jun 2024" },
];

const TUTORIALS = [
  { title: "Python Tutorial 2026 - Learn Python Online for Free", modules: 8, lessons: 37, learners: "114.2K" },
  { title: "ML in Action: Hands-On Guide to Deploying and Serving Models", modules: 4, lessons: 20, learners: "100.1K" },
  { title: "GATE Data Science and AI 2026", modules: 6, lessons: 26, learners: "21.6K" },
  { title: "React JS Tutorial 2026 - Learn React Online for Free", modules: 7, lessons: 25, learners: "17.3K" },
  { title: "SQL Tutorial 2026 - Learn SQL Online for Free", modules: 9, lessons: 40, learners: "16.4K" },
  { title: "Artificial Intelligence Tutorial 2026 - Learn AI for Free", modules: 3, lessons: 37, learners: "16.3K" },
  { title: "Node JS Tutorial 2026 - Learn Node JS Online for Free", modules: 7, lessons: 27, learners: "11.6K" },
  { title: "JavaScript Tutorial 2026 - Learn JavaScript Online for Free", modules: 8, lessons: 37, learners: "11.5K" },
  { title: "Docker Tutorial 2026 - Learn Docker Online for Free", modules: 2, lessons: 7, learners: "11.2K" },
  { title: "Data Science Tutorial for Beginners 2026", modules: 8, lessons: 31, learners: "9.8K" },
];

const RECOGNITION_ITEMS = [
  "AlmaBetter is Changing Indian Tech Education Landscape with Free Learning Initiatives",
  "Upskilling platform AlmaBetter raises $2.7 million to strengthen offerings for graduates and working professionals.",
  "AlmaBetter to allocate Rs 50 Cr to newly launched AlmaBetter Innovarsity",
];

const FAQ_GROUPS = ["Admissions", "Learning", "AlmaX Placement Assurance", "Placements"];

type FaqItem = {
  group: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    group: "Admissions",
    question: "Who can enrol in AlmaBetter's courses?",
    answer:
      "Our programs are ideal for working professionals and graduates. Master's Degrees are open to graduates, while Professional and Advanced Certifications are built for learners and professionals moving into high-growth AI and tech roles.",
  },
  {
    group: "Admissions",
    question: "Is there any selection test for enroling in AlmaBetter's courses?",
    answer:
      "No selection test is required to enrol. Our counsellors learn about your background on a free guidance call and help you pick the right program for your experience and goals.",
  },
  {
    group: "Learning",
    question: "What is a Cohort?",
    answer:
      "A Cohort is a fixed batch of learners who start together, attend live classes on a shared schedule, and progress through the same modules, projects and doubt-solving sessions as a group.",
  },
  {
    group: "AlmaX Placement Assurance",
    question: "Is it mandatory to opt for the AlmaX Career Track?",
    answer:
      "The AlmaX Career Track is how we prepare you for offers — mock interviews, resume building and hiring-partner referrals. You can learn without it, but placement support and job-assurance outcomes apply only with the Career Track.",
  },
  {
    group: "Placements",
    question: "What placement outcomes can I expect?",
    answer:
      "Outcomes range from 5-40 LPA depending on your program and background, with 6000+ careers transformed and 500+ industry-collaborated projects feeding into the hiring pipeline.",
  },
];

function BadgeIcon({ className }: { className?: string }) {
  return <CheckCircle2 className={className} aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PartnersSection />
      <AccreditationSection />
      <MilestonesSection />
      <OutcomesSection />
      <CoursesSection />
      <EbookSection />
      <DomainsSection />
      <HiredSection />
      <WorkshopSection />
      <HiringPartnersSection />
      <FoundersSection />
      <BackersSection />
      <WallOfLoveSection />
      <BytesSection />
      <TutorialsSection />
      <RecognitionSection />
      <GuidanceSection />
      <FaqSection />
      <BottomCtaSection />
    </div>
  );
}

function HeroSection() {
  const stats = [
    { value: "4.6/5", label: "Google Review", icon: Star },
    { value: "4.7/5", label: "Shiksha Review", icon: Star },
    { value: "24k+", label: "Skilled Learners", icon: Users },
  ];
  const [rot, setRot] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRot((value) => (value + 1) % HERO_ROTATOR.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Avatar / Brand image - front (left) */}
          <div className="shrink-0 order-1 hidden lg:block">
            <img
              src="/yuva/avtar-bgremoved.png"
              alt="AlmaBetter avatar"
              className="w-full max-w-[380px] h-auto"
            />
          </div>

          {/* Center content - text at mid */}
          <div className="flex-1 order-2 text-center lg:text-left space-y-6 lg:space-y-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              World Class Education. Engineered for Outcome
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Become the Talent{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Trusted to Build AI Systems
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl font-semibold text-secondary-foreground dark:text-secondary"
              aria-live="polite"
            >
              {HERO_ROTATOR[rot]}
            </p>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AlmaBetter secures your career across 50+ high-growth roles in AI &
              Tech, program built for the next decade
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg transition">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Talk to Career Expert
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base border-2 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Link href="/courses">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Discover All Courses
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t max-w-lg mx-auto lg:mx-0">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                    <stat.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const pillars = [
    { icon: Rocket, label: "Real World AI Projects" },
    { icon: Building2, label: "Partner with Top Institutes" },
    { icon: Award, label: "Education Powered by National Skill Frameworks & Global Universities" },
  ];

  return (
    <section className="py-14 lg:py-16 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="flex items-center justify-center gap-3 text-center">
              <pillar.icon className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold leading-snug">{pillar.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {PARTNER_CHIPS.map((partner) => (
            <span
              key={partner}
              className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccreditationSection() {
  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Education Powered by National Skill Frameworks & Global Universities
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Joint certifications, accredited degrees and standards-verified
          curriculum — built with IIT Patna, NASSCOM, NSDC and European HEA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {ACCREDITATIONS.map((item) => (
          <Card key={item.title} className="border-0 shadow-md hover:shadow-lg transition duration-fast hover:-translate-y-1">
            <CardContent className="p-6 space-y-3">
              <item.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="font-bold text-lg leading-snug">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="text-lg font-bold">Co-Designed with Professionals</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CO_DESIGNED_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

function MilestonesSection() {
  const milestones = [
    { icon: Briefcase, value: "500+", label: "Industry Collaborated Projects" },
    { icon: InfinityIcon, value: "Unlimited", label: "Counselling Sessions" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
            Learning Milestones
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Strong. Build Real Skills.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {milestones.map((item) => (
            <Card key={item.label} className="border-0 shadow-md text-center">
              <CardContent className="p-8 space-y-3">
                <item.icon className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
                <div className="text-3xl font-bold text-primary">{item.value}</div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutcomesSection() {
  const milestones = [
    { icon: Users, value: "35,000+", label: "Experts & Learners Community" },
    { icon: GraduationCap, value: "6000+", label: "Happy Placed Students" },
  ];

  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          From Learning to Landing Jobs
        </h2>
        <div className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 shadow-sm">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-hidden="true" />
          <span className="text-xl font-bold">4.9/5</span>
          <span className="text-sm text-muted-foreground">Learning Experience</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
          Career Milestones
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          Showcase Your Brilliance. Get Noticed.
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {milestones.map((item) => (
          <Card key={item.label} className="border-0 shadow-md text-center">
            <CardContent className="p-8 space-y-3">
              <item.icon className="h-8 w-8 text-primary mx-auto" aria-hidden="true" />
              <div className="text-3xl font-bold text-primary">{item.value}</div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: CourseEntry }) {
  return (
    <Card className="h-full flex flex-col border-0 shadow-md hover:shadow-lg transition duration-fast hover:-translate-y-1">
      <CardContent className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{course.typeLabel}</Badge>
          {course.partners.map((partner) => (
            <Badge key={partner} variant="outline">
              {partner}
            </Badge>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-bold leading-snug">{course.title}</h3>
          {course.highlight && (
            <p className="text-xs font-medium text-primary mt-1">{course.highlight}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Job Assurance
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            For Graduates
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <Video className="h-3.5 w-3.5" aria-hidden="true" />
            Online Live Classes
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1 border-t border-border/60">
          <Calendar className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <span>
            Batch starts on : <span className="font-semibold text-foreground">{course.batch}</span>
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            {course.duration}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition">
            <Link href="/courses">
              Explore Course
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CoursesSection() {
  return (
    <section id="courses" className="py-16 lg:py-20 scroll-mt-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl font-bold">Explore Our Courses</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast forward your career with our high impact, hands on and intensive
            courses.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="degree">Master&apos;s Degree</TabsTrigger>
              <TabsTrigger value="professional">Professional Certifications</TabsTrigger>
            </TabsList>
          </div>

          {(["all", "degree", "professional"] as const).map((value) => (
            <TabsContent key={value} value={value}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HOME_COURSES.filter(
                  (course) => value === "all" || course.group === value
                ).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/30">
            <Link href="/courses">
              Discover All Courses
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function EbookSection() {
  const stats = [
    { value: "50K+", label: "Downloads", icon: Download },
    { value: "4.9/5", label: "Rating", icon: Star },
    { value: "30+", label: "Hours Content", icon: Clock },
  ];

  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1 space-y-4">
              <Badge className="bg-primary text-primary-foreground">Free</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Master AI for a Future-Ready Career
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Unlock the &ldquo;Ultimate GenAI Handbook&rdquo; and kickstart
                your AI learning today for FREE!
              </p>
              <div className="flex flex-wrap gap-6 pt-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button asChild size="lg" className="w-full lg:w-auto shrink-0 bg-gradient-to-r from-primary to-primary/80">
              <Link href="/contact">
                <Download className="mr-2 h-5 w-5" />
                Unlock Free AI Ebook
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function DomainsSection() {
  return (
    <section className="py-10 lg:py-12 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3">
          {DOMAINS.map((domain) => (
            <span
              key={domain.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium shadow-sm"
            >
              <domain.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {domain.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-fast " +
            "hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 " +
            (value === option
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground")
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function HiredSection() {
  const [domain, setDomain] = useState("All");
  const [background, setBackground] = useState("All");

  const domains = ["All", "Data Science", "Engineer", "AI Engineer", "Web Development"];
  const backgrounds = ["All", "Tech", "Non Tech"];

  const filtered = PLACEMENTS.filter(
    (story) =>
      (domain === "All" || story.domain === domain) &&
      (background === "All" || story.background === background)
  );

  return (
    <section id="hired" className="py-16 lg:py-20 container mx-auto px-4 scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">See Who Got Hired</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dreamers, hustlers, and go-getters, our students come from all walks of
          life.
        </p>
      </div>

      <div className="space-y-4 mb-10 max-w-4xl mx-auto">
        <FilterChips
          label="By Experience"
          options={["All", "Working Professional"]}
          value={"Working Professional"}
          onChange={() => undefined}
        />
        <FilterChips label="By Domain" options={domains} value={domain} onChange={setDomain} />
        <FilterChips
          label="By Background"
          options={backgrounds}
          value={background}
          onChange={setBackground}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="border-0 shadow-md max-w-2xl mx-auto">
          <CardContent className="p-10 text-center space-y-3">
            <Users className="h-8 w-8 text-muted-foreground mx-auto" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              No stories match these filters yet. Try a different combination.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDomain("All");
                setBackground("All");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story) => (
            <Card key={story.name} className="border-0 shadow-md hover:shadow-lg transition duration-fast hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {story.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold leading-tight">{story.name}</p>
                    <p className="text-sm text-muted-foreground">{story.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">{story.domain}</Badge>
                  <Badge variant="outline">{story.background}</Badge>
                  <Badge variant="secondary">{story.experience}</Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {story.quote}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground">Placed at:</span>
                  <span className="font-semibold">{story.placedAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-0 shadow-md mt-10">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">
              Explore more placement stories
            </h3>
            <p className="text-sm text-muted-foreground">
              Download our placement report to see hired students and their
              experiences.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/#wall">
                View Stories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
              <Link href="/contact">
                <Download className="mr-2 h-4 w-4" />
                Placement Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function WorkshopSection() {
  return (
    <section id="workshop" className="py-16 lg:py-20 scroll-mt-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
            Upcoming Expert-Led Workshop
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Discover Your Career Path, Join a Free Workshop by Professionals.
          </h2>
        </div>

        <Card className="border-0 shadow-md max-w-3xl mx-auto">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Video className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug">
                  Practical Implementation of Jev: Why it&apos;s the Future of AI.
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                    24th Oct 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                    2:00 PM
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    2.8K+ Learners Registered
                  </span>
                </div>
              </div>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80">
              <Link href="/contact">
                Register Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function HiringPartnersSection() {
  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          We&apos;ve Trusted Companies as Our Hiring Partners
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {HIRING_PARTNERS.map((partner) => (
          <span
            key={partner}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
            {partner}
          </span>
        ))}
      </div>
    </section>
  );
}

function FoundersSection() {
  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Founders</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Driven by purpose. Focused on outcomes. Building for learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {FOUNDERS.map((founder) => (
            <Card key={founder.name} className="border-0 shadow-md text-center">
              <CardContent className="p-8 space-y-3">
                <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                  {founder.name
                    .split(" ")
                    .map((part) => part.charAt(0))
                    .join("")}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{founder.name}</h3>
                  <p className="text-sm text-primary font-medium">{founder.role}</p>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &ldquo;{founder.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold">{founder.tagline}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BackersSection() {
  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Backed by Leading Tech Entrepreneurs
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Guided by visionaries shaping tomorrow&apos;s tech
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {BACKERS.map((backer) => (
          <Card key={backer.name} className="border-0 shadow-md text-center">
            <CardContent className="p-6 space-y-3">
              <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-secondary/15 text-secondary-foreground dark:text-secondary font-bold">
                {backer.name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")}
              </span>
              <div>
                <p className="font-bold text-sm leading-tight">{backer.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{backer.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function WallStoryCard({ story }: { story: LongStory }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {story.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">{story.name}</p>
            <p className="text-xs text-muted-foreground">{story.role}</p>
          </div>
          <Quote className="h-5 w-5 ml-auto text-primary/40 shrink-0" aria-hidden="true" />
        </div>
        <p
          className={
            "text-sm text-muted-foreground leading-relaxed " +
            (open ? "" : "line-clamp-5")
          }
        >
          {story.text}
        </p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          {open ? "Show less" : "Read more"}
        </button>
      </CardContent>
    </Card>
  );
}

function WallOfLoveSection() {
  return (
    <section id="wall" className="py-16 lg:py-20 scroll-mt-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Wall Of Love</h2>
        </div>

        <Card className="border-0 shadow-md max-w-3xl mx-auto mb-10">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-1" aria-label="5 stars rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
              ))}
              <span className="ml-2 text-xs text-muted-foreground">5 stars rating</span>
            </div>
            <p className="text-base leading-relaxed italic">&ldquo;{WALL_INTRO_QUOTE}&rdquo;</p>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                K
              </span>
              <div>
                <p className="font-bold text-sm">Kamya Malhotra</p>
                <p className="text-xs text-muted-foreground">Statistical Analyst</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WALL_STORIES.map((story) => (
            <WallStoryCard key={story.name} story={story} />
          ))}
        </div>

        <Card className="border-0 shadow-md mt-10">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">
                Explore more Success stories
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore the success stories of our hired students and learn from
                their experiences.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/#hired">
                  View More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild>
                <Link href="/contact">
                  <Download className="mr-2 h-4 w-4" />
                  Placement Report
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function BytesSection() {
  return (
    <section id="bytes" className="py-16 lg:py-20 container mx-auto px-4 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl font-bold">AlmaBetterBytes</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {BYTES_POSTS.map((post) => (
          <Card key={post.title} className="border-0 shadow-md hover:shadow-lg transition duration-fast">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {post.date}
              </p>
              <p className="text-sm font-medium leading-snug">{post.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TutorialsSection() {
  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PlayCircle className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl font-bold">AlmaBetterTutorials</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TUTORIALS.map((tutorial) => (
            <Card key={tutorial.title} className="border-0 shadow-md hover:shadow-lg transition duration-fast">
              <CardContent className="p-4 space-y-2">
                <Badge variant="secondary" className="text-xs">Data Science</Badge>
                <p className="text-sm font-medium leading-snug">{tutorial.title}</p>
                <p className="text-xs text-muted-foreground">
                  {tutorial.modules} Modules · {tutorial.lessons} Lessons
                </p>
                <p className="text-xs font-semibold text-primary">
                  {tutorial.learners} Learners
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecognitionSection() {
  return (
    <section className="py-16 lg:py-20 container mx-auto px-4">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl font-bold">Awards &amp; Recognition</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Recognized as Leaders in Tech Education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {RECOGNITION_ITEMS.map((item) => (
          <Card key={item} className="border-0 shadow-md hover:shadow-lg transition duration-fast hover:-translate-y-1">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" aria-hidden="true" />
                <Badge variant="outline">5min</Badge>
              </div>
              <p className="text-sm font-medium leading-snug">{item}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function GuidanceSection() {
  const points = [
    "Expert Career Guidance",
    "20+ Free Workshops",
    "100+ Hours of Free Tutorial",
  ];
  const trust = [
    "Trusted by 1 Lakh+ Learners",
    "24/7 Expert available",
    "Trusted Member 5.0 Rating",
    "Trusted Mentors",
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-8 sm:p-12 text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                India&apos;s most trusted career platform
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Get Personalised Guidance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get real clarity on courses, careers, and what actually fits you
            </p>

            <ul className="flex flex-wrap justify-center gap-4">
              {points.map((point) => (
                <li
                  key={point}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              <Link href="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Talk To Expert Counsellor
              </Link>
            </Button>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 border-t border-border/60">
              {trust.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="py-16 lg:py-20 container mx-auto px-4 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
        </div>
        <p className="text-lg text-muted-foreground">Got Questions? We&apos;ve Got Answers</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue={FAQ_GROUPS[0]}>
          <div className="flex justify-center mb-6">
            <TabsList className="h-auto flex-wrap justify-center">
              {FAQ_GROUPS.map((group) => (
                <TabsTrigger key={group} value={group} className="py-2">
                  {group}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {FAQ_GROUPS.map((group) => {
            const items = FAQS.filter((faq) => faq.group === group);
            return (
              <TabsContent key={group} value={group}>
                {items.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No questions in this category yet.
                  </p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((faq) => (
                      <AccordionItem key={faq.question} value={faq.question}>
                        <AccordionTrigger className="text-left text-base">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <Phone className="mr-2 h-4 w-4" />
              Request call Back
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function BottomCtaSection() {
  return (
    <section className="py-16 lg:py-20 bg-muted/40 dark:bg-muted/10">
      <div className="container mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">Need Help? Get Career Guidance</h2>
        <p className="text-lg text-muted-foreground">
          Call Us at{" "}
          <a
            href="tel:+918046008400"
            className="rounded-md font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            08046008400
          </a>
        </p>
        <p className="text-sm text-muted-foreground">or</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <Link href="/auth/signin">
              <Sparkles className="mr-2 h-5 w-5" />
              Register For Free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <Mail className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
