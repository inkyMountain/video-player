import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IProps {}

const PlaylistDetail: React.FunctionComponent<IProps> = (props) => {
  const pathParams = useParams<{ folderPath: string }>()
  const navigate = useNavigate()

  console.log('pathParams ===========>', pathParams)
  return (
    <div className="playlist-detail">
      <div>{pathParams.folderPath}</div>
      <button
        onClick={() => {
          navigate(-1)
        }}
      >
        back
      </button>
    </div>
  )
}

export default PlaylistDetail
