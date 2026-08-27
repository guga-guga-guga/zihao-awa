import useTheme from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, isAuto, toggle } = useTheme()

  return (
    <button
      type="button"
      className={`theme-toggle ${isAuto ? 'theme-toggle--auto' : ''}`}
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'}
      title={
        isAuto
          ? `当前自动模式：${theme === 'dark' ? '黑夜' : '白天'}，点击可手动切换`
          : '已手动切换，点击可切换主题'
      }
    >
      <span className="theme-toggle__icon">
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
      {isAuto && <span className="theme-toggle__auto" />}
    </button>
  )
}
