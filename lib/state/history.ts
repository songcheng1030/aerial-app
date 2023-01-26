import * as React from 'react'
import { Random } from '../random'

export interface IHistory {
  id: string
  user: string
  action: HistoryAction
  date: Date
}

export const users = ['Magaret Hamilton', 'John von Neuman', 'Katherine Johnson']

const historyActions = ['Uploaded', 'Edited', 'Voided'] as const
type HistoryAction = typeof historyActions[number]

const random = new Random(3)
const rawHistory: IHistory[] = [...Array(100)]
  .map(() => ({
    id: random.randomString(20),
    user: random.choose(users),
    action: random.choose(historyActions),
    date: random.randomTime(new Date(2021, 0, 1), new Date(2021, 11, 31)),
  }))
  .sort((a, b) => a.date.getTime() - b.date.getTime())

function useController<T>(initial: T | null = null) {
  const [value, setValue] = React.useState<T | null>(initial)
  const [touched, setTouched] = React.useState(false)
  const onChange: React.Dispatch<React.SetStateAction<T | null>> = (value_) => {
    setValue(value_)
    setTouched(true)
  }
  return {
    value,
    onChange,
    touched,
    setTouched,
    formProps: {
      value,
      onChange,
    },
  }
}

const useLimit = (initialLimit = 10) => {
  const [limit, setLimit] = React.useState(initialLimit)
  const increaseLimit = React.useCallback(() => setLimit((value) => value + 10), [])
  const clearLimit = React.useCallback(() => setLimit(initialLimit), [initialLimit])
  return {
    limit,
    increaseLimit,
    clearLimit,
  }
}

export const useSearchController = () => {
  const user = useController<string>()
  const action = useController<string>()
  const start = useController<Date>()
  const end = useController<Date>()
  const controllers = React.useMemo(() => [user, action, start, end], [user, action, start, end])

  const touched = controllers.some((c) => c.touched)
  const clearTouched = React.useCallback(
    () => controllers.forEach((c) => c.setTouched(false)),
    [controllers]
  )

  const { limit, increaseLimit, clearLimit } = useLimit()
  const [more, setMore] = React.useState(true)

  const filter = React.useCallback(
    (history: IHistory[]): IHistory[] =>
      history.filter((h) => {
        if (user.value != null && user.value !== h.user) return false
        if (action.value != null && action.value !== h.action) return false
        if (start.value != null && start.value > h.date) return false
        if (end.value != null && end.value < h.date) return false
        return true
      }),
    [user, action, start, end]
  )

  const [filteredHistory, _setFilteredHistory] = React.useState<IHistory[]>(rawHistory)
  const setFilterHistory = React.useCallback(() => {
    const history = filter(rawHistory)
    setMore(history.length > limit)
    _setFilteredHistory(history)
    clearTouched()
    clearLimit()
  }, [filter, clearTouched, clearLimit, limit])

  const history = filteredHistory.slice(0, limit)

  return {
    user,
    action,
    start,
    end,
    history,
    touched,
    increaseLimit,
    setFilterHistory,
    clear: (): void => {
      user.onChange(null)
      action.onChange(null)
      start.onChange(null)
      end.onChange(null)
      clearLimit()
      clearTouched()
    },
    more,
  }
}
