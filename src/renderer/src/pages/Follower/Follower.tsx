import React, { useEffect, useRef } from 'react'
import { Peer } from 'peerjs'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'

// const peer = new Peer()
// peer.connect()

interface IProps {}

const Follower: React.FunctionComponent<IProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null!)
  const peer = useRef<Peer>(null!)
  const peerId = useRef<string>()
  if (!peer.current) {
    // peer.current = new Peer()
    peer.current = new Peer('follower-b161dda5-5521-419f-8bb9-cfcff0934b41')
    peer.current.once('open', (id) => {
      peerId.current = id
    })
    peer.current.on('error', (error) => {
      console.error('peerjs出错', error)
    })
  }

  useEffect(() => {
    peer.current.on('call', (connection) => {
      console.log('on call')
      connection.answer()
      connection.on('stream', (remoteStream) => {
        console.log('on stream', remoteStream)
        videoRef.current.srcObject = remoteStream
        videoRef.current.play()
      })
    })
  }, [])

  return (
    <div className="follower">
      <NavigationBar />
      <video ref={videoRef}></video>
    </div>
  )
}

export default Follower
