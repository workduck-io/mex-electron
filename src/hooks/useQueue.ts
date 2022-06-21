import { mog } from '@utils/lib/helper'
import { useState, useEffect, useReducer } from 'react'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type Job = {
  task?: () => void | Promise<void>
}

type JobQueueProps = {
  isQueueEnabled: boolean
  setIsQueueEnabled?: (status: boolean) => void

  jobs: Array<Job>
  setJobs?: (jobs: Array<Job>) => void
  addJobInQueue: (job: Job) => void
  nextJobInQueue: () => Job | undefined
  emptyQueue: () => void
}

export const useJobQueueStore = create<JobQueueProps>(
  persist(
    devtools((set, get) => ({
      isQueueEnabled: false,
      setIsQueueEnabled: (status: boolean) => set({ isQueueEnabled: status }),

      jobs: [],
      setJobs: (jobs: Array<Job>) => set({ jobs }),
      addJobInQueue: (job: Job) => {
        const jobs = get().jobs

        set({ jobs: [...jobs, job] })
      },
      nextJobInQueue: () => {
        const jobs = get().jobs

        if (jobs.length > 0) {
          const [first, ...next] = jobs
          set({ jobs: next })
        }

        return undefined
      },
      emptyQueue: () => set({ jobs: [] })
    })),
    {
      name: 'job-queue-store'
    }
  )
)

export const useJobQueue = () => {
  const jobs = useJobQueueStore((store) => store.jobs)
  const isQueueEnabled = useJobQueueStore((store) => store.isQueueEnabled)
  const setIsQueueEnabled = useJobQueueStore((store) => store.setIsQueueEnabled)

  const nextJobInQueue = useJobQueueStore((store) => store.nextJobInQueue)
  const [isExecutingTask, setIsExecutingTask] = useState(false)

  useEffect(() => {
    const func = async () => {
      if (jobs.length > 0 && !isExecutingTask && isQueueEnabled) {
        setIsExecutingTask(true)
        const job = jobs[0]

        await job?.task()
        nextJobInQueue()

        if (jobs.length === 0) {
          mog('Job Queue is empty')
        }

        setIsExecutingTask(false)
      }
    }

    func()
  }, [jobs, isExecutingTask, isQueueEnabled])

  return { isExecutingTask, setIsQueueEnabled }
}
