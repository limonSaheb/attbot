import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { AttendenceService } from "../services/attendecne.service.js";
import config from "../config/index.js";
import discordClient from "../utlis/discordClient.js";

export const data = new SlashCommandBuilder()
  .setName("early-leave")
  .setDescription("Request an early leave with a short reason.")
  .addStringOption((opt) =>
    opt
      .setName("reason")
      .setDescription("Short reason for early leave.")
      .setRequired(true)
  );

function bdtNow() {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export async function execute(interaction) {
  const user = interaction?.user?.displayName;
  const reason = interaction.options.getString("reason", true);
  try {
    const channel = await discordClient.channels
      .fetch(config.update_channel_id)
      .catch(() => null);
    if (channel) {
      const button = new ButtonBuilder()
        .setCustomId("checkOutButton")
        .setLabel("Give Updates")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      const ok = await AttendenceService.earlyLeaveWorkUpdate({ user, reason });

      if (ok) {
        await channel.send({
          content: `@everyone 🙌 Early leave requested by **${user}** at ${bdtNow()}.\nReason: ${reason}`,
          components: [row],
          allowedMentions: { parse: ["everyone"] },
        });
      }
    }
  } catch (error) {
    console.log(error, "error in early leave");
  }
}
