import React, { CSSProperties, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './NavigationBar.scss'

interface IProps {
  style?: CSSProperties
  backButtonText?: string
  backButtonVisible?: boolean
}

const NavigationBar: React.FunctionComponent<IProps> = (props) => {
  const { backButtonText = '后退', style, backButtonVisible = true } = props
  const [opacity, setOpacity] = useState(0)

  const navigate = useNavigate()
  // const location = useLocation()
  // useEffect(() => {
  //   console.log('history.length ===========>', history.length)
  // }, [location])

  return (
    <div
      className="navigation-bar"
      style={{ opacity, ...style }}
      onMouseEnter={() => {
        setOpacity(1)
      }}
      onMouseLeave={() => {
        setOpacity(0)
      }}
    >
      {backButtonVisible ? (
        <button
          className="back-button"
          onClick={() => {
            navigate(-1)
          }}
        >
          {backButtonText}
        </button>
      ) : null}
    </div>
  )
}
export default NavigationBar
