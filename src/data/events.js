import cyberImage from "../images/cyber.png";
import researchImage from "../images/research.png";
import bootcampImage from "../images/Bootcamp.png";
import cultureImage from "../images/culture.png";
import robotics from "../images/robotics.png";

const events = [
  {
    /*
    id: 1,
    title: "AI Workshop",
    description: "Introduction to Artificial Intelligence",
    date: "2026-04-10",
    location: "KU Shadadiya Campus",
    visibility: "ku-only",
    category: "Workshop",
    seats: 50,*/
  },
  {
    id: 2,
    title: "Cybersecurity Seminar",
    description: "Learn the basics of digital security",
    date: "2026-04-15",
    location: "KU Khaldiya Campus",
    visibility: "public",
    category: "Seminar",
    image: cyberImage,
    seats: 120,
  },
  {
    id: 3,
    title: "Research Expo",
    description: "Student projects and research presentations",
    date: "2026-04-20",
    location: "College of Science",
    visibility: "public",
    category: "Research",
    image: researchImage,
    seats: 200,
  },
  {
    id: 4,
    title: "Advanced Robotics",
    description: "A KU-only lab tour and demo",
    date: "2026-04-25",
    location: "College of Engineering",
    visibility: "ku-only",
    category: "Academic",
    seats: 35,
    image: robotics,
  },
  {
    id: 5,
    title: "Entrepreneurship Bootcamp",
    description: "Build your startup skills with mentors and workshops",
    date: "2026-05-05",
    location: "Business Innovation Hub",
    visibility: "ku-only",
    category: "Workshop",
    image: bootcampImage,
    seats: 80,
  },
  {
    id: 6,
    title: "Cultural Day",
    description: "Celebrate university diversity with performances and exhibitions",
    date: "2026-05-12",
    location: "KU Main Auditorium",
    visibility: "public",
    category: "Seminar",
    image: cultureImage,
    seats: 500,
  },
];

export default events;