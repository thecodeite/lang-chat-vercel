// import styled from 'styled-components/macro'
import styled from 'styled-components'
import { ReactNode, useEffect, useState } from 'react'
import React from 'react'
import { FaUser, FaRobot, FaExclamationTriangle } from 'react-icons/fa'

import { useChat } from './useChat'
import { ButtonWithOptions } from '../../components/atoms/button-with-options/ButtonWithOptions'
import { ChatRole } from '../../helpers/api-client'

const ChatBoxContainer = styled.div`
  height: calc(100% - 50px);
  //height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-width: 600px;
  margin: 0 auto;
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

interface ChatStyle {
  color: Record<ChatRole, string>
  backgroundColor: Record<ChatRole, string>
  pos: Record<ChatRole, 'left' | 'center' | 'right'>
}

const c: ChatStyle = {
  color: {
    assistant: 'white',
    user: 'black',
    system: 'black',
  },
  backgroundColor: {
    assistant: '#4a575b',
    user: '#3367f9',
    system: '#ffffff',
  },
  pos: {
    assistant: 'left',
    user: 'right',
    system: 'center',
  },
}

const ChatMessageWrapper = styled.div<{ $role: ChatRole }>`
  padding: 4px 8px;
  border-radius: 10px;
  margin-bottom: 10px;
  text-align: left;
  font-size: 1em;

  color: ${(props) => c.color[props.$role]};
  background-color: ${(props) => c.backgroundColor[props.$role]};
  justify-content: ${(props) => {
    const pos = c.pos[props.$role]
    if (pos === 'center') return 'center'
    if (pos === 'left') return 'flex-start'
    return 'flex-end'
  }};

  margin-inline-start: ${(props) =>
    c.pos[props.$role] === 'left' ? '15%' : '0'};
  margin-inline-end: ${(props) =>
    c.pos[props.$role] === 'right' ? '15%' : '0'};
`

const ChatMessageText = styled.span``

const UnderChat = styled.div`
  height: 44px;
`

const InputForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  background-color: #ffffff10;
  backdrop-filter: blur(10px);
  border-radius: 5px;
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-right: 10px;
  font-size: 16px;
`

export function ChatBox({ chatId }: { chatId: string }) {
  const [messages, sendMessage, messagePending, isReady, restart] =
    useChat(chatId)
  const [newMessageText, setNewMessageText] = useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // scroll to bottom of chat

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 999999
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isReady) return

    e.preventDefault()
    setNewMessageText('')
    const success = await sendMessage(newMessageText)
    if (!success) {
      setNewMessageText(newMessageText)
    }
  }

  const restartChat = async () => {
    if (!isReady) return
    restart()
  }

  return (
    <ChatBoxContainer ref={scrollRef}>
      <ChatArea>
        <ChatPad></ChatPad>
        <ChatMessages>
          {messages.map((message) => (
            <ChatMessage key={message.content} $role={message.role}>
              {message.content}
            </ChatMessage>
          ))}
          {messagePending && (
            <ChatMessage $role="assistant">
              <Dots />
            </ChatMessage>
          )}
          {/* {!isReady && (
            <ChatMessage $role="system">
              Just checking cache <Dots />
            </ChatMessage>
          )} */}
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
          disabled={!isReady}
          type="submit"
          options={[
            {
              label: 'Restart chat',
              onClick: () => {
                restartChat()
              },
            },
          ]}
        >
          {isReady ? 'Send' : '-Send-'}
        </ButtonWithOptions>
      </InputForm>
    </ChatBoxContainer>
  )
}

function ChatMessage({
  children,
  $role,
}: {
  children: ReactNode
  $role: ChatRole
}) {
  return (
    <ChatMessageWrapper $role={$role}>
      {$role === 'assistant' && <FaRobot />}
      {$role === 'user' && <FaUser />}
      {$role === 'system' && <FaExclamationTriangle />}
      <ChatMessageText> {children}</ChatMessageText>
    </ChatMessageWrapper>
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
    <span>
      {' '}
      {Array.from({ length: dots }).map((_, i) => (
        <span key={i}>.</span>
      ))}
    </span>
  )
}
