import { useState, useEffect } from 'react'

import { mog } from '@utils/lib/mog'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type Job = {
  task: () => void | Promise<void>
  id: string
}

type JobQueueProps = {
  isQueueEnabled: boolean
  setIsQueueEnabled?: (status: boolean) => void

  jobs: Array<Job>
  setJobs?: (jobs: Array<Job>) => void
  addJobInQueue: (job: Job) => void
  nextJobInQueue: () => Job | undefined

  getIsJobsQueueEmpty: () => boolean
  emptyJobsQueue: () => void
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
      getIsJobsQueueEmpty: () => get().jobs.length === 0,
      emptyJobsQueue: () => set({ jobs: [] })
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

        try {
          await job?.task()
          nextJobInQueue()
        } catch (err) {
          mog('Unable to perform this Task')
        }

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
