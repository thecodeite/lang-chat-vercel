import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function NewChat() {
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/start-chat', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(`/chat/${data.chat.id}`)
      })
  }, [navigate])

  return (
    <div>
      <h1>Starting New Chat</h1>
    </div>
  )
}
