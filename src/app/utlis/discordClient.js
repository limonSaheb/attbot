import { Client, GatewayIntentBits, Collection } from "discord.js";

const initializeCient = () => {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
  });
};

const discordClient = initializeCient();

discordClient.commands = new Collection();

export default discordClient;
