import Board from '@asseinfo/react-kanban'
import React, { useMemo } from 'react'
import create from 'zustand'
import ReminderUI from '../../../components/mex/Reminders/Reminder'
import { RemindersWrapper } from '../../../components/mex/Reminders/Reminders.style'
import SearchFilters from '../../../components/mex/Search/SearchFilters'
import { TodoType } from '../../../editor/Components/Todo/types'
import { FilterStore, SearchFilter } from '../../../hooks/useFilters'
import { ReminderBoardCard, useReminders, useReminderStore } from '../../../hooks/useReminders'
import { MainHeader, PageContainer } from '../../../style/Layouts'
import { Reminder } from '../../../types/reminders'
import { mog } from '../../../utils/lib/helper'
import { AllRemindersWrapper } from './RemindersAll.style'

interface AllReminderFilterStore extends FilterStore<Reminder> {
  addCurrentFilter: (filter: SearchFilter<Reminder>) => void
  removeCurrentFilter: (filter: SearchFilter<Reminder>) => void
  resetCurrentFilters: () => void
}

export const useReminderFilter = create<AllReminderFilterStore>((set, get) => ({
  currentFilters: [],
  setCurrentFilters: (filters) => set({ currentFilters: filters }),
  filters: [],
  setFilters: (filters) => set({ filters }),
  addCurrentFilter: (filter) => {
    set({ currentFilters: [...get().currentFilters, filter] })
  },
  removeCurrentFilter: (filter) => {
    set({ currentFilters: get().currentFilters.filter((f) => f.id !== filter.id) })
  },
  resetCurrentFilters: () => {
    set({ currentFilters: [] })
  }
}))

const RemindersAll = () => {
  const reminders = useReminderStore((s) => s.reminders)
  const addCurrentFilter = useReminderFilter((s) => s.addCurrentFilter)
  const removeCurrentFilter = useReminderFilter((s) => s.removeCurrentFilter)
  const resetCurrentFilters = useReminderFilter((s) => s.resetCurrentFilters)
  const filters = useReminderFilter((s) => s.currentFilters)
  const currentFilters = useReminderFilter((s) => s.currentFilters)

  const { getRemindersBoard } = useReminders()

  const board = useMemo(() => getRemindersBoard(), [currentFilters])

  const handleCardMove = (card, source, destination) => {
    mog('card moved', { card, source, destination })
    // changeStatus(card.todo, destination.toColumnId)
    // const newReminders = [...reminders]
    // const cardIndex = newReminders.findIndex((c) => c.id === card.id)
    // const cardToMove = newReminders[cardIndex]
    // newReminders.splice(cardIndex, 1)
    // newReminders.splice(to, 0, cardToMove)
    // addReminders(newReminders)
  }

  const RenderCard = ({ id, reminder }: ReminderBoardCard, { dragging }: { dragging: boolean }) => {
    // const pC = getPureContent(todo)
    // mog('RenderTodo', { id, todo, dragging })
    return (
      <ReminderUI
        // controls={activeOrSnoozedControls}
        key={`ReultForSearch_${reminder.id}_${id}`}
        reminder={reminder}
      />
    )
  }

  return (
    <PageContainer>
      <MainHeader>Reminders</MainHeader>
      <AllRemindersWrapper>
        <SearchFilters
          result={board}
          addCurrentFilter={addCurrentFilter}
          removeCurrentFilter={removeCurrentFilter}
          resetCurrentFilters={resetCurrentFilters}
          filters={filters}
          currentFilters={currentFilters}
        />
        <Board
          renderColumnHeader={({ title }) => <div>{title}</div>}
          disableColumnDrag
          onCardDragEnd={handleCardMove}
          renderCard={RenderCard}
        >
          {board}
        </Board>
        <RemindersWrapper>
          {reminders.map((reminder) => (
            <ReminderUI
              // controls={activeOrSnoozedControls}
              key={`ReultForSearch_${reminder.id}`}
              reminder={reminder}
            />
          ))}
        </RemindersWrapper>
      </AllRemindersWrapper>
    </PageContainer>
  )
}

export default RemindersAll
