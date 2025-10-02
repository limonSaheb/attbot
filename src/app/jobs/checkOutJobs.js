import cron from "node-cron";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import discordClient from "../utlis/discordClient.js";
import config from "../config/index.js";
import { AttendenceService } from "../services/attendecne.service.js";

export const startDailyCheckOut = () => {
  cron.schedule(
    "1 18 * * *",
    async () => {
      try {
        const channel = await discordClient.channels.fetch(
          config.update_channel_id
        );

        if (!channel) return console.error("Check-out channel not found!");

        const button = new ButtonBuilder()
          .setCustomId("checkOutButton")
          .setLabel("Give Updates")
          .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);
        const createUpdateThread =
          await AttendenceService.createWorkUpdateThread();

        if (createUpdateThread) {
          await channel.send({
            content: "@everyone 🙌 Great work. It's time to give updates ✍️.",
            components: [row],
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
