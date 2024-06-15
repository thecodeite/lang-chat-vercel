import { useState } from 'react'
import styled from 'styled-components'

interface Option {
  label: string
  onClick: () => void
}

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ButtonBase = styled.button`
  height: 40px;
  border: none;

  color: white;
  font-size: 1em;

  background-color: var(--accent-bg-color);
  color: var(--main-fg-color);
  padding: 10px;
  cursor: pointer;
`

const ButtonMain = styled(ButtonBase)`
  border-radius: 5px 0 0 5px;
  border-right: 1px solid var(--main-border-color);
`

const ButtonOptions = styled(ButtonBase)`
  border-radius: 0 5px 5px 0;
`

const OptionsMenu = styled.div`
  position: absolute;
  bottom: 42px;
  border-radius: 5px;
  min-width: 100%;
  width: max-content;
  right: 0;

  background-color: var(--alt-bg-color);
  border: 1px solid var(--main-border-color);
  display: flex;
  flex-direction: column;
`

const OptionItem = styled.button`
  padding: 10px;
  margin: 2px;

  color: var(--main-bg-color);
  cursor: pointer;
  background-color: var(--main-fg-color);
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: var(--accent-bg-color);
    color: var(--main-fg-color);
  }
`

// Inherit intrinsic props from react button
interface ButtonWithOptionsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: Option[]
}

export function ButtonWithOptions({
  options,
  children,
  ...rest
}: ButtonWithOptionsProps) {
  const [optionsOpen, setOptionsOpen] = useState(false)

  return (
    <ButtonContainer>
      <ButtonMain {...rest}>{children}</ButtonMain>
      <ButtonOptions onClick={() => setOptionsOpen((b) => !b)}>
        {optionsOpen ? '▲' : '▼'}
      </ButtonOptions>
      {optionsOpen && (
        <OptionsMenu>
          {options.map((option) => (
            <OptionItem
              key={option.label}
              onClick={() => {
                setOptionsOpen(false)
                option.onClick()
              }}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsMenu>
      )}
    </ButtonContainer>
  )
}
