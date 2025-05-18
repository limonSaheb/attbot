import nodemailer from "nodemailer";
import config from "../config/index.js";

const smsTransport = (phone, message) => {
  let smsConfig = {
    method: "get",
    maxBodyLength: Infinity,
    timeout: 60000,
    url: `http://bulksmsbd.net/api/smsapi?api_key=${
      config.sms_api_key
    }&type=text&number=${phone}&senderid=${config.sms_sender_id}&message=${
      message
    }`,
    headers: {},
  };
  return smsConfig;
};

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.smtp_email,
    pass: config.smtp_password,
  },
});

const mailBuilder = (from, to, subject, text) => {
  return {
    from,
    to,
    subject,
    text,
  };
};

const newLoginInfoText = (email, phone, pass, logInUrl) => {
  return `Your Achieve admin account has been created successfully. Here is your credentials, email: ${email}, phone: ${phone}, one time password: ${pass}. Visit: ${logInUrl}. Please change this temporary password afterwards.`;
};

export const constants = {
  transport,
  mailBuilder,
  newLoginInfoText,
  smsTransport,
};
