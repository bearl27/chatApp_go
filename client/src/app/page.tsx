'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:8080/ws')
    socket.current.onmessage = (event: MessageEvent) => {
      setMessages(prev => [...prev, event.data])
    }
    return () => {
      socket.current?.close()
    }
  }, [])

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputMessage && socket.current) {
      socket.current.send(inputMessage)
      setInputMessage('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Real-time Chat</h1>
      <div className="h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4">
        {messages.map((message, index) => (
          <p key={index} className="rounded-lg p-2 mb-2">{message}</p>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow px-4 py-2 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-6 py-2 text-lg text-white bg-blue-500 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  )
}