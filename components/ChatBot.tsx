'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyCy4v_Yc_3xprx-QqJ9YumPiCYEFA_i9p0")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

const db_schema = `
CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
      
      );
`

interface Message {
  role: 'user' | 'bot'
  content: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      const llm_prompt = `
        You are an SQL expert. Your job is to give accurate SQL queries for a given question for the expenses database:

        This is the question: ${input}

        This is the database schema:
        ${db_schema}

        budget in the schema is the maximum budget set by the user

        This is history of the last 5 queries: ${history}. Use it if context to the question is required.
        Use it if pronouns are used or the user is responding back to questions. 

        Give just the raw SQL query so that it can be executed directly. If the question is insufficient, check in history for context, and if you still can't generate an SQL query just tell this code "qnp69".
      `

      const result = await model.generateContent(llm_prompt)
      let llm_response = result.response.text()
      let cleanedQuery = llm_response.replace(/`/g, '')
      cleanedQuery = cleanedQuery.replace(/\bsql\b/i, '')

      // Send the query to our API route
      const apiResponse = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanedQuery }),
      })

      const data = await apiResponse.json()

      if (data.message) {
        // Handle no data found
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: `Query: ${cleanedQuery}\n\nResult: No data found` }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: ` ${JSON.stringify(data, null, 2)}` }
        ])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error processing your request.' }])
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full p-6" size="icon">
          <MessageCircle className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chat with your Expense Tracker</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[50vh] w-full pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-center">Thinking...</div>}
        </ScrollArea>
        <div className="flex items-center mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your expenses..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} className="ml-2" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
