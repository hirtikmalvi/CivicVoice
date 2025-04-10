import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { delay } from "../utils/delay";

export const generateTitleFromContext = async (
  context: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Generate one and only one short, clear, and simple title for the civic complaint described as ${context}. The title must be a single line and must summarize the core issue in the most understandable way. Do not include more than one title or variation.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text;
};

export const generateDescriptionFromContext = async (
  context: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Generate a complaint description for the context "${context}" in very simple and understandable terms. The description should clearly highlight the civic issue, explain how it affects people, and why it needs to be resolved. Write in a polite and easy-to-understand tone using simple vocabulary. The description should be at least 5 lines long. Do not include the subject/title or any personal details. Just write the complaint description.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text;
};
