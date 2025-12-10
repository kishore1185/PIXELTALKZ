// src/lib/aiService.js
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const AI_BOT = {
  id: 'ai-assistant-bot',
  nickname: 'PixelBot',
  color: 'bg-amber-500',
};

export async function generateAIResponse(question) {
  try {
    const response = await fetch("https://pixeltalkz-ai.2005kishore-sb.workers.dev/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();

    // 🔥 THIS IS THE ONLY KEY THE WORKER RETURNS
    if (typeof data?.reply === "string" && data.reply.trim()) {
      return data.reply.trim();
    }

    return "AI could not reply.";
  } catch (err) {
    console.error("AI error:", err);
    return "AI temporarily unavailable.";
  }
}

export async function postAIResponse(question, replyToMessage = null, roomId) {
  try {
    const aiResponse = await generateAIResponse(question);
    const finalText = (aiResponse || "AI temporarily unavailable.").trim();

    const messageData = {
      text: finalText,
      nickname: AI_BOT.nickname,
      userId: AI_BOT.id,
      timestamp: serverTimestamp(),
      color: AI_BOT.color,
      isAI: true,
      isAi: true
    };

    if (replyToMessage) {
      messageData.replyTo = {
        id: replyToMessage.id,
        text: replyToMessage.text,
        nickname: replyToMessage.nickname,
        userId: replyToMessage.userId
      };
    }

    await addDoc(collection(db, roomId), messageData);
    return true;
  } catch (error) {
    console.error("Error posting AI response:", error);
    return false;
  }
}