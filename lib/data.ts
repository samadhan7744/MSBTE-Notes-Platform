export type Subject = {
  id: string;
  title: string;
  code: string;
  semester: number;
  price: number;
  isFree: boolean;
  downloads: number;
  progress: number;
  notesCount: number;
  pages: number;
  rating: number;
  description: string;
  pdf: string;
};

export const semesters = [1, 2, 3, 4, 5, 6];

export const subjects: Subject[] = [
  {
    id: "basic-mathematics",
    title: "Basic Mathematics",
    code: "22103",
    semester: 1,
    price: 0,
    isFree: true,
    downloads: 2840,
    progress: 92,
    notesCount: 18,
    pages: 164,
    rating: 4.8,
    description: "Formula sheets, solved examples, unit-wise notes, and previous MSBTE exam patterns.",
    pdf: "/sample-pdfs/basic-mathematics.pdf",
  },
  {
    id: "programming-in-c",
    title: "Programming in C",
    code: "22226",
    semester: 2,
    price: 149,
    isFree: false,
    downloads: 1960,
    progress: 78,
    notesCount: 22,
    pages: 210,
    rating: 4.7,
    description: "Concept notes, dry runs, practical programs, viva questions, and solved lab assignments.",
    pdf: "/sample-pdfs/programming-in-c.pdf",
  },
  {
    id: "computer-graphics",
    title: "Computer Graphics",
    code: "22318",
    semester: 3,
    price: 99,
    isFree: false,
    downloads: 1320,
    progress: 66,
    notesCount: 14,
    pages: 132,
    rating: 4.5,
    description: "Algorithms, diagrams, transformation notes, and quick revision cards for semester exams.",
    pdf: "/sample-pdfs/computer-graphics.pdf",
  },
  {
    id: "data-structure",
    title: "Data Structure",
    code: "22317",
    semester: 3,
    price: 0,
    isFree: true,
    downloads: 3190,
    progress: 84,
    notesCount: 24,
    pages: 238,
    rating: 4.9,
    description: "Stacks, queues, trees, sorting, searching, and practice problems with answer keys.",
    pdf: "/sample-pdfs/data-structure.pdf",
  },
  {
    id: "database-management",
    title: "Database Management",
    code: "22412",
    semester: 4,
    price: 129,
    isFree: false,
    downloads: 1750,
    progress: 73,
    notesCount: 20,
    pages: 188,
    rating: 4.6,
    description: "ER models, SQL commands, normalization, transactions, and unit-wise important questions.",
    pdf: "/sample-pdfs/database-management.pdf",
  },
  {
    id: "java-programming",
    title: "Java Programming",
    code: "22413",
    semester: 4,
    price: 149,
    isFree: false,
    downloads: 2250,
    progress: 81,
    notesCount: 26,
    pages: 244,
    rating: 4.8,
    description: "OOP concepts, exception handling, applets, collections, JDBC, and model answers.",
    pdf: "/sample-pdfs/java-programming.pdf",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    code: "22518",
    semester: 5,
    price: 0,
    isFree: true,
    downloads: 1440,
    progress: 58,
    notesCount: 16,
    pages: 118,
    rating: 4.4,
    description: "SDLC models, requirement analysis, testing methods, project planning, and revision charts.",
    pdf: "/sample-pdfs/software-engineering.pdf",
  },
  {
    id: "operating-system",
    title: "Operating System",
    code: "22516",
    semester: 5,
    price: 119,
    isFree: false,
    downloads: 2510,
    progress: 69,
    notesCount: 21,
    pages: 198,
    rating: 4.7,
    description: "Processes, scheduling, memory management, deadlocks, file systems, and solved numericals.",
    pdf: "/sample-pdfs/operating-system.pdf",
  },
  {
    id: "web-development",
    title: "Web Development",
    code: "22619",
    semester: 6,
    price: 159,
    isFree: false,
    downloads: 3020,
    progress: 87,
    notesCount: 28,
    pages: 260,
    rating: 4.9,
    description: "HTML, CSS, JavaScript, PHP basics, responsive layouts, and mini-project guidance.",
    pdf: "/sample-pdfs/web-development.pdf",
  },
  {
    id: "mobile-application-development",
    title: "Mobile Application Development",
    code: "22617",
    semester: 6,
    price: 179,
    isFree: false,
    downloads: 1180,
    progress: 61,
    notesCount: 17,
    pages: 150,
    rating: 4.5,
    description: "Android fundamentals, UI components, SQLite, intents, lifecycle, and practical snippets.",
    pdf: "/sample-pdfs/mobile-application-development.pdf",
  },
];

export const dashboardStats = [
  { label: "Purchased Notes", value: "7", helper: "4 updated this week" },
  { label: "Downloads", value: "38", helper: "Across 6 semesters" },
  { label: "Completion", value: "74%", helper: "Average study progress" },
  { label: "Saved Time", value: "42h", helper: "With ready notes" },
];

export function getSubject(id: string) {
  return subjects.find((subject) => subject.id === id);
}
