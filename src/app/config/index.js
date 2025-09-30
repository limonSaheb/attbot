import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5001,
  attendence_channel_id: process.env.ATTENDENCE_CHANNEL_ID,
  update_channel_id: process.env.UPDATE_CHANNEL_ID,
  admin_channel_id: process.env.ADMIN_CHANNEL_ID,
  discord_token: process.env.DISCORD_TOKEN,
  application_id: process.env.APP_ID,
  guild_id: process.env.GUILD_ID,
};
