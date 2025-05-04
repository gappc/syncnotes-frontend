import type { StoreShape } from '@/modules/notes/types'
import { getYjsDoc, getYjsValue, syncedStore, Y } from '@syncedstore/core'
import { WebsocketProvider } from 'y-websocket'

const shape: StoreShape = {
  notes: [],
}

// Create your SyncedStore store
export const store = syncedStore(shape)

export const createUndoManager = <T = unknown>(value: T) => {
  const yjsValue = getYjsValue(value) as Y.AbstractType<T>
  return new Y.UndoManager(yjsValue)
}

export const undoManager = createUndoManager(store.notes)

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsDoc(store)

// Configure WebSockets
const wsProvider = new WebsocketProvider(import.meta.env.VITE_WEBSOCKET_URL, 'syncnotes', doc)

wsProvider.on('status', (event) => {
  console.log(event.status)
})
