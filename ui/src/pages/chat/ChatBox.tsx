// import styled from 'styled-components/macro'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import React from 'react'

import { ChatHistory, useChat } from './useChat'

const ChatBoxContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 10px;
  overflow-y: auto;

  flex: 1;
`
const ChatPad = styled.div`
  flex: 1;
`

const ChatMessage = styled.div`
  padding: 4px 8px;
  border-radius: 10px;
  margin-bottom: 10px;
  text-align: left;
  font-size: 1.5em;
`

const ChatMessageSent = styled(ChatMessage)`
  background-color: #4a575b;
  justify-content: flex-start;
  margin-inline-end: 15%;
`

const ChatMessageReceived = styled(ChatMessage)`
  background-color: #3367f9;
  color: white;
  justify-content: flex-end;
  margin-inline-start: 15%;
  text-align: left;
`

const InputForm = styled.form`
  display: flex;
  width: 100%;
  padding: 10px;
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-right: 10px;
`

const Button = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: var(--accent-bg-color);
  color: var(--main-fg-color);
`

export function ChatBox({
  chatId,
  init,
}: {
  chatId: string
  init: ChatHistory[]
}) {
  const [messages, sendMessage] = useChat(chatId, init)
  const [newMessageText, setNewMessageText] = useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // scroll to bottom of chat
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(newMessageText)
    setNewMessageText('')
  }

  return (
    <ChatBoxContainer>
      <ChatArea ref={scrollRef}>
        <ChatPad></ChatPad>
        {messages.map((message) => {
          if (message.role === 'assistant') {
            return (
              <ChatMessageSent key={message.content}>
                {message.content}
              </ChatMessageSent>
            )
          } else if (message.role === 'user') {
            return (
              <ChatMessageReceived key={message.content}>
                {message.content}
              </ChatMessageReceived>
            )
          } else {
            return null
          }
        })}
      </ChatArea>
      <InputForm onSubmit={handleSend}>
        <Input
          placeholder="Type a message..."
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </InputForm>
    </ChatBoxContainer>
  )
}
