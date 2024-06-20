import React, { useEffect, useState } from 'react'
import { AllChatList, fetchAllChats } from '../../helpers/api-client'
import styled from 'styled-components'
import { useNavTo } from '../../helpers/navTo'

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 1rem;

  th {
    background-color: var(--main-bg-color);
    color: var(--main-text-color);
    font-weight: normal;
    padding: 0.5rem;
    text-align: left;
  }

  tr {
    &:hover {
      td {
        background-color: var(--accent-bg-color);
      }
    }
  }

  td {
    border-top: 1px solid var(--main-border-color);
    padding: 0.5rem;
    background-color: var(--main-bg-color);
    cursor: pointer;
  }
`

export function ChatAdminPage() {
  const [data, setData] = useState<AllChatList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navTo = useNavTo()

  useEffect(() => {
    // Make the API call to fetch the data
    const fetchData = async () => {
      try {
        // Replace 'apiEndpoint' with the actual API endpoint

        const allChats = await fetchAllChats()
        setData(allChats)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Created</th>
              <th>Summary</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} onClick={() => navTo('ChatAdminDetail', item.id)}>
                <td>{item.name || 'Unknown'}</td>
                <td>{item.created}</td>
                <td>{item.summary}</td>
                <td>{firstLine(item.instructions)}</td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  )
}

function firstLine(text: string) {
  const newlineIndex = text.indexOf('\n')
  return newlineIndex === -1 ? text : text.slice(0, newlineIndex) + ' ...'
}
