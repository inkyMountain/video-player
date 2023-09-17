import Peer, { DataConnection } from 'peerjs'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PeerStore {
  getPeer: () => Peer
  localPeerId: string
  setLocalPeerId: (id: string) => void
  dataConnection: undefined | DataConnection
  setDataConnection: (connection: DataConnection) => void
}

const usePeerStore = create(
  immer<PeerStore>((set) => {
    return {
      getPeer: () => peer,
      // getPeer: () => {
      //   return {}
      // },
      localPeerId: '',
      setLocalPeerId(id) {
        set((store) => {
          store.localPeerId = id
        })
      },
      setDataConnection(connection) {
        set((store) => {
          store.dataConnection = connection
        })
      },
      dataConnection: undefined,
    }
  }),
)

const peer = new Peer()
const store = usePeerStore.getState()
const onOpen = (id: string) => {
  store.setLocalPeerId(id)
  console.log('信令服务器连接建立成功', id)
}
const onDisconnected = () => {
  peer.reconnect()
}
const onError = (error: Error) => {
  // const errorWithType = error as PeerJSError
  // errorWithType.type === PeerErrorType.WebRTC
  console.log('peerjs 错误', error)
}
peer.on('open', onOpen)
peer.on('disconnected', onDisconnected)
peer.on('error', onError)
// 监听远方的数据连接。
peer.on('connection', (connection) => {
  console.log('开始监听数据连接')
  // 远方向我们发起数据连接时，会触发 connection 事件。
  // 把连接对象保存到store中。
  store.setDataConnection(connection)
  // connection 事件触发时，连接还没建立。需要等连接打开，
  // 触发 open 事件，连接才算是可用。
  connection.once('open', () => {
    console.log('数据连接建立成功')
    // 发送一个你好，测试是否能成功发送消息。
    connection.send('你好')
  })
})

// type PeerJSError = Error & { type: PeerErrorType }

export default usePeerStore
