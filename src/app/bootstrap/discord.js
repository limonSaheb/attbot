// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import {
//   Events,
//   ModalBuilder,
//   TextInputBuilder,
//   TextInputStyle,
//   ActionRowBuilder,
//   MessageFlags,
//   ButtonStyle,
//   ButtonBuilder,
// } from "discord.js";
// import config from "../config/index.js";
// import discordClient from "../utlis/discordClient.js";
// import { AttendenceService } from "../services/attendecne.service.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// function bdtNow() {
//   return new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: true,
//     timeZone: "Asia/Dhaka",
//   }).format(new Date());
// }

// export async function bootstrapDiscordBot() {
//   const commandsPath = path.join(__dirname, "..", "commands");
//   const commandFiles = fs
//     .readdirSync(commandsPath)
//     .filter((file) => file.endsWith(".js"));

//   for (const file of commandFiles) {
//     const command = await import(path.join(commandsPath, file));
//     discordClient.commands.set(command.data.name, command);
//   }

//   discordClient.once(Events.ClientReady, (c) => {
//     console.log(`✅ Bot ready! Logged in as ${c.user.tag}`);
//   });

//   discordClient.on(Events.InteractionCreate, async (interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     const command = discordClient.commands.get(interaction.commandName);
//     if (!command) return;

//     try {
//       await command.execute(interaction);
//     } catch (err) {
//       console.error("Command failed:", err);
//       await interaction.reply({
//         content: "There was an error executing this command.",
//         flags: MessageFlags.Ephemeral,
//       });
//     }
//   });

//   discordClient.on(Events.InteractionCreate, async (intersection) => {
//     if (intersection.isButton()) {
//       if (intersection.customId === "primary_btn") {
//         await intersection.reply({
//           content: "Button Clicked",
//           flags: MessageFlags.Ephemeral,
//         });
//       }
//     }
//   });

//   discordClient.on(Events.InteractionCreate, async (interaction) => {
//     let selectedValue;
//     if (interaction.isStringSelectMenu()) {
//       if (interaction.customId === "feedbackSelect") {
//         selectedValue = interaction.values[0];
//       }
//     }
//     if (interaction.isModalSubmit()) {
//       if (interaction.customId === "feedbackModal") {
//         const feedback = interaction.fields.getTextInputValue("feedbackInput");
//         await interaction.reply({
//           content: `Thanks for your feedback: ${feedback} ${selectedValue}`,
//           flags: MessageFlags.Ephemeral,
//         });
//       }
//       return;
//     }
//   });

//   discordClient.on(Events.InteractionCreate, async (interaction) => {
//     if (
//       interaction.isStringSelectMenu() &&
//       interaction.customId === "asg-owl"
//     ) {
//       const mood = interaction?.values[0];
//       const user = interaction?.user?.displayName;

//       const recordAttendence = await AttendenceService.recordAttendence({
//         user,
//         mood,
//       });

//       if (recordAttendence) {
//         await interaction.reply({
//           content: `Thanks, ${user}! Best of Luck!`,
//           flags: MessageFlags.Ephemeral,
//         });

//         const adminChannel = await discordClient.channels.fetch(
//           config.admin_channel_id
//         );

//         if (!adminChannel) console.log("Admin channel not found");

//         const now = new Date();
//         const options = {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//           timeZone: "Asia/Dhaka",
//         };
//         const timestamp = new Intl.DateTimeFormat("en-US", options).format(now);

//         await adminChannel.send({
//           content: `${user} just checked in at ${timestamp}`,
//         });
//       } else {
//         await interaction.reply({
//           content: `${user}! You are already checked-IN.`,
//           flags: MessageFlags.Ephemeral,
//         });
//         return;
//       }
//     }
//   });

//   discordClient.on(Events.InteractionCreate, async (interaction) => {
//     if (interaction.isButton() && interaction.customId === "checkOutButton") {
//       const modal = new ModalBuilder()
//         .setCustomId("explainModal")
//         .setTitle("Please! give your work updates.");

//       const input = new TextInputBuilder()
//         .setCustomId("updateInput") // fixed ID
//         .setLabel("Today's work update 📝")
//         .setStyle(TextInputStyle.Paragraph)
//         .setRequired(true);

//       const row = new ActionRowBuilder().addComponents(input);
//       modal.addComponents(row);

//       await interaction.showModal(modal);
//       return;
//     }
//     if (
//       interaction.isModalSubmit() &&
//       interaction.customId === "explainModal"
//     ) {
//       const updates = interaction.fields.getTextInputValue("updateInput");
//       const user = interaction?.user?.displayName;
//       const timestamp = bdtNow();

//       const recordUpdates = await AttendenceService.recordWorkUpdates({
//         updates,
//         user,
//       });

//       if (recordUpdates) {
//         console.log(`${user} checked out at ${timestamp}.`);
//         console.log(`work-update: ${updates}`);

//         await interaction.reply({
//           content: `Thanks, ${user} for you hard work. Go Home and sleep tight.`,
//           flags: MessageFlags.Ephemeral,
//         });

//         const adminChannel = await discordClient.channels.fetch(
//           config.admin_channel_id
//         );

//         if (!adminChannel) console.log("admin channel not found");

//         await adminChannel.send({
//           content: `${user} just checked out at ${timestamp} \n 📝 ${updates}`,
//         });
//         return;
//       } else {
//         await interaction.reply({
//           content: `${user}You already checked out.`,
//           flags: MessageFlags.Ephemeral,
//         });
//         return;
//       }
//     }
//   });

//   discordClient.on(Events.InteractionCreate, async (interaction) => {
//     if (
//       interaction.isModalSubmit() &&
//       interaction.customId === "earlyLeaveModal"
//     ) {
//       const user = interaction.user.username;
//       const reason = interaction.fields.getTextInputValue("earlyLeaveReason");
//       const requestEarlyLeave = await AttendenceService.recordEarlyLeave({
//         user,
//         reason,
//       });

//       if (requestEarlyLeave) {
//         const channel = await discordClient.channels.fetch(
//           config.update_channel_id
//         );
//         if (!channel) return console.error("Check-out channel not found!");

//         const button = new ButtonBuilder()
//           .setCustomId("checkOutButton")
//           .setLabel("Give Updates")
//           .setStyle(ButtonStyle.Primary);

//         const row = new ActionRowBuilder().addComponents(button);

//         await channel.send({
//           content: `@everyone 🙌 Great work. It's time to give updates ✍️.Early initiation ${user}`,
//           components: [row],
//           allowedMentions: { parse: ["everyone"] },
//         });

//         await interaction.reply({
//           content: "Early Work update Thread Initiated.",
//           flags: MessageFlags.Ephemeral,
//         });

//         return;
//       } else {
//         await interaction.reply({
//           content: `You can't have a early leave!⚒️`,
//           flags: MessageFlags.Ephemeral,
//         });
//         return;
//       }
//     }
//   });

//   await discordClient.login(config.discord_token);
// }

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

export async function bootstrapDiscordBot() {
  /** -------------------------------
   * Load Commands
   * ------------------------------- */
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(path.join(commandsPath, file));
    discordClient.commands.set(command.data.name, command);
  }

  /** -------------------------------
   * Ready Event
   * ------------------------------- */
  discordClient.once(Events.ClientReady, (c) => {
    console.log(`✅ Bot ready! Logged in as ${c.user.tag}`);
  });

  /** -------------------------------
   * Unified Interaction Handler
   * ------------------------------- */
  discordClient.on(Events.InteractionCreate, async (interaction) => {
    try {
      /** --- Slash Commands --- */
      if (interaction.isChatInputCommand()) {
        const command = discordClient.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction);
        return;
      }

      /** --- Button Interactions --- */
      if (interaction.isButton()) {
        if (interaction.customId === "primary_btn") {
          return interaction.reply({
            content: "Button Clicked!",
            flags: MessageFlags.Ephemeral,
          });
        }

        if (interaction.customId === "checkOutButton") {
          const modal = new ModalBuilder()
            .setCustomId("explainModal")
            .setTitle("Please! give your work updates.");

          const input = new TextInputBuilder()
            .setCustomId("updateInput")
            .setLabel("Today's work update 📝")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder().addComponents(input));
          await interaction.showModal(modal);
          return;
        }
      }

      /** --- Select Menu Interactions --- */
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "asg-owl") {
          await interaction.deferReply({ ephemeral: true });

          const mood = interaction.values[0];
          const user = interaction.user.displayName;
          const recordAttendence = await AttendenceService.recordAttendence({
            user,
            mood,
          });

          if (recordAttendence) {
            await interaction.editReply({
              content: `Thanks, ${user}! Best of Luck!`,
            });

            const adminChannel = await discordClient.channels.fetch(
              config.admin_channel_id
            );

            if (adminChannel) {
              const timestamp = bdtNow();
              await adminChannel.send(
                `${user} just checked in at ${timestamp}`
              );
            }
          } else {
            await interaction.editReply({
              content: `${user}, you are already checked-IN.`,
            });
          }
          return;
        }

        if (interaction.customId === "feedbackSelect") {
          // Store selected value temporarily if needed
          return interaction.reply({
            content: `You selected: ${interaction.values[0]}`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      /** --- Modal Submissions --- */
      if (interaction.isModalSubmit()) {
        await interaction.deferReply({ ephemeral: true }); // Always defer to avoid timeouts

        if (interaction.customId === "feedbackModal") {
          const feedback =
            interaction.fields.getTextInputValue("feedbackInput");
          await interaction.editReply({
            content: `Thanks for your feedback: ${feedback}`,
          });
          return;
        }

        if (interaction.customId === "explainModal") {
          const updates = interaction.fields.getTextInputValue("updateInput");
          const user = interaction.user.displayName;
          const timestamp = bdtNow();

          const recordUpdates = await AttendenceService.recordWorkUpdates({
            updates,
            user,
          });

          if (recordUpdates) {
            await interaction.editReply({
              content: `Thanks, ${user}! Your hard work is appreciated.`,
            });

            const adminChannel = await discordClient.channels.fetch(
              config.admin_channel_id
            );
            if (adminChannel)
              await adminChannel.send(
                `${user} just checked out at ${timestamp}\n📝 ${updates}`
              );
          } else {
            await interaction.editReply({
              content: `${user}, you already checked out.`,
            });
          }
          return;
        }

        if (interaction.customId === "earlyLeaveModal") {
          const user = interaction.user.username;
          const reason =
            interaction.fields.getTextInputValue("earlyLeaveReason");
          const requestEarlyLeave = await AttendenceService.recordEarlyLeave({
            user,
            reason,
          });

          if (requestEarlyLeave) {
            const channel = await discordClient.channels.fetch(
              config.update_channel_id
            );

            if (channel) {
              const button = new ButtonBuilder()
                .setCustomId("checkOutButton")
                .setLabel("Give Updates")
                .setStyle(ButtonStyle.Primary);

              const row = new ActionRowBuilder().addComponents(button);

              await channel.send({
                content: `@everyone 🙌 Great work. It's time to give updates ✍️. Early initiation by ${user}`,
                components: [row],
                allowedMentions: { parse: ["everyone"] },
              });
            }

            await interaction.editReply({
              content: "Early work update thread initiated.",
            });
          } else {
            await interaction.editReply({
              content: `You can't have an early leave! ⚒️`,
            });
          }
          return;
        }
      }
    } catch (err) {
      console.error("❌ Interaction Error:", err);

      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({
            content: "Something went wrong while handling this interaction.",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error executing this interaction.",
            flags: MessageFlags.Ephemeral,
          });
        }
      } catch (e) {
        console.error("❌ Failed to send error reply:", e);
      }
    }
  });

  /** -------------------------------
   * Login
   * ------------------------------- */
  await discordClient.login(config.discord_token);
  console.log("🤖 Bot connected successfully");
}
