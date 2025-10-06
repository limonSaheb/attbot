import { isDateToday } from "../utlis/commonUtils.js";
import { getDhakaStartEnd } from "../utlis/dateUtils.js";
import prisma from "../utlis/prisma.js";

function getStart() {
  return getDhakaStartEnd().start;
}
function getEnd() {
  return getDhakaStartEnd().end;
}

async function createAttendenceThread() {
  const start = getStart();
  console.log(start, "creating att theread");
  const end = getEnd();
  try {
    const existingThread = await prisma.attendenceThread.findFirst({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingThread) {
      console.log("Todays attendence thread is already created.");
      return false;
    } else {
      const createThread = await prisma.attendenceThread.create({ data: {} });
    }
    return true;
  } catch (error) {
    console.log("There was an error!", error?.message);
    return false;
  }
}

async function recordAttendence(payload) {
  const start = getStart();
  const end = getEnd();
  try {
    const { user, mood } = payload;

    const existingThread = await prisma.attendenceThread.findFirst({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!existingThread) {
      console.log("No attendence thread found!");
      return false;
    }

    const isAlreadyCheckedIn = await prisma.attendenceReply.findFirst({
      where: {
        attendenceThreadId: existingThread?.id,
        userName: user,
      },
    });

    if (isAlreadyCheckedIn) {
      console.log("Already checked-in");
      return false;
    }

    const recordCheckIn = await prisma.attendenceReply.create({
      data: {
        attendenceThreadId: existingThread?.id,
        userName: user,
        mood: mood,
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createWorkUpdateThread() {
  const start = getStart();
  const end = getEnd();
  console.log(getStart(), "update create thread");
  try {
    const existingThread = await prisma.updateThread.findFirst({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingThread) {
      console.log("Todays update thread is already created.");
      return false;
    } else {
      const createThread = await prisma.updateThread.create({ data: {} });
    }
    return true;
  } catch (error) {
    console.log("There was an error!", error?.message);
    return false;
  }
}

async function earlyLeaveWorkUpdate(params = {}) {
  const { user, reason } = params;
  const start = getStart();
  const end = getEnd();
  console.log(getStart(), "update create thread");
  try {
    const existingThread = await prisma.updateThread.findFirst({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingThread) {
      console.log("Todays update thread is already created.");
      return false;
    } else {
      const createThread = await prisma.updateThread.create({
        data: {
          earlyLeave: true,
          reason: reason,
          userName: user,
        },
      });
    }
    return true;
  } catch (error) {
    console.log("There was an error!", error?.message);
    return false;
  }
}

async function recordWorkUpdates(payload) {
  const start = getStart();
  const end = getEnd();
  const { updates, user } = payload;

  const existingThread = await prisma.updateThread.findFirst({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!existingThread) return false;

  const isCheckedOut = await prisma.updateReply.findFirst({
    where: {
      updateThreadId: existingThread?.id,
      userName: user,
    },
  });

  if (isCheckedOut) {
    return false;
  } else {
    const recordWorkUpdate = await prisma.updateReply.create({
      data: {
        workUpdate: updates,
        updateThreadId: existingThread?.id,
        userName: user,
      },
    });
  }
  return true;
}

async function recordEarlyLeave(payload) {
  const start = getStart();
  const end = getEnd();
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
      attendenceThreadId: getThread?.id,
      workUpdate: {
        not: null,
      },
    },
  });

  if (checkForUpdateThread) return false;

  const checkForAttendence = await prisma.attendenceReply.findFirst({
    where: {
      attendenceThreadId: getThread?.id,
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
  createWorkUpdateThread,
  earlyLeaveWorkUpdate,
  recordWorkUpdates,
  recordEarlyLeave,
};
