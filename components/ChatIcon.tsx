import { MessageCircle } from 'lucide-react'

export function ChatIcon() {
  return (
    <div 
      className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-5 cursor-pointer shadow-lg flex items-center justify-center"
      style={{ width: '80px', height: '80px' }}
    >
      <MessageCircle size={80} />
    </div>
  )
}
