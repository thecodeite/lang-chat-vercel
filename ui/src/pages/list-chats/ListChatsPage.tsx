import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

interface ExistingChat {
  id: string
  owner: string
  created: string
  summary: string
  chat: string
}

const ListOfChats = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const ChatItem = styled.li`
  width: 100%;
  @media (min-width: 768px) {
    width: 300px;
  }

  margin: 8px;
`

const ChatButton = styled.button`
  color: var(--main-fg-color);
  background-color: var(--accent-bg-color);
  border: none;
  border-radius: 10px;
  text-align: left;
  width: 100%;
  cursor: pointer;
`

export function ListChatsPage() {
  const navigate = useNavigate()
  const [chats, setChats] = useState<ExistingChat[]>([])

  useEffect(() => {
    fetch('/api/list-chats')
      .then((res) => res.json())
      .then((data) => {
        setChats(data.chats)
      })
  }, [])

  return (
    <div>
      <ListOfChats>
        {chats.map((chat) => (
          <ChatItem>
            <ChatButton
              onClick={() => {
                navigate('/chat/' + chat.id)
              }}
            >
              <h3>Question: {chat.summary}</h3>
              <p>Length: {chat.chat.length}</p>
              <h4>Created: {chat.created} </h4>
            </ChatButton>
          </ChatItem>
        ))}
      </ListOfChats>
    </div>
  )
}
