import {Client, GatewayIntentBits } from 'discord.js';

const initializeCient =()=>{return new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
})};

const discordClient = initializeCient();

export default discordClient;