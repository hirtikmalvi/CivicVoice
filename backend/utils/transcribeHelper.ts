import axios from "axios";
import FormData from "form-data";
import { GoogleGenAI, Part } from "@google/genai";
import { CustomError } from "../middlewares/asyncHandler";
import dotenv from "dotenv";

dotenv.config();

export const transcribeAudio = async (
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> => {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Create a blob-like object that matches the requirements
    const blob = new Blob([fileBuffer], { type: mimeType });

    // Create file part directly with the blob content
    const filePart: Part = {
      inlineData: {
        data: Buffer.from(fileBuffer).toString("base64"),
        mimeType: mimeType,
      },
    };

    // Use the generative model

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            filePart,
            {
              text: "Transcribe the spoken content in this audio. Return only the text in plain format. Identify the language. Transcribed text must only be in English",
            },
          ],
        },
      ],
    });

    return result.text.trim();
  } catch (error) {
    console.error("Transcription error:", error);
    throw new CustomError(
      "Some error has occurred while transcribing audio",
      500
    );
  }
};
