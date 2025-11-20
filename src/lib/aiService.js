// src/lib/aiService.js
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// AI Bot user details
export const AI_BOT = {
  id: 'ai-assistant-bot',
  nickname: 'PixelBot',
  color: 'bg-amber-500', // Distinct color for the AI
};



// Function to generate AI response
export async function generateAIResponse(question) {
  // Helper: robust text extractor from many shapes
  const extractText = (payload) => {
    try {
      // 1) Google/Gemini-like
      const parts = payload?.candidates?.[0]?.content?.parts;
      if (Array.isArray(parts)) {
        const joined = parts
          .map((p) => (typeof p?.text === 'string' ? p.text : ''))
          .filter(Boolean)
          .join('')
          .trim();
        if (joined) return joined;
      }
      // 2) OpenAI chat
      const openaiChat = payload?.choices?.[0]?.message?.content;
      if (typeof openaiChat === 'string' && openaiChat.trim()) return openaiChat.trim();
      // 3) OpenAI completions
      const openaiComp = payload?.choices?.[0]?.text;
      if (typeof openaiComp === 'string' && openaiComp.trim()) return openaiComp.trim();
      // 4) Common proxy keys
      const directKeys = [
        'output_text',
        'outputText',
        'reply',
        'answer',
        'content',
        'message',
        'text',
      ];
      for (const key of directKeys) {
        const val = payload?.[key];
        if (typeof val === 'string' && val.trim()) return val.trim();
      }
      // 5) Some proxies wrap data
      if (payload?.data && typeof payload.data === 'object') {
        const nested = extractText(payload.data);
        if (nested) return nested;
      }
    } catch {
      // ignore
    }
    return null;
  };

  // First attempt: Gemini-style body (current behavior)
  try {
    const response = await fetch('https://pixeltalkz-ai.2005kishore-sb.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `You are an AI with humor and sarcasm with correct facts. Follow these rules:\n
                1. Keep responses short and helpful.\n
                2. Maintain context from previous messages.\n
                3. Always respond in English text, but adapt the language:\n
                   - If the user types in Hindi, reply in Hindi but using English script.\n
                User's message: "${question}"` }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 150
        }
      })
    });

    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If it's plain text, use it directly
      if (text && text.trim()) return text.trim();
      // Try to parse JSON from text if possible
      try { data = JSON.parse(text); } catch { data = { text }; }
    }

    if (!response.ok) {
      // Handle rate limit / quota errors with helpful message
      if (response.status === 429 || data?.error?.code === 429) {
        console.error('AI quota exceeded:', data);
        return 'AI is temporarily unavailable (quota exceeded). Please try again later! 🙏';
      }
      throw new Error(data?.error?.message || data?.error || `Failed to generate response from AI. Status: ${response.status}`);
    }

    const aiText = extractText(data);
    if (aiText && aiText.trim()) return aiText.trim();

    // If no text extracted, fall through to second attempt
  } catch (error) {
    console.warn('AI first attempt failed or returned empty, retrying with fallback payload. Details:', error);
  }

  // Second attempt: simpler payload many CF workers expect
  try {
    const response2 = await fetch('https://pixeltalkz-ai.2005kishore-sb.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: String(question) }]
          }
        ]
      })
    });

    const contentType2 = response2.headers.get('content-type') || '';
    let data2;
    if (contentType2.includes('application/json')) {
      data2 = await response2.json();
    } else {
      const text2 = await response2.text();
      if (text2 && text2.trim()) return text2.trim();
      try { data2 = JSON.parse(text2); } catch { data2 = { text: text2 }; }
    }

    if (!response2.ok) {
      // Handle rate limit on retry too
      if (response2.status === 429 || data2?.error?.code === 429) {
        console.error('AI quota exceeded (retry):', data2);
        return 'AI is temporarily unavailable (quota exceeded). Please try again later! 🙏';
      }
      throw new Error(data2?.error?.message || data2?.error || `Fallback call failed. Status: ${response2.status}`);
    }

    const aiText2 = extractText(data2);
    if (aiText2 && aiText2.trim()) return aiText2.trim();
  } catch (error2) {
    console.error('AI fallback attempt failed:', error2);
  }

  // Final fallback to avoid undefined
  return 'Sorry, I could not generate a response right now.';
}


// Function to post AI response to the chat
export async function postAIResponse(question, replyToMessage = null,roomId) {
  try {
    const aiResponse = await generateAIResponse(question);
    const safeText = (typeof aiResponse === 'string' ? aiResponse : String(aiResponse || '')).trim();
    const finalText = safeText || 'Sorry, I could not generate a response right now.';

    if (!roomId || typeof roomId !== 'string') {
      console.error('postAIResponse: invalid roomId:', roomId);
    }

    const messageData = {
      text: finalText,
      nickname: AI_BOT.nickname,
      userId: AI_BOT.id,
      timestamp: serverTimestamp(),
      color: AI_BOT.color,
      isAI: true, // Legacy flag
      isAi: true // UI flag expected by MessageItem
    };
    
    // If this is a reply to a specific message
    if (replyToMessage) {
      messageData.replyTo = {
        id: replyToMessage.id,
        text: replyToMessage.text,
        nickname: replyToMessage.nickname,
        userId: replyToMessage.userId
      };
    }
    
    // Add to Firestore
    await addDoc(collection(db, roomId), messageData);
    return true;
  } catch (error) {
    console.error('Error posting AI response:', error);
    return false;
  }
}
