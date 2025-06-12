import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags,
  ButtonStyle,
  ButtonBuilder,
} from "discord.js";
import config from "../config/index.js";
import discordClient from "../utlis/discordClient.js";
import { AttendenceService } from "../services/attendecne.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function bootstrapDiscordBot() {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(path.join(commandsPath, file));
    discordClient.commands.set(command.data.name, command);
  }

  discordClient.once(Events.ClientReady, (c) => {
    console.log(`✅ Bot ready! Logged in as ${c.user.tag}`);
  });

  discordClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = discordClient.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error("❌ Command failed:", err);
      await interaction.reply({
        content: "There was an error executing this command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  });

  discordClient.on(Events.InteractionCreate, async (intersection) => {
    if (intersection.isButton()) {
      if (intersection.customId === "primary_btn") {
        await intersection.reply({
          content: "Button Clicked",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  discordClient.on(Events.InteractionCreate, async (interaction) => {
    let selectedValue;
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "feedbackSelect") {
        selectedValue = interaction.values[0];
      }
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "feedbackModal") {
        const feedback = interaction.fields.getTextInputValue("feedbackInput");
        await interaction.reply({
          content: `Thanks for your feedback: ${feedback} ${selectedValue}`,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
  });

  discordClient.on(Events.InteractionCreate, async (interaction) => {
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "dailyMoodSelect"
    ) {
      const mood = interaction.values[0];

      const modal = new ModalBuilder()
        .setCustomId(`dailyGoalModal_${mood}`)
        .setTitle("What’s your main goal today?");

      const input = new TextInputBuilder()
        .setCustomId("goalInput")
        .setLabel("Today’s goal/task")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);

      await interaction.showModal(modal);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId.startsWith("dailyGoalModal_")
    ) {
      const mood = interaction.customId.split("_")[1];
      const goal = interaction.fields.getTextInputValue("goalInput");
      const user = interaction.user.displayName;
      const timestamp = new Date().toLocaleString();

      const recordAttendence = await AttendenceService.recordAttendence({
        user,
        mood,
        goal,
      });

      if (recordAttendence) {
        console.log("--- Daily Check-In ---");
        console.log(`User: ${user}`);
        console.log(`Mood: ${mood}`);
        console.log(`Goal: ${goal}`);
        console.log(`Time: ${timestamp}`);
        console.log("----------------------");

        await interaction.reply({
          content: `✅ Thanks, ${user}! Logged your goal. Best of Luck!`,
          flags: MessageFlags.Ephemeral,
        });

        const adminChannel = await discordClient.channels.fetch(
          config.admin_channel_id
        );

        if (!adminChannel) console.log("admin channel not found");

        await adminChannel.send({
          content: `🤓${user} just checked in at ${timestamp}`,
        });
      } else {
        await interaction.reply({
          content: `😏${user} you have already checked in once.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  discordClient.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton() && interaction.customId === "checkOutButton") {
      const modal = new ModalBuilder()
        .setCustomId("explainModal")
        .setTitle("Please! give your work updates.");

      const input = new TextInputBuilder()
        .setCustomId("updattimestampeInput")
        .setLabel("Today's work update 📝")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);

      await interaction.showModal(modal);
      return;
    }
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "explainModal"
    ) {
      const updates = interaction.fields.getTextInputValue(
        "updattimestampeInput"
      );
      const user = interaction.user.username;
      const timestamp = new Date().toLocaleString();

      const recordUpdates = await AttendenceService.recordWorkUpdates({
        updates,
        user,
      });

      if (recordUpdates) {
        console.log(`${user} checked out at ${timestamp}.`);
        console.log(`work-update: ${updates}`);

        await interaction.reply({
          content: `Thanks, ${user} for you hard work. Take rest and sleep tight.`,
          flags: MessageFlags.Ephemeral,
        });

        const adminChannel = await discordClient.channels.fetch(
          config.admin_channel_id
        );

        if (!adminChannel) console.log("admin channel not found");

        await adminChannel.send({
          content: `${user} just checked out at ${timestamp}`,
        });
        return;
      } else {
        await interaction.reply({
          content: `Something went wrong!⚒️`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }
  });

  discordClient.on(Events.InteractionCreate, async (interaction) => {
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "earlyLeaveModal"
    ) {
      const user = interaction.user.username;
      const reason = interaction.fields.getTextInputValue("earlyLeaveReason");
      const requestEarlyLeave = await AttendenceService.recordEarlyLeave({
        user,
        reason,
      });

      if (requestEarlyLeave) {
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
          content: `@everyone 🙌 Great work. It's time to give updates ✍️.Early initiation ${user}`,
          components: [row],
          allowedMentions: { parse: ["everyone"] },
        });

        await interaction.reply({
          content: "Early Work update Thread Initiated.",
          flags: MessageFlags.Ephemeral,
        });

        return;
      } else {
        await interaction.reply({
          content: `You can't have a early leave!⚒️`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }
  });

  await discordClient.login(config.discord_token);
}
