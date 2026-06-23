const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const subjects = [
  "Data Structures",
  "DBMS",
  "Java Programming",
  "Operating System",
  "Computer Networks",
  "Software Engineering",
  "Web Development",
  "Mobile Application Development",
  "Computer Graphics",
  "Programming in C",
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const adminHash = await bcrypt.hash("Admin@12345", 12);
  const studentHash = await bcrypt.hash("Student@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@msbtenotes.local" },
    update: {},
    create: {
      name: "MSBTE Admin",
      email: "admin@msbtenotes.local",
      mobile: "9000000000",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "student@msbtenotes.local" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@msbtenotes.local",
      mobile: "9111111111",
      passwordHash: studentHash,
      role: UserRole.STUDENT,
    },
  });

  const branch = await prisma.branch.upsert({
    where: { slug: "computer-engineering" },
    update: {},
    create: { name: "Computer Engineering", slug: "computer-engineering" },
  });

  const semesters = [];
  for (let number = 1; number <= 6; number += 1) {
    const semester = await prisma.semester.upsert({
      where: { branchId_number: { branchId: branch.id, number } },
      update: {},
      create: {
        branchId: branch.id,
        name: `Semester ${number}`,
        number,
      },
    });
    semesters.push(semester);
  }

  for (const [index, subjectName] of subjects.entries()) {
    const semester = semesters[index % semesters.length];
    const isFree = index % 4 === 0;
    const subject = await prisma.subject.upsert({
      where: { slug: slugify(subjectName) },
      update: {},
      create: {
        semesterId: semester.id,
        name: subjectName,
        slug: slugify(subjectName),
        description: `${subjectName} notes with full book, chapter-wise concepts, exam questions, and MSBTE-focused revision points.`,
        price: isFree ? 0 : 14900,
        isFree,
        thumbnailUrl: `/thumbnails/${slugify(subjectName)}.jpg`,
      },
    });

    await prisma.fullBook.create({
      data: {
        subjectId: subject.id,
        title: `${subjectName} Full Book`,
        description: `Complete PDF book for ${subjectName}.`,
        pdfFileKey: `seed/${slugify(subjectName)}/full-book.pdf`,
        previewPdfKey: `seed/${slugify(subjectName)}/preview.pdf`,
        price: isFree ? 0 : 14900,
        isFree,
      },
    }).catch(() => null);

    for (let chapterOrder = 1; chapterOrder <= 3; chapterOrder += 1) {
      const chapter = await prisma.chapter.upsert({
        where: { subjectId_order: { subjectId: subject.id, order: chapterOrder } },
        update: {},
        create: {
          subjectId: subject.id,
          title: `${subjectName} Chapter ${chapterOrder}`,
          order: chapterOrder,
        },
      });

      for (let conceptOrder = 1; conceptOrder <= 3; conceptOrder += 1) {
        await prisma.concept.upsert({
          where: { chapterId_order: { chapterId: chapter.id, order: conceptOrder } },
          update: {},
          create: {
            chapterId: chapter.id,
            title: `Concept ${conceptOrder}`,
            description: `Important ${subjectName} concept ${conceptOrder} with concise explanation and PDF notes.`,
            pdfFileKey: `seed/${slugify(subjectName)}/chapter-${chapterOrder}/concept-${conceptOrder}.pdf`,
            videoUrl: `https://example.com/videos/${slugify(subjectName)}-${chapterOrder}-${conceptOrder}`,
            isFree: conceptOrder === 1,
            order: conceptOrder,
          },
        });
      }
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
