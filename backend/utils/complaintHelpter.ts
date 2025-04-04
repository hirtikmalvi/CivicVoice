import axios from "axios";
import dotenv from "dotenv";
import { delay } from "../utils/delay";

export const generateTitleFromContext = async (
  context: string
): Promise<string> => {
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  await delay(2000); // 2 second delay

  const prompt = `Generate a title for a complaint based on this context:\n${context}\nTitle:`;

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/gpt2",
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.7,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
    }
  );

  const generated = response.data?.[0]?.generated_text || "";
  const lines = generated.split("\n");
  const titleLine = lines.find((line) => line.toLowerCase().includes("title:"));
  const title = titleLine
    ? titleLine.split("Title:")[1].trim()
    : generated.trim();

  return title;
};

export const generateDescriptionFromContext = async (
  context: string
): Promise<string> => {
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  await delay(2000); // 2 second delay

  const prompt = `Write a professional complaint description based on the following user input:\n${context}\nDescription:`;

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/gpt2",
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
    }
  );

  const generated = response.data?.[0]?.generated_text || "";
  const lines = generated.split("\n");
  const descLine = lines.find((line) =>
    line.toLowerCase().includes("description:")
  );
  const description = descLine
    ? descLine.split("Description:")[1].trim()
    : generated.trim();

  return description;
};
