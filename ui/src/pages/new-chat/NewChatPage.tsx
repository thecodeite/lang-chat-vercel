import styled from 'styled-components'
import { useNavTo } from '../../helpers/navTo'
import { useState } from 'react'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const RandomChatButton = styled.button`
  color: var(--main-fg-color);
  background-color: var(--accent-bg-color);
  border: none;
  border-radius: 4px;

  cursor: pointer;
  font-size: 32px;
`

export function NewChatPage() {
  const navTo = useNavTo()
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const createChat = () => {
    setButtonDisabled(true)
    fetch('/api/start-chat', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        navTo('Chat', data.chat.id)
      })
      .finally(() => {
        setButtonDisabled(false)
      })
  }

  return (
    <ButtonContainer>
      <RandomChatButton onClick={createChat} disabled={buttonDisabled}>
        Start Random chat
      </RandomChatButton>
    </ButtonContainer>
  )
}
