import Peer from 'peerjs'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PeerStore {
  getPeer: () => Peer
  localPeerId: string
  setLocalPeerId: (id: string) => void
}

const usePeerStore = create(
  immer<PeerStore>((set, get) => {
    return {
      getPeer: () => peer,
      localPeerId: '',
      setLocalPeerId(id) {
        set((store) => {
          store.localPeerId = id
        })
      },
    }
  }),
)

const peer = new Peer()
const store = usePeerStore.getState()
const onOpen = (id: string) => {
  store.setLocalPeerId(id)
  console.log('connection open ==========>', id)
}
const onDisconnected = () => {
  peer.reconnect()
}
peer.on('open', onOpen)
peer.on('disconnected', onDisconnected)

export default usePeerStore
