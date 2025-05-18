import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5001,
  attendence_channel_id: process.env.ATTENDENCE_CHANNEL_ID,
  discord_token: process.env.DISCORD_TOKEN
};
