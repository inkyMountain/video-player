import { app, net, protocol } from 'electron'
import { AppMiddleware } from './types'
import fs from 'fs-extra'
import { DEFAULT_DEV_URL, createWindow } from '@main/utils/window'

const devWindowMiddleware: AppMiddleware = {
  when: 'dev',
  apply() {
    const devUrl = new URL(DEFAULT_DEV_URL)
    devUrl.hash = '/video/follower'
    app.whenReady().then(() => {
      createWindow({
        devUrl: devUrl.toString(),
      })
    })
  },
}

export default devWindowMiddleware
