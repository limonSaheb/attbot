import prisma from "../utlis/prisma.js";

async function createAttendenceThread(payload) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const checkThread = await prisma.attendenceThread.findFirst({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });
    if (checkThread) {
      console.log("Todays Thread already created!");
      return false;
    } else {
      const createThread = await prisma.attendenceThread.create({
        data: {
          msg: "new attendence",
        },
      });
    }
    return true;
  } catch (error) {
    console.log("There was an error!", error?.message);
    return false;
  }
}

async function recordAttendence(payload) {
  try {
    const { user, mood, goal } = payload;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const getThread = await prisma.attendenceThread.findFirst({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    if (!getThread) {
      console.log("no attendence thread found!");
      return false;
    }

    const isAlreadyCheckedIn = await prisma.attendenceReply.findFirst({
      where: {
        AttendenceThreadId: getThread?.id,
        userName: user,
      },
    });

    if (isAlreadyCheckedIn) {
      console.log("already checkedIn");
      return false;
    }

    const recordCheckIn = await prisma.attendenceReply.create({
      data: {
        AttendenceThreadId: getThread.id,
        userName: user,
        mood,
        goal,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function recordWorkUpdates(payload) {
  const { updates, user } = payload;
  const checkOutTime = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const getThread = await prisma.attendenceThread.findFirst({
    where: {
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  const isCheckedOut = await prisma.attendenceReply.findFirst({
    where: {
      AttendenceThreadId: getThread?.id,
      userName: user,
    },
  });

  if (isCheckedOut && isCheckedOut?.checkOutTime) {
    const updateWorkUpdate = await prisma.attendenceReply.update({
      where: {
        id: isCheckedOut?.id,
      },
      data: {
        workUpdate: updates,
      },
    });
  } else if (isCheckedOut && !isCheckedOut?.checkOutTime) {
    const recordWorkUpdate = await prisma.attendenceReply.update({
      where: {
        id: isCheckedOut?.id,
      },
      data: {
        workUpdate: updates,
        checkOutTime: new Date(),
      },
    });
  }
  return true;
}

async function recordEarlyLeave(payload) {
  const { user, reason } = payload;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const getThread = await prisma.attendenceThread.findFirst({
    where: {
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  if (!getThread) return false;

  const checkForUpdateThread = await prisma.attendenceReply.findFirst({
    where: {
      AttendenceThreadId: getThread?.id,
      workUpdate: {
        not: null,
      },
    },
  });

  if (checkForUpdateThread) return false;

  const checkForAttendence = await prisma.attendenceReply.findFirst({
    where: {
      AttendenceThreadId: getThread?.id,
      userName: user,
    },
  });

  if (!checkForAttendence) return false;

  const earlyLeave = await prisma.attendenceReply.update({
    where: {
      id: checkForAttendence?.id,
    },
    data: {
      earlyLeaveRequest: user,
      earlyLeaveReason: reason,
    },
  });

  return true;
}

export const AttendenceService = {
  createAttendenceThread,
  recordAttendence,
  recordWorkUpdates,
  recordEarlyLeave,
};
