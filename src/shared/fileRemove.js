import axios from "axios";
import config from "../app/config/index.js";

// Helper to extract path from full BunnyCDN URL
const extractFilePath = (fileUrl) => {
  try {
    const parsed = new URL(fileUrl);
    return parsed.pathname.startsWith("/")
      ? parsed.pathname.slice(1)
      : parsed.pathname;
  } catch {
    // If it's already a relative path, just return as-is
    return fileUrl;
  }
};

const deleteFromBunnyCDN = async (fileUrl) => {
  try {
    const filePath = extractFilePath(fileUrl);
    console.log(filePath);
    // Delete from BunnyCDN
    const response = await axios({
      method: "DELETE",
      url: `https://${config.base_host_name}/${config.bunny_storage_zone_name}/${filePath}`,
      headers: {
        AccessKey: config.bunny_storage_api_key,
      },
    });
    console.log(response);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete from BunnyCDN: ${error.message}`);
  }
};

export const removeFiles = {
  deleteFromBunnyCDN,
};
