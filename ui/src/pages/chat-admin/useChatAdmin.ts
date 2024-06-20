import { useEffect, useState } from 'react'
import {
  SingleChat,
  fetchSingleChat,
  putSingleChatProperty,
} from '../../helpers/api-client'

export function useChatAdmin(chatId: string | undefined) {
  const [chat, setChat] = useState<SingleChat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!chatId) {
      return
    }
    // Make the API call to fetch the data
    const fetchData = async () => {
      try {
        // Replace 'apiEndpoint' with the actual API endpoint

        const chat = await fetchSingleChat(chatId)
        setChat(clean(chat))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [chatId])

  const saveChange = async (
    field: 'summary' | 'instructions',
    value: string,
  ) => {
    if (!chat || !chatId) {
      return
    }

    console.log('chat:', chat)

    try {
      await putSingleChatProperty(chatId, field, value)
      const newChat = { ...chat, [field]: value }
      setChat(newChat)
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  return [chat, isLoading, saveChange] as const
}

function clean(singleChat: SingleChat): SingleChat {
  return {
    ...singleChat,
    instructions: singleChat.instructions.replace(/\n */g, '\n'),
  }
}
