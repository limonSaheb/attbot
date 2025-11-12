import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../app/config/index.js";
import axios from "axios";
import AppErrors from "../errors/AppErrors.js";
import { StatusCodes } from "http-status-codes";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "src/uploads");

    // Check if the directory exists, and create it if it doesn't
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Allowed file types (images & videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// Define Single and Multiple Upload
const upload = multer({
  storage,
  fileFilter,
});

const singleUpload = upload.single("file"); // For single file upload
const multipleUpload = upload.array("files", 2); // For multiple file upload (max 2)

// Upload to BunnyCDN
const uploadToBunnyCDN = async (filePath, fileName) => {
  const HOSTNAME = config.base_host_name;
  const STORAGE_ZONE_NAME = config.bunny_storage_zone_name;
  const ACCESS_KEY = config.bunny_storage_api_key;
  const CDN_URL = "https://fai-cg.b-cdn.net";

  try {
    const cdnPath = `acs/achives/${fileName}`;
    const fileData = fs.readFileSync(filePath);

    await axios.put(
      `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${cdnPath}`,
      fileData,
      {
        headers: {
          AccessKey: ACCESS_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    );
    return `${CDN_URL}/${cdnPath}`;
  } catch (error) {
    console.error("Upload failed:", error.message);
  }
};

// Process Uploads (Handle Both Single & Multiple)
const processFileUploads = async (req, res, next) => {
  const backendUrl = "https://api.manager.asgshop.my/uploads/";
  try {
    if (!req.file && !req.files) {
      return next();
    }

    let uploadedFiles = [];

    if (req.file) {
      // Single file
      const filePath = req.file.path;
      const fileName = req.file.filename;
      req.photoUrl = backendUrl + filePath;

      // const fileUrl = await uploadToBunnyCDN(filePath, fileName);
      // if (fileUrl) {
      //   req.photoUrl = fileUrl;
      //   fs.promises.unlink(filePath, (err) => {
      //     if (err) {
      //       console.error(`Error removing temp file:`, err);
      //     } else {
      //       console.log("File deleted successfully!");
      //     }
      //   });
      // }
    } else if (req.files) {
      // Multiple files
      for (let file of req.files) {
        const filePath = file.path;
        const fileName = file.filename;
        uploadedFiles.push(backendUrl + fileName);

        // const fileUrl = await uploadToBunnyCDN(filePath, fileName);
        // if (fileUrl) {
        //   uploadedFiles.push(fileUrl);
        //   fs.promises.unlink(filePath, (err) => {
        //     if (err) {
        //       console.error(`Error removing temp file:`, err);
        //     } else {
        //       console.log("File deleted successfully!");
        //     }
        //   });
        // }
      }
    }
    req.uploadedFiles = uploadedFiles;
    return next();
  } catch (error) {
    next(error);
  }
};

// File & Data Parser (Convert JSON)
const fileAndDataParser = async (req, res, next) => {
  try {
    if (!req?.body?.data) {
      return next();
    }
    // If `data` is a string, try to parse it
    if (typeof req.body.data === "string") {
      const parsedData = JSON.parse(req.body.data);
      req.body = { ...parsedData };
    }
    return next();
  } catch (err) {
    throw new AppErrors(StatusCodes.BAD_REQUEST, "Invalid JSON in data field");
  }
};

export const fileUploader = {
  singleUpload,
  multipleUpload,
  fileAndDataParser,
  processFileUploads,
};
