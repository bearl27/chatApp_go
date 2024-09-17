'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Real-time Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4 mb-4">
            {messages.map((message, index) => (
              <p key={index} className="rounded-lg p-2 mb-2">{message}</p>
            ))}
          </ScrollArea>
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}