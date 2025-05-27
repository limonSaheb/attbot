import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("modal")
  .setDescription("Opens a modal for input");

export async function execute(interaction) {
  const modal = new ModalBuilder()
    .setCustomId("feedbackModal")
    .setTitle("Feedback Form");

  const select = new StringSelectMenuBuilder()
    .setCustomId("feedbackSelect")
    .setPlaceholder("make a selection")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("good")
        .setValue("good good"),
      new StringSelectMenuOptionBuilder().setLabel("bad").setValue("bad bad")
    );

  const input = new TextInputBuilder()
    .setCustomId("feedbackInput")
    .setLabel("What do you think?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const row = new ActionRowBuilder().addComponents(input);
  modal.addComponents(row);

  await interaction.showModal(modal);
}
