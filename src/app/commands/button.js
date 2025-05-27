import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("button")
  .setDescription("Replies with a button!");

export async function execute(interaction) {
  const button = new ButtonBuilder()
    .setCustomId("primary_btn")
    .setLabel("Click Me!")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  await interaction.reply({
    content: "Here is a button:",
    components: [row],
  });
}
