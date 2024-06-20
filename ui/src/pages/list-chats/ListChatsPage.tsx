import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavTo } from '../../helpers/navTo'

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
  background-color: var(--main-bg-color);
  border: none;
  border-radius: 10px;
  text-align: left;
  width: 100%;
  cursor: pointer;
`

export function ListChatsPage() {
  const navTo = useNavTo()
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
          <ChatItem key={chat.id}>
            <ChatButton
              onClick={() => {
                navTo('Chat', chat.id)
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
