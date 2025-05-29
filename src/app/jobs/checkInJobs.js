import cron from "node-cron";
import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import discordClient from "../utlis/discordClient.js";
import config from "../config/index.js";
import { AttendenceService } from "../services/attendecne.service.js";

export const startDailyCheckIn = () => {
  cron.schedule(
    "47 12 * * *",
    async () => {
      const channel = await discordClient.channels.fetch(
        config.attendence_channel_id
      );
      if (!channel) return console.error("Check-in channel not found");

      const select = new StringSelectMenuBuilder()
        .setCustomId("dailyMoodSelect")
        .setPlaceholder("How are you feeling?")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("😥 Stressed")
            .setValue("stressed"),
          new StringSelectMenuOptionBuilder()
            .setLabel("🤒 Weak")
            .setValue("weak"),
          new StringSelectMenuOptionBuilder()
            .setLabel("😀 Good")
            .setValue("good"),
          new StringSelectMenuOptionBuilder()
            .setLabel("😎 Alhamdulillah")
            .setValue("alhamdulillah")
        );

      const row = new ActionRowBuilder().addComponents(select);

      const check = await AttendenceService.createAttendenceThread();

      if (!check) {
        console.log("can't create multiple attendence thread a day.");
      } else {
        await channel.send({
          content: "@everyone Good morning! How are you feeling today?",
          components: [row],
          allowedMentions: { parse: ["everyone"] },
        });
      }
    },
    {
      timezone: "Asia/Dhaka",
    }
  );
};
