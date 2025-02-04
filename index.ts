import { GoogleGenerativeAI, GenerativeModel, Content, Part } from "@google/generative-ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";

dotenv.config();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const messages: Content[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question("You: ");

 
    const userMessage: Content = { role: "user", parts: [{ text: userInput }] };
    messages.push(userMessage);


    const result = await model.generateContentStream({ contents: messages });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullResponse += text;
        process.stdout.write(text);
      }
    }
    process.stdout.write("\n\n\n");

    messages.push({ role: "assistant", parts: [{ text: fullResponse }] });
  }
}

main().catch(console.error);
