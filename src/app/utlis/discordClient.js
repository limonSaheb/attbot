import {Client, GatewayIntentBits } from 'discord.js';

const discordClient =()=>{return new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
})};

export default discordClient;