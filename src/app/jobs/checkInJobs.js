import cron from "node-cron";
import discordClient from "../utlis/discordClient.js";
import config from "../config/index.js";
import { AttendenceService } from "../services/attendecne.service.js";
import { attendenceView } from "../views/attendence.view.js";

export const startDailyCheckIn = () => {
  cron.schedule(
    "1 9 * * 1-6",
    async () => {
      try {
        const channel = await discordClient.channels.fetch(
          config.attendence_channel_id
        );
        if (!channel) return console.error("Check-in channel not found");

        const customMoods = [
          {
            label: "Great 🤓",
            value: "great",
          },
          {
            label: "Good 😌",
            value: "good",
          },
          {
            label: "Sick 🤕",
            value: "sick",
          },
          {
            label: "Stress 🫨",
            value: "stress",
          },
        ];

        const attendenceId = "asg-owl";
        const placeholder = "Select Any...";

        const view = attendenceView(attendenceId, placeholder, customMoods);

        const createThreadInDb =
          await AttendenceService.createAttendenceThread();

        if (createThreadInDb) {
          await channel.send({
            content: "@everyone Good morning! How are you feeling today?",
            components: [view],
            allowedMentions: { parse: ["everyone"] },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    {
      timezone: "Asia/Dhaka",
    }
  );
};
