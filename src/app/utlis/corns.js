import corn from "node-cron";
import { AttendenceUtils } from "../modules/attendence/attendence.utils.js";

export function cornjbos() {
  corn.schedule(
    "*/1 * * * *",
    async () => {
      try {
        await AttendenceUtils.createAttendenceThread();
      } catch (error) {
        console.error("Attendance thread failed:", error);
      }
    },
    {
      schedule: true,
      timezone: "Asia/Dhaka",
    }
  );
}
