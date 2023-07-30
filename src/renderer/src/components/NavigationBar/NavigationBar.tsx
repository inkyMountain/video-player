import React, { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './NavigationBar.scss'
import { Left } from '@icon-park/react'
import { useMount } from 'ahooks'

interface IProps {
  // 让父组件可以调整组件最外层的div样式
  style?: CSSProperties
  // 按钮的 jsx
  backButton?: ReactNode
  // 是否展示返回按钮
  backButtonVisible?: boolean
  extra?: ReactNode
}

const NavigationBar: React.FunctionComponent<IProps> = (props) => {
  const {
    backButton = <Left style={{ fontSize: 20 }} />,
    // backButton,
    style,
    backButtonVisible = true,
    extra,
  } = props
  const [opacity, setOpacity] = useState(1)

  const navigate = useNavigate()
  useEffect(() => {
    // const onMouseEnter = () => {
    //   setOpacity(1)
    // }
    // const onMouseLeave = () => {
    //   setOpacity(0)
    // }
    // const onMouseMove = (event: MouseEvent) => {
    //   console.log('mouse move', event.clientX, event.clientY)
    // }
    // document.addEventListener('mousemove', onMouseMove)
    // document.addEventListener('mouseenter', onMouseEnter)
    // document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      // document.removeEventListener('mouseenter', onMouseEnter)
      // document.removeEventListener('mouseleave', onMouseLeave)
      // document.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className="navigation-bar" style={{ opacity, ...style }}>
      {backButtonVisible ? (
        <div
          className="back-button"
          onClick={() => {
            console.log('back click')
            navigate(-1)
          }}
        >
          {backButton}
        </div>
      ) : null}

      {extra}
    </div>
  )
}

export default NavigationBar
