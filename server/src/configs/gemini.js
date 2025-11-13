import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export const initialize = async () => {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    throw new Error("Google API key is required for suggestion service");
  }

  const genAI = new GoogleGenerativeAI(googleApiKey);
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  return geminiModel;
};
