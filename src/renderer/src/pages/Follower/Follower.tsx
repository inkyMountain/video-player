import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Peer } from 'peerjs'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { useMemoizedFn } from 'ahooks'
import { error } from 'console'
import { createEmptyMediaStream } from '@renderer/utils/peer'

// const peer = new Peer()
// peer.connect()

interface IProps {}

const Follower: React.FunctionComponent<IProps> = (props) => {
  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null!)
  const peer = useRef<Peer>(null!)
  // const peerId = useRef<string>()
  const [localPeerId, setLocalPeerId] = useState<string>()
  if (!peer.current) {
    peer.current = new Peer()
    // peer.current = new Peer('follower-b161dda5-5521-419f-8bb9-cfcff0934b41')
    peer.current.once('open', (id) => {
      setLocalPeerId(id)
    })
    peer.current.on('error', (error) => {
      console.error('peerjs出错', error)
    })
  }

  const [peerIdInputValue, setPeerIdInputValue] = useState('')
  const onEnterPeer = useMemoizedFn(() => {
    console.log('点击共享')
    const call = peer.current?.call(peerIdInputValue, createEmptyMediaStream())
    call.on('stream', (s) => {
      console.log('remoteStream ===========>', s)
      videoRef.current.srcObject = s
    })
    call.on('error', (error) => {
      console.log('error ===========>', error)
    })
    call.on('close', () => {
      console.log('close')
    })
  })

  return (
    <div className="follower">
      <NavigationBar />
      <Fragment>
        <label>
          请输入对方的分享id：
          <input
            onKeyDown={(event) => {
              const isEnter = event.key.toLowerCase() === 'enter'
              if (!isEnter) {
                return
              }
              onEnterPeer()
            }}
            value={peerIdInputValue}
            onChange={(event) => {
              setPeerIdInputValue(event.currentTarget.value)
            }}
          />
        </label>
        <button onClick={onEnterPeer}>加入</button>
      </Fragment>
      <video ref={videoRef} autoPlay></video>
    </div>
  )
}

export default Follower
