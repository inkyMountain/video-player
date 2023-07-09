import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Peer } from 'peerjs'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { useMemoizedFn } from 'ahooks'
import { error } from 'console'
import { createEmptyMediaStream } from '@renderer/utils/peer'
import usePeerStore from '@renderer/store/peerStore'

// const peer = new Peer()
// peer.connect()

interface IProps {}

const Follower: React.FunctionComponent<IProps> = (props) => {
  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null!)
  const peerStore = usePeerStore()

  const [peerIdInputValue, setPeerIdInputValue] = useState('')
  const onEnterPeer = useMemoizedFn(() => {
    const call = peerStore
      .getPeer()
      .call(peerIdInputValue, createEmptyMediaStream())
    call.on('stream', (stream) => {
      console.log('remoteStream', stream)
      videoRef.current.srcObject = stream
    })
    call.on('error', (error) => {
      console.log('远端连接发生错误', error)
    })
    call.on('close', () => {
      console.log('远端连接关闭')
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
