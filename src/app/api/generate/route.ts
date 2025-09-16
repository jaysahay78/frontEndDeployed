import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// TEMP: in-memory user usage store (replace with DB)
const userWriteUsage: Record<number, number> = {};

const MAX_WRITES = 3;

async function checkAndIncrementWriteUsage(userId: number) {
  const current = userWriteUsage[userId] ?? 0;
  if (current >= MAX_WRITES) {
    throw new Error("Write limit reached");
  }
  userWriteUsage[userId] = current + 1;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 2048,
};

export async function POST(req: Request) {
  const { prompt, userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    await checkAndIncrementWriteUsage(userId);

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    return NextResponse.json({ text });
  } catch (err: any) {
    if (err.message === "Write limit reached") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    console.error(err);
    return NextResponse.json({ error: "Failed to generate text." }, { status: 500 });
  }
}
