import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with ping!");

export async function execute(interaction) {
  await interaction.reply("pong!");
}
