"use client"

import { useState } from "react"
import { Search, X, Send, Paperclip, ChevronLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
  propertyId?: string
  propertyTitle?: string
}

type Conversation = {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantType: "agent" | "user"
  lastMessage: string
  lastMessageTimestamp: string
  unreadCount: number
  propertyId?: string
  propertyTitle?: string
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")

  // Mock data for conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      participantId: "agent1",
      participantName: "Ana Horvat",
      participantAvatar: "/placeholder.svg?height=200&width=200&text=Agent",
      participantType: "agent",
      lastMessage:
        "Poštovani, vezano za vaš upit o nekretnini u Splitu, mogu vam ponuditi termin za razgledavanje u petak u 14h. Javite mi odgovara li vam.",
      lastMessageTimestamp: "2025-03-12T14:30:00",
      unreadCount: 1,
      propertyId: "2",
      propertyTitle: "Luksuzna vila s bazenom",
    },
    {
      id: "2",
      participantId: "agent2",
      participantName: "Marko Marić",
      participantAvatar: "/placeholder.svg?height=200&width=200&text=Agent",
      participantType: "agent",
      lastMessage: "Hvala na upitu. Nekretnina je još uvijek dostupna. Kada biste željeli doći na razgledavanje?",
      lastMessageTimestamp: "2025-03-10T09:15:00",
      unreadCount: 2,
      propertyId: "1",
      propertyTitle: "Moderan stan u centru grada",
    },
    {
      id: "3",
      participantId: "user1",
      participantName: "Ivana Ivić",
      participantAvatar: "/placeholder.svg?height=200&width=200&text=User",
      participantType: "user",
      lastMessage: "Hvala na informacijama. Razmislit ću o ponudi i javiti vam se uskoro.",
      lastMessageTimestamp: "2025-03-05T16:45:00",
      unreadCount: 0,
    },
  ]

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conversation.propertyTitle && conversation.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mock messages for the selected conversation
  const getMessagesForConversation = (conversationId: string): Message[] => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (!conversation) return []

    // Generate mock messages
    return [
      {
        id: "msg1",
        senderId: "user",
        receiverId: conversation.participantId,
        content: `Pozdrav, zanima me nekretnina "${conversation.propertyTitle}". Je li još uvijek dostupna?`,
        timestamp: "2025-03-10T08:30:00",
        read: true,
        propertyId: conversation.propertyId,
        propertyTitle: conversation.propertyTitle,
      },
      {
        id: "msg2",
        senderId: conversation.participantId,
        receiverId: "user",
        content: "Pozdrav! Da, nekretnina je još uvijek dostupna. Kada biste željeli doći na razgledavanje?",
        timestamp: "2025-03-10T09:15:00",
        read: true,
      },
      {
        id: "msg3",
        senderId: "user",
        receiverId: conversation.participantId,
        content: "Odlično! Bi li bilo moguće ovaj petak poslijepodne?",
        timestamp: "2025-03-11T10:20:00",
        read: true,
      },
      {
        id: "msg4",
        senderId: conversation.participantId,
        receiverId: "user",
        content:
          "Poštovani, vezano za vaš upit o nekretnini, mogu vam ponuditi termin za razgledavanje u petak u 14h. Javite mi odgovara li vam.",
        timestamp: "2025-03-12T14:30:00",
        read: conversation.unreadCount === 0,
      },
    ]
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit" })
    }
    // If yesterday, show "Jučer"
    else if (date.toDateString() === yesterday.toDateString()) {
      return "Jučer"
    }
    // Otherwise show date
    else {
      return date.toLocaleDateString("hr-HR", { day: "numeric", month: "numeric" })
    }
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return
    // In a real app, this would send the message to the API
    console.log(`Sending message to conversation ${selectedConversation}: ${messageText}`)
    setMessageText("")
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Poruke</h1>
          <p className="text-muted-foreground">Upravljajte svojim porukama i upitima.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[300px_1fr] h-[600px]">
          {/* Conversation list - hide on mobile when a conversation is selected */}
          <div className={cn("border-r", selectedConversation && "hidden md:block")}>
            <div className="p-4 border-b">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pretraži poruke..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-65px)]">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nema pronađenih poruka</p>
                </div>
              ) : (
                <div>
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedConversation === conversation.id && "bg-gray-50",
                        conversation.unreadCount > 0 && "bg-rose-50 hover:bg-rose-50",
                      )}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={conversation.participantAvatar} alt={conversation.participantName} />
                          <AvatarFallback>
                            {conversation.participantName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{conversation.participantName}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessageTimestamp)}
                            </div>
                          </div>
                          {conversation.propertyTitle && (
                            <div className="text-xs text-muted-foreground truncate mb-1">
                              Re: {conversation.propertyTitle}
                            </div>
                          )}
                          <div className="text-sm truncate">{conversation.lastMessage}</div>
                          {conversation.unreadCount > 0 && (
                            <div className="mt-1">
                              <Badge className="bg-rose-400">{conversation.unreadCount} novih</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message view */}
          <div className={cn("flex flex-col", !selectedConversation && "hidden md:flex")}>
            {selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBackToList}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage
                      src={
                        conversations.find((c) => c.id === selectedConversation)?.participantAvatar ||
                        "/placeholder.svg"
                      }
                      alt={conversations.find((c) => c.id === selectedConversation)?.participantName || ""}
                    />
                    <AvatarFallback>
                      {(conversations.find((c) => c.id === selectedConversation)?.participantName || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {conversations.find((c) => c.id === selectedConversation)?.participantName}
                    </div>
                    {conversations.find((c) => c.id === selectedConversation)?.propertyTitle && (
                      <div className="text-xs text-muted-foreground">
                        Re: {conversations.find((c) => c.id === selectedConversation)?.propertyTitle}
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getMessagesForConversation(selectedConversation).map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.senderId === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.senderId === "user" ? "bg-rose-400 text-white" : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {message.propertyId && message.propertyTitle && (
                          <div className="mb-2 pb-2 border-b border-white/20">
                            <div className="text-xs font-medium">Upit za nekretninu:</div>
                            <div className="text-sm">{message.propertyTitle}</div>
                          </div>
                        )}
                        <div>{message.content}</div>
                        <div
                          className={cn(
                            "text-xs mt-1 text-right",
                            message.senderId === "user" ? "text-white/70" : "text-gray-500",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Napišite poruku..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button
                        className="h-10 w-10 bg-rose-400 hover:bg-rose-500"
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Odaberite razgovor</h3>
                  <p className="text-muted-foreground">Odaberite razgovor s lijeve strane za prikaz poruka.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
