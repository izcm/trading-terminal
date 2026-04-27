import { useEffect, useLayoutEffect, useRef } from 'react'

import type { TabResource } from '../../tab-config'

export type AddItem = <K extends keyof TabResource>(tab: K, item: TabResource[K]) => void
export type UpdateItem = <K extends keyof TabResource>(
  tab: K,
  id: string,
  updater: (item: TabResource[K]) => TabResource[K]
) => void

export type WsSubProps = {
  addItem: AddItem
  updateItem: UpdateItem
}

export function useWsSub(
  { addItem, updateItem }: WsSubProps,
  subscribe: (addItem: AddItem, updateItem: UpdateItem) => Array<() => void>
) {
  // note to self: addItem (addItemAndMarkFresh) has a lot of dependencies
  // dont touch this!!

  // subscription stability is useWsSub's responsibility
  // refs keep addItem / updateItem fresh without triggering re-subscription
  const addItemRef = useRef(addItem)
  const updateItemRef = useRef(updateItem)

  useLayoutEffect(() => {
    addItemRef.current = addItem
    updateItemRef.current = updateItem
  }, [addItem, updateItem])

  useEffect(() => {
    const offs = subscribe(
      (...args) => addItemRef.current(...args),
      (...args) => updateItemRef.current(...args)
    )
    return () => offs.forEach(off => off())
  }, [subscribe])
}
