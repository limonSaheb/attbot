import cron from "node-cron";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import discordClient from "../utlis/discordClient.js";
import config from "../config/index.js";

export const startDailyCheckOut = () => {
  cron.schedule(
    "*/1 * * * *",
    async () => {
      const channel = await discordClient.channels.fetch(
        config.attendence_channel_id
      );

      if (!channel) return console.error("Check-out channel not found!");

      const button = new ButtonBuilder()
        .setCustomId("checkOutButton")
        .setLabel("Give Updates")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await channel.send({
        content: "@everyone 🙌 Great work. It's time to give updates ✍️.",
        components: [row],
        allowedMentions: { parse: ["everyone"] },
      });
    },
    {
      timezone: "Asia/Dhaka",
    }
  );
};
