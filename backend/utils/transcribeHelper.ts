import axios from "axios";
import FormData from "form-data";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs"; // for checking dir existence
import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
import { CustomError } from "../middlewares/asyncHandler";

export const transcribeAudio = async (
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Ensure the "temp" folder exists
  const tempDir = path.join(__dirname, "..", "temp");
  if (!fsSync.existsSync(tempDir)) {
    await fs.mkdir(tempDir, { recursive: true });
  }

  const tempPath = path.join(tempDir, `audio_${Date.now()}.mp3`);
  await fs.writeFile(tempPath, fileBuffer);

  try {
    const uploadedMedia = await ai.files.upload({
      file: tempPath,
      config: { mimeType },
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        createPartFromUri(uploadedMedia.uri, uploadedMedia.mimeType),
        "Transcribe the spoken content in this audio. Return only the text in plain format. Identify the language. Transcribed text must only be in English",
      ]),
    });

    return response.text.trim();
  } catch (error) {
    throw new CustomError("Some error has occurred while transcribing audio", 500);
  } finally {
    await fs.unlink(tempPath); // cleanup
  }
};
