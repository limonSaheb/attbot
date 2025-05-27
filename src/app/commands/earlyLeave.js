import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("early-leave")
  .setDescription("User requesting a early leave.");

export async function execute(interaction) {
  const modal = new ModalBuilder()
    .setCustomId("earlyLeaveModal")
    .setTitle("Please elaborate your early leave 🤓");

  const input = new TextInputBuilder()
    .setCustomId("earlyLeaveReason")
    .setLabel("Give a short reason.")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const row = new ActionRowBuilder().addComponents(input);
  modal.addComponents(row);
  await interaction.showModal(modal);
  return;
}
