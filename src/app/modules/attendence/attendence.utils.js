import { ThreadAutoArchiveDuration } from "discord.js";
import discordClient from "../../utlis/discordClient.js";
import config from "../../config/index.js";

async function createAttendenceThread() {
  try {
    const channel = await discordClient.channels.fetch(
      config.attendence_channel_id
    );
    if (!channel) throw new Error("Channel could not be fetched");

    const today = new Date();
    const threadName = `Attendance - ${today.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })}`;
    const thread = await channel.threads.create({
      name: threadName,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      reason: "Daily attendance tracking",
    });

    await thread.send({
      content: `📅 **Daily Attendance**\nReact with ✅ to check in!\n@here`,
      allowedMentions: { parse: ["here"] },
    });

    console.log(`Created attendance thread: ${thread.name}`);
    return thread;
  } catch (error) {
    console.log(error);
  }
}

export const AttendenceUtils = {
  createAttendenceThread,
};
