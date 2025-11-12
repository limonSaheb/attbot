export const findCourseByAnyHierarchyId = async (id, prisma) => {
  const fromClassContent = await prisma.classContent.findFirst({
    where: { id },
    select: {
      courseSubjectChapter: {
        select: {
          courseSubject: {
            select: {
              course: { select: { id: true, title: true } },
            },
          },
        },
      },
    },
  });

  if (fromClassContent?.courseSubjectChapter?.courseSubject?.course) {
    return fromClassContent.courseSubjectChapter.courseSubject.course;
  }

  const fromcourseSubjectChapter = await prisma.courseSubjectChapter.findFirst({
    where: { id },
    select: {
      courseSubject: {
        select: {
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (fromcourseSubjectChapter?.courseSubject?.course) {
    return fromcourseSubjectChapter.courseSubject.course;
  }

  const fromcourseSubject = await prisma.courseSubject.findFirst({
    where: { id },
    select: {
      course: { select: { id: true, title: true } },
    },
  });

  if (fromcourseSubject?.course) {
    return fromcourseSubject.course;
  }

  const fromClassCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (fromClassCourse) {
    return fromClassCourse;
  }

  // 🔹 Try from cycle hierarchy
  const fromCycleContent = await prisma.cycleContent.findFirst({
    where: { id },
    select: {
      cycleSubjectChapter: {
        select: {
          cycleSubject: {
            select: {
              cycle: {
                select: {
                  course: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (fromCycleContent?.cycleSubjectChapter?.cycleSubject?.cycle?.course) {
    return fromCycleContent.cycleSubjectChapter.cycleSubject.cycle.course;
  }

  const fromCycleSubjectChapter = await prisma.cycleSubjectChapter.findFirst({
    where: { id },
    select: {
      cycleSubject: {
        select: {
          cycle: {
            select: {
              course: { select: { id: true, title: true } },
            },
          },
        },
      },
    },
  });

  if (fromCycleSubjectChapter?.cycleSubject?.cycle?.course) {
    return fromCycleSubjectChapter.cycleSubject.cycle.course;
  }

  const fromCycleSubject = await prisma.cycleSubject.findFirst({
    where: { id },
    select: {
      cycle: {
        select: {
          course: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (fromCycleSubject?.cycle?.course) {
    return fromCycleSubject.cycle.course;
  }

  const fromCycle = await prisma.cycle.findFirst({
    where: { id },
    select: {
      course: { select: { id: true, title: true } },
    },
  });

  if (fromCycle?.course) {
    return fromCycle.course;
  }

  //try notice and featured
  const fromFeatured = await prisma.featured.findFirst({
    where: { id },
    select: {
      course: { select: { id: true, title: true } },
    },
  });

  if (fromFeatured?.course) {
    return fromFeatured.course;
  }

  const fromNoticeOrRoutine = await prisma.noticeORroutine.findFirst({
    where: { id },
    select: {
      course: { select: { id: true, title: true } },
    },
  });

  if (fromNoticeOrRoutine?.course) {
    return fromNoticeOrRoutine.course;
  }

  // 🔹 Try course directly again (fallback)
  const fromCycleCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (fromCycleCourse) {
    return fromCycleCourse;
  }

  return null;
};
