import { transparentize } from 'polished'
import styled, { css, keyframes } from 'styled-components'

import { CompleteWave, WaterWave } from '../../components/mex/Onboarding/components/Welcome'
import { TodoStatus } from '../../editor/Components/Todo/types'

export const SkeletonLoader = (theme) => keyframes`
  from {
    background-color: ${transparentize(0.7, theme.colors.background.highlight)};
  }

  to {
    background-color: ${transparentize(0.5, theme.colors.background.highlight)};
  }
`

export const TodoContainer = styled.div<{ checked?: boolean, $loading?: boolean }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.tiny}

  ${({ theme, $loading}) => $loading && css`
    box-sizing: border-box;
    margin: ${({ theme }) => theme.spacing.tiny};
    padding: 0;
    border-radius: ${({ theme }) =>theme.borderRadius.tiny};
    animation: ${SkeletonLoader(theme)} 0.6s linear infinite alternate;
  `}

  ${({ theme, checked }) =>
    checked &&
    css`
      color: ${theme.colors.gray[5]};
      text-decoration: line-through;
    `}
`

export const TodoActionWrapper = styled.span`
  padding: 2px;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  background-color: ${({ theme }) => transparentize(0.8, theme.colors.secondary)};
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 0.5rem;
`

export const TodoActionButton = styled.button`
  padding: 1px 0.4rem;
  display: flex;
  align-items: center;
  border-radius: 1rem;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
`

export const StyledTodoStatus = styled.div<{ animate?: boolean; status: TodoStatus }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 1rem;
  width: 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.text.fade};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${(props) => props.theme.colors.background.highlight};
  overflow: hidden;

  ::before {
    content: '';
    position: absolute;
    border-radius: 40%;
    background-color: ${({ theme }) => theme.colors.primary};

    ${(props) => {
      switch (props.status) {
        case TodoStatus.todo:
          return css`
            transform: translateY(1.2rem);
          `
        case TodoStatus.pending:
          return props.animate
            ? css`
                animation: ${WaterWave} 0.25s ease-out;
                animation-fill-mode: forwards;
              `
            : css`
                transform: translateY(0.6rem) rotateZ(0deg);
              `
        case TodoStatus.completed:
          return props.animate
            ? css`
                animation: ${CompleteWave} 0.25s ease-out;
              `
            : css`
                transform: translateY(0rem) rotateZ(0deg);
              `
      }
    }}

    width: 1.2rem;
    height: 1.2rem;
  }
`

export const TodoOptions = styled.span`
  position: absolute;
  right: 0;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`

export const CheckBoxWrapper = styled.span`
  display: flex;
  padding: 0.3rem 0.3rem 0 0;
  user-select: none;
  justify-content: center;
  align-items: flex-start;

  input {
    width: 1rem;
    height: 1rem;
    margin: 0;
  }
`

export const TodoText = styled.span`
  max-width: calc(100% - 6rem);
  flex: 1;
  :focus {
    outline: none;
  }
`
