// import styled from 'styled-components/macro'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import React from 'react'

import { ChatHistory, useChat } from './useChat'
import { ButtonWithOptions } from '../../components/atoms/button-with-options/ButtonWithOptions'

const ChatBoxContainer = styled.div`
  height: calc(100% - 50px);
  //height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 10px;

  flex: 1;
`
const ChatPad = styled.div`
  flex: 1;
`

const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
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

const UnderChat = styled.div`
  height: 40px;
`

const InputForm = styled.form`
  display: flex;
  width: 100%;
  padding: 10px;
  position: fixed;
  bottom: 0;
  background-color: #ffffff10;
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-right: 10px;
  font-size: 16px;
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
  const [messages, sendMessage, messagePending] = useChat(chatId, init)
  const [newMessageText, setNewMessageText] = useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // scroll to bottom of chat

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 999999
    }
  }, [messages])

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(newMessageText)
    setNewMessageText('')
  }

  return (
    <ChatBoxContainer ref={scrollRef}>
      <ChatArea>
        <ChatPad></ChatPad>
        <ChatMessages>
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
          {messagePending && (
            <ChatMessageSent>
              <Dots />
            </ChatMessageSent>
          )}
        </ChatMessages>
        <UnderChat />
      </ChatArea>
      <InputForm onSubmit={handleSend}>
        <Input
          placeholder="Type a message..."
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <ButtonWithOptions
          type="submit"
          options={[
            {
              label: 'Restart chat',
              onClick: () => {
                console.log('Option 1 clicked')
              },
            },
          ]}
        >
          Send
        </ButtonWithOptions>
      </InputForm>
    </ChatBoxContainer>
  )
}

function Dots() {
  const [dots, setDots] = useState(1)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots % 3) + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return (
    <div>
      {' '}
      {Array.from({ length: dots }).map((_, i) => (
        <span key={i}>.</span>
      ))}
    </div>
  )
}
