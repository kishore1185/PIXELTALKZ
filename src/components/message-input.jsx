"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import ReplyPreview from "./ReplyPreview.jsx";

export default function MessageInput({ onSendMessage, onSetNickname, replyingTo,
  onCancelReply, aiEnabled, setAiEnabled }) {

  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recorder, setRecorder] = useState(null)

  const inputRef = useRef(null)
  const chunks = useRef([]) // audio chunks

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    const textToSend = message
    const replyTarget = replyingTo

    setMessage("")
    if (replyTarget) onCancelReply()

    const result = await onSendMessage(textToSend, replyTarget)
    if (result.success) setError(null)
    else if (result.error) {
      setError(result.error)
      setMessage(textToSend)
    }
    if (inputRef.current) inputRef.current.focus()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      setRecorder(mediaRecorder)
      chunks.current = []
      mediaRecorder.start()
      setRecording(true)

      mediaRecorder.ondataavailable = e => chunks.current.push(e.data)

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" })
        // send audio as a message through parent function
        await onSendMessage({ audio: blob }, replyingTo)
        if (replyingTo) onCancelReply()
      }

      // Auto stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") mediaRecorder.stop()
        setRecording(false)
      }, 60000)

    } catch (err) {
      setError("Microphone permission denied")
    }
  }

  const stopRecording = () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop()
      setRecording(false)
    }
  }

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (replyingTo && inputRef.current) inputRef.current.focus()
  }, [replyingTo])

  return (
    <div className="border-t px-4 pt-4">
      {error && <div className="mb-2 p-2 bg-destructive/10 text-destructive text-sm rounded">{error}</div>}

      <ReplyPreview message={replyingTo} onCancel={onCancelReply} />

      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => setAiEnabled(prev => !prev)}
          className={`relative w-16 px-1 h-8 flex items-center justify-between rounded-full transition-all duration-300 overflow-hidden text-xs font-semibold ${aiEnabled ? 'bg-amber-500 text-black' : 'bg-gray-300 text-gray-600'}`}
          aria-pressed={aiEnabled}
        >
          <span className={`absolute left-3 transition-opacity ${aiEnabled ? 'opacity-100' : 'opacity-0'}`}>AI</span>
          <span className={`w-5 h-5 bg-zinc-600 rounded-full shadow-md transition-all duration-300 transform ${aiEnabled ? 'translate-x-9' : 'translate-x-0'}`}></span>
          <span className={`absolute right-3 transition-opacity ${!aiEnabled ? 'opacity-100' : 'opacity-0'}`}>AI</span>
        </button>

        <Input
          onChange={(e) => onSetNickname(e.target.value)}
          placeholder="Anonymous"
          className="border-zinc-400 w-40 h-8 dark:border-zinc-700 text-sm"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="pr-10 w-full pl-2 pt-2 h-fit text-black dark:text-white dark:bg-zinc-800 rounded-md resize-none min-h-12"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* 🎤 Voice Button inside the textbox right */}
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            className="absolute right-2 bottom-2 text-zinc-500 hover:text-amber-500 transition"
            title={recording ? "Stop Recording" : "Record Voice"}
          >
            {recording ? (
              <span className="animate-pulse text-red-600 font-bold">●</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm0 0v4m0 0h4m-4 0H8" />
              </svg>
            )}
          </button>
        </div>

        <Button type="submit" className="h-12" disabled={!message.trim()}>
          Send
        </Button>
      </form>
    </div>
  )
}
