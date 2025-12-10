"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore"
import { generateUserId, generateRandomColor, filterProfanity } from "@/lib/utils"
import { postAIResponse, AI_BOT } from "../lib/aiService.js"

export function useChat(roomId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const oldestDocRef = useRef(null)

  const [aiEnabled, setAiEnabled] = useState(false)
  // Ref to always have latest aiEnabled value in sendMessage / sendAudioMessage
  const aiEnabledRef = useRef(aiEnabled)
  useEffect(() => {
    aiEnabledRef.current = aiEnabled
  }, [aiEnabled])

  const [userSession, setUserSession] = useState(() => {
    // Initialize user session with random ID and color
    return {
      id: generateUserId(),
      nickname: "Anonymous",
      color: generateRandomColor(),
      lastMessageTime: 0,
    }
  })

  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Set nickname
  const setNickname = useCallback((nickname) => {
    setUserSession((prev) => ({
      ...prev,
      nickname: nickname.trim() || "Anonymous",
    }))
  }, [])

  // State for replying
  const [replyingTo, setReplyingTo] = useState(null)

  const setReplyMessage = useCallback((message) => {
    setReplyingTo(message)
  }, [])

  const cancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  // ---------------- TEXT MESSAGE SENDER ----------------

  // Send message (accepts optional replyTarget for optimistic clearing)
  const sendMessage = useCallback(
    async (text, replyTarget = null) => {
      // Guard: only handle string text here
      if (typeof text !== "string" || !text.trim()) {
        return { success: false, error: "Message cannot be empty" }
      }

      try {
        const filteredText = filterProfanity(text)

        const messageData = {
          text: filteredText,
          nickname: userSession.nickname,
          userId: userSession.id,
          timestamp: serverTimestamp(),
          color: userSession.color,
          // audio fields omitted for pure text
        }

        if (replyTarget) {
          messageData.replyTo = {
            id: replyTarget.id,
            text: replyTarget.text,
            nickname: replyTarget.nickname,
            userId: replyTarget.userId,
          }
        }

        const docRef = await addDoc(collection(db, roomId), messageData)

        setUserSession((prev) => ({
          ...prev,
          lastMessageTime: Date.now(),
        }))

        // Safety clear
        setReplyingTo(null)

        const isUserMessage = messageData.userId !== AI_BOT.id
        if (isUserMessage && aiEnabledRef.current) {
          const sentMessage = {
            id: docRef.id,
            ...messageData,
            timestamp: Date.now(),
          }
          const replyText = replyTarget
            ? `Replying to: ${replyTarget.nickname}: ${replyTarget.text}. `
            : ""
          const questionPrompt = `${replyText}User: ${filteredText}`
          postAIResponse(questionPrompt, sentMessage, roomId)
        }
        return { success: true }
      } catch (err) {
        console.error("Error sending message:", err)
        if (err.message && err.message.includes("permission")) {
          return {
            success: false,
            error: "Permission denied. Please check Firestore security rules.",
          }
        }
        return { success: false, error: "Failed to send message. Please try again." }
      }
    },
    [userSession, roomId]
  )

  // ---------------- AUDIO MESSAGE SENDER ----------------
  /**
   * sendAudioMessage(blob, replyTarget)
   * - Fallback to persist audio when Cloud Storage isn't configured.
   * - Converts blob to base64 and stores in Firestore under audioBase64 + audioMime.
   * - Recommended: replace this with upload to Cloud Storage and store the public URL instead.
   */
  const sendAudioMessage = useCallback(
    async (blob, replyTarget = null) => {
      if (!blob) return { success: false, error: "No audio blob provided" }

      try {
        // Convert to base64 (data URL). For production, upload to Cloud Storage and store a URL instead.
        const toDataUrl = (b) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve(reader.result) // data:<mime>;base64,AAAA...
            }
            reader.onerror = reject
            reader.readAsDataURL(b)
          })

        const dataUrl = await toDataUrl(blob)
        const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/)
        const audioMime = mimeMatch ? mimeMatch[1] : "audio/webm"

        const messageData = {
          text: "[Voice message]",
          audioBase64: dataUrl, // stored as data URL
          audioMime,
          nickname: userSession.nickname,
          userId: userSession.id,
          timestamp: serverTimestamp(),
          color: userSession.color,
        }

        if (replyTarget) {
          messageData.replyTo = {
            id: replyTarget.id,
            text: replyTarget.text,
            nickname: replyTarget.nickname,
            userId: replyTarget.userId,
          }
        }

        const docRef = await addDoc(collection(db, roomId), messageData)

        setUserSession((prev) => ({
          ...prev,
          lastMessageTime: Date.now(),
        }))

        // Safety clear
        setReplyingTo(null)

        // We are NOT calling AI for raw audio here (needs transcription first)
        const isUserMessage = messageData.userId !== AI_BOT.id
        if (isUserMessage && aiEnabledRef.current) {
          // no AI response for now, safe
        }

        return { success: true, id: docRef.id }
      } catch (err) {
        console.error("Error sending audio message:", err)
        return {
          success: false,
          error: "Failed to send audio message. Please try again.",
        }
      }
    },
    [userSession, roomId]
  )

  // ---------------- INITIAL LOAD + LIVE UPDATES ----------------

  useEffect(() => {
    let unsubscribeLive = null
    let isMounted = true
    setLoading(true)
    setHasMore(true)
    oldestDocRef.current = null
    setMessages([])

    const init = async () => {
      try {
        const initialQ = query(
          collection(db, roomId),
          orderBy("timestamp", "desc"),
          limit(20)
        )
        const snapshot = await getDocs(initialQ)
        if (!isMounted) return

        const docs = snapshot.docs
        const initialMessages = docs
          .map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              text: data.text,
              nickname: data.nickname,
              userId: data.userId,
              timestamp: data.timestamp ? data.timestamp.toMillis() : Date.now(),
              color: data.color,
              replyTo: data.replyTo ? { ...data.replyTo } : null,
              // pick up any audio info if present
              audioBase64: data.audioBase64 || null,
              audioMime: data.audioMime || null,
              audioUrl: data.audioUrl || data.audioBase64 || null,
              isAi: data.isAi === true,
            }
          })
          .sort((a, b) => a.timestamp - b.timestamp)

        // Cursor for older fetches (last doc in the desc query)
        oldestDocRef.current = docs.length > 0 ? docs[docs.length - 1] : null
        setHasMore(docs.length === 20)
        setMessages(initialMessages)
        setLoading(false)

        // Live updates for newest 20: merge by id
        const liveQ = query(
          collection(db, roomId),
          orderBy("timestamp", "desc"),
          limit(20)
        )
        unsubscribeLive = onSnapshot(
          liveQ,
          (snap) => {
            const latest = snap.docs
              .map((doc) => {
                const data = doc.data()
                return {
                  id: doc.id,
                  text: data.text,
                  nickname: data.nickname,
                  userId: data.userId,
                  timestamp: data.timestamp ? data.timestamp.toMillis() : Date.now(),
                  color: data.color,
                  replyTo: data.replyTo ? { ...data.replyTo } : null,
                  audioBase64: data.audioBase64 || null,
                  audioMime: data.audioMime || null,
                  audioUrl: data.audioUrl || data.audioBase64 || null,
                  isAi: data.isAi || false,
                }
              })
              .sort((a, b) => a.timestamp - b.timestamp)

            setMessages((prev) => {
              const map = new Map(prev.map((m) => [m.id, m]))
              latest.forEach((m) => map.set(m.id, m))
              const merged = Array.from(map.values()).sort(
                (a, b) => a.timestamp - b.timestamp
              )
              return merged
            })

            // Scroll to bottom when new messages appear in the newest slice
            setTimeout(scrollToBottom, 100)
          },
          (err) => {
            console.error("Error listening to latest messages:", err)
          }
        )
      } catch (err) {
        console.error("Error loading messages:", err)
        if (isMounted) {
          setError("Failed to load messages. Please check Firestore security rules.")
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      isMounted = false
      if (unsubscribeLive) unsubscribeLive()
    }
  }, [roomId, scrollToBottom])

  // ---------------- PAGINATION: LOAD OLDER ----------------

  const loadMore = useCallback(
    async () => {
      if (!hasMore || !oldestDocRef.current) return 0
      try {
        const olderQ = query(
          collection(db, roomId),
          orderBy("timestamp", "desc"),
          startAfter(oldestDocRef.current),
          limit(20)
        )
        const snapshot = await getDocs(olderQ)
        const docs = snapshot.docs
        const older = docs
          .map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              text: data.text,
              nickname: data.nickname,
              userId: data.userId,
              timestamp: data.timestamp ? data.timestamp.toMillis() : Date.now(),
              color: data.color,
              replyTo: data.replyTo ? { ...data.replyTo } : null,
              audioBase64: data.audioBase64 || null,
              audioMime: data.audioMime || null,
              audioUrl: data.audioUrl || data.audioBase64 || null,
              isAi: data.isAi || false,
            }
          })
          .sort((a, b) => a.timestamp - b.timestamp)

        setMessages((prev) => {
          // Prepend older (which are earlier in time)
          const existingIds = new Set(prev.map((m) => m.id))
          const toAdd = older.filter((m) => !existingIds.has(m.id))
          return [...toAdd, ...prev]
        })

        oldestDocRef.current =
          docs.length > 0 ? docs[docs.length - 1] : oldestDocRef.current
        if (docs.length < 20) setHasMore(false)
        return older.length
      } catch (err) {
        console.error("Error loading older messages:", err)
        return 0
      }
    },
    [roomId, hasMore]
  )

  // ---------------- RETURN API ----------------

  return {
    messages,
    loading,
    error,
    userSession,
    sendMessage,       // text messages
    sendAudioMessage,  // voice messages (base64 fallback)
    setNickname,
    messagesEndRef,
    replyingTo,
    setReplyMessage,
    cancelReply,
    aiEnabled,
    setAiEnabled,
    loadMore,
    hasMore,
  }
}
