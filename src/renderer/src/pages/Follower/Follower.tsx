import React, { Fragment, useEffect, useRef, useState } from 'react'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { useMemoizedFn } from 'ahooks'
import { createEmptyMediaStream } from '@renderer/utils/peer'
import usePeerStore from '@renderer/store/peerStore'
import { useSearchParams } from 'react-router-dom'
import './Follower.scss'

// const peer = new Peer()
// peer.connect()

interface IProps {}

const Follower: React.FunctionComponent<IProps> = (props) => {
  const [params, setSearchParams] = useSearchParams()
  const peerStore = usePeerStore()
  const searchParams = Object.fromEntries(params) as { remotePeerId: string }
  useEffect(() => {
    const remotePeerId = searchParams.remotePeerId
    if (!remotePeerId) {
      return
    }
    connectPeer(remotePeerId)
      .then(() => {
        setSearchParams((prev) => {
          prev.delete('remotePeerId')
          return prev
        })
        console.log('连接成功!')
      })
      .catch(() => {})
  }, [])

  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null!)

  const [peerIdInputValue, setPeerIdInputValue] = useState('')
  const connectPeer = useMemoizedFn((remotePeerId: string) => {
    return new Promise<void>((resolve, reject) => {
      const call = peerStore
        .getPeer()
        .call(remotePeerId, createEmptyMediaStream())
      call.once('stream', (stream) => {
        console.log('remoteStream', stream)
        videoRef.current.srcObject = stream
        resolve()
      })
      call.once('error', (error) => {
        console.log('远端连接发生错误', error)
        reject()
      })
      call.once('close', () => {
        console.log('远端连接关闭')
        reject()
      })
    })
  })

  useEffect(() => {
    document.title = '跟随者'
  }, [])

  return (
    <div className="follower">
      <div className="nav-wrapper">
        <NavigationBar />
      </div>
      <Fragment>
        {/* <label>
          请输入对方的分享id：
          <input
            onKeyDown={(event) => {
              const isEnter = event.key.toLowerCase() === 'enter'
              if (!isEnter) {
                return
              }
              connectPeer(peerIdInputValue)
            }}
            value={peerIdInputValue}
            onChange={(event) => {
              setPeerIdInputValue(event.currentTarget.value)
            }}
          />
        </label>
        <button
          onClick={() => {
            connectPeer(peerIdInputValue)
          }}
        >
          加入
        </button> */}
      </Fragment>
      <video className="follower-video" ref={videoRef} autoPlay></video>
    </div>
  )
}

export default Follower
