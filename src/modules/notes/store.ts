import type { StoreShape } from '@/modules/notes/types'
import { getYjsDoc, getYjsValue, syncedStore, Y } from '@syncedstore/core'
import { HocuspocusProvider } from '@hocuspocus/provider'

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

const documentName = 'syncnotes'

// Connect to the Hocuspocus sync server. The server ignores the URL path,
// but appending the document name keeps the same request path y-websocket
// used, so an existing reverse proxy config keeps working.
const wsProvider = new HocuspocusProvider({
  url: `${import.meta.env.VITE_WEBSOCKET_URL}/${documentName}`,
  name: documentName,
  document: doc,
})

wsProvider.on('status', (event: { status: string }) => {
  console.log(event.status)
})
