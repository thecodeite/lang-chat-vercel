import { useState } from 'react'
import { SingleChat } from '../../helpers/api-client'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { LinkTo } from '../../components/LinkTo'
import { useChatAdmin } from './useChatAdmin'

const Page = styled.div`
  margin: 1rem;
`

const TextArea = styled.textarea`
  width: calc(100% - 32px - 16px);
  height: 10rem;
  margin-left: 32px;
  margin-right: 16px;
`

const Input = styled.input`
  width: calc(100% - 32px - 16px);
  margin-left: 32px;
  margin-right: 16px;
`

const EditableAreaLabel = styled.label`
  font-size: 16px;
`

const EditableAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SaveButton = styled.button`
  background-color: var(--primary-action-color);
  color: var(--primary-action-contrast);
  border: none;
  border-radius: 4px;
  margin: 8px;
  padding: 0.5rem 1rem;
  margin-right: 1rem;

  align-self: flex-end;

  &:disabled {
    background-color: var(--primary-bg-color);
    color: var(--primary-fg-color);
  }
`

export function ChatAdminPageDetail() {
  const id = useParams().id

  const [chat, isLoading, saveChange] = useChatAdmin(id)

  return (
    <Page>
      <LinkTo toPage="ChatAdmin">{'<'} Back</LinkTo>
      {isLoading || chat === null ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>
            Chat by {chat.name || 'Unknown'} on {chat.created}
          </h1>

          <EditableArea
            label="Summary"
            value={chat.summary}
            setter={(value) => saveChange('summary', value)}
            control="input"
          />

          <EditableArea
            label="Instructions"
            value={chat.instructions}
            setter={(value) => saveChange('instructions', value)}
            control="textarea"
          />
        </div>
      )}
      <ChatReview chat={chat?.chat} />
    </Page>
  )
}

function EditableArea({
  label,
  value,
  setter,
  control,
}: {
  label: string
  value: string
  setter: (value: string) => Promise<void>
  control: 'input' | 'textarea'
}) {
  const [saving, setSaving] = useState(false)
  const [newValue, setNewValue] = useState<string | null>(null)
  const displayValue = newValue ?? value

  const save = async () => {
    if (newValue !== null) {
      setSaving(true)
      await setter(newValue)
      setSaving(false)
      setNewValue(null)
    }
  }
  const labelId = `editable-area-${label}`

  return (
    <EditableAreaContainer>
      <EditableAreaLabel htmlFor={labelId}>{label}</EditableAreaLabel>
      {control === 'input' ? (
        <Input
          id={labelId}
          value={displayValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
      ) : (
        <TextArea
          id={labelId}
          value={displayValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
      )}
      <SaveButton disabled={newValue === null || saving} onClick={save}>
        {saving ? 'Saving...' : 'Save'}
      </SaveButton>
    </EditableAreaContainer>
  )
}

function ChatReview({ chat }: { chat: SingleChat['chat'] | undefined }) {
  if (!chat) return ''

  return (
    <div>
      <h2>Chat Review</h2>
      <div>
        {chat.map((item, index) => (
          <div key={index}>
            <p>
              {item.role}: {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
