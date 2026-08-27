import { useEffect, useState } from 'react'

// 当前只保留黑夜模式，白天模式相关逻辑已注释停用。
// 如需恢复，可打开下方 getThemeByTime / getStoredTheme / toggle / resetAuto。

// const STORAGE_KEY = 'portfolio-theme'
// const THEME_EVENT = 'dsh-theme-change'

// function getThemeByTime() {
//   const hour = new Date().getHours()
//   return hour >= 6 && hour < 18 ? 'light' : 'dark'
// }

// function getStoredTheme() {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY)
//     if (stored === 'light' || stored === 'dark') return stored
//   } catch {
//     // ignore
//   }
//   return null
// }

export default function useTheme() {
  const [theme] = useState('dark')
  const [isAuto] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
  }, [])

  // 白天模式相关事件同步已停用
  // useEffect(() => {
  //   const onThemeChange = (event) => {
  //     setTheme(event.detail.theme)
  //     setIsAuto(event.detail.isAuto)
  //   }
  //   window.addEventListener(THEME_EVENT, onThemeChange)
  //   return () => window.removeEventListener(THEME_EVENT, onThemeChange)
  // }, [])

  // 自动按时间段切换已停用
  // useEffect(() => {
  //   if (!isAuto) return undefined
  //   const updateByTime = () => setTheme(getThemeByTime())
  //   updateByTime()
  //   const timer = window.setInterval(updateByTime, 60 * 1000)
  //   return () => window.clearInterval(timer)
  // }, [isAuto])

  const toggle = () => {
    // 白天模式切换已停用，当前固定黑夜模式
  }

  const resetAuto = () => {
    // 自动模式已停用，当前固定黑夜模式
  }

  return { theme, isAuto, toggle, resetAuto }
}
