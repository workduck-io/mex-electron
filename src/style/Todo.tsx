import styled from 'styled-components'
import { TodoContainer } from '../ui/components/Todo.style'

/*
 * Todos
 *
 * react-kanban-board
react-kanban-card
react-kanban-card-skeleton
react-kanban-card--dragging
react-kanban-card__description
react-kanban-card__title
react-kanban-column
react-kanban-card-adder-form
react-kanban-card-adder-button
react-kanban-card-adder-form__title
react-kanban-card-adder-form__description
react-kanban-card-adder-form__button
react-kanban-column-header
react-kanban-column-header__button
react-kanban-column-adder-button
 */

export const StyledTasksKanban = styled.div`
  .react-kanban-column {
    width: calc((100vw - 12rem) / 3);
    background: ${({ theme }) => theme.colors.gray[9]};
    padding: ${({ theme }) => theme.spacing.small};
    margin: ${({ theme }) => theme.spacing.small};
    ${TodoContainer} {
      margin: ${({ theme }) => theme.spacing.small} 0;
      width: calc((100vw - 14rem) / 3);
    }
  }
`
