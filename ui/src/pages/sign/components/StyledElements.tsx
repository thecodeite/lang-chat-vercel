import styled from 'styled-components'

export const InputGroup = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0;
  padding: 8px;
  border: 1px solid
    ${(p) => (p.$hasError ? 'var(--color-error)' : 'transparent')};
  border-radius: 4px;
`
export const InstructionsText = styled.p`
  font-size: 12px;
  margin: 0;
  padding: 0;
  color: var(--main-fg-color);
  margin-bottom: 16px;
`

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  padding: 0;
  line-height: 1;
`
export const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--main-border-color);
  background-color: var(--main-bg-color);
  color: var(--main-fg-color);
  width: 100%;
  font-size: 16px;
`
export const SignInButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: var(--accent-fg-color);
  color: var(--main-fg-color);
  cursor: pointer;
`
export const HeaderTabInactive = styled.button`
  flex: 1;
  padding: 0;
  margin: 0;
  padding: 8px 24px;
  font-weight: bold;
  font-size: 20px;
  border-radius: 8px 8px 0 0;
  border: 0;
  color: var(--disabled-fg-color);
  background-color: var(--disabled-bg-color);
  text-align: center;
  border-bottom: 1px solid var(--main-border-color);
`
export const HeaderTab = styled.div`
  flex: 1;
  padding: 0;
  margin: 0;
  padding: 8px 24px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  border-bottom: 1px solid var(--main-border-color);
`
export const HeaderTabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  margin: -20px -20px 20px -20px;
`
