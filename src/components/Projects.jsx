import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import Reveal from './Reveal'
import FaultyTerminal from './FaultyTerminal/FaultyTerminal'
import SectionHeading from './SectionHeading'
import Archive3DBackground from './Archive3DBackground'
import ArchiveGate from './ArchiveGate'
import ArchiveBoot from './ArchiveBoot'
import ScrambleText from './ScrambleText'
import RollingNumber from './RollingNumber'
import useArchivePreload from '../hooks/useArchivePreload'
import { projects } from '../data/profile'

gsap.registerPlugin(Flip)

export default function Projects() {
  const [stage, setStage] = useState('gate')
  const [minLoadingElapsed, setMinLoadingElapsed] = useState(false)
  const [activeId, setActiveId] = useState(projects[0]?.id)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)   // 进程是否已挂载（挂载后一直保留，用于保进度）
  const [gameRevealed, setGameRevealed] = useState(false) // 是否正在显示到屏幕上
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const gameLayerRef = useRef(null)
  const tabsRef = useRef(null)
  const flipStateRef = useRef(null)
  const hoverLockUntilRef = useRef(0)
  const [stageScale, setStageScale] = useState(() => {
    if (typeof window === 'undefined') return 1
    return Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
  })
  const [stageSize, setStageSize] = useState(() => {
    if (typeof window === 'undefined') return { width: 1920, height: 1080 }
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
    const safeScale = scale > 0 ? scale : 1
    return {
      width: window.innerWidth / safeScale,
      height: window.innerHeight / safeScale,
    }
  })

  const { progress, done } = useArchivePreload(projects, stage === 'loading')

  const activeProject = projects.find((project) => project.id === activeId) || projects[0]
  const activeProjectIndex = Math.max(
    0,
    projects.findIndex((project) => project.id === activeProject.id),
  )
  const projectMedia = activeProject.media?.length
    ? activeProject.media
    : activeProject.images?.length
      ? activeProject.images.map((src) => ({ type: 'image', src }))
      : activeProject.image
        ? [{ type: 'image', src: activeProject.image }]
        : []
  const mediaCount = projectMedia.length
  const currentMedia = projectMedia[activeImageIndex] || projectMedia[0]
  const currentIsVideo = currentMedia?.type === 'video'
  const currentIsPortrait = currentIsVideo && currentMedia?.orientation === 'portrait'
  const gameUrl = activeProject.gameUrl
  const gameProject = projects.find((project) => project.gameUrl)
  const isGameProject = Boolean(gameUrl)
  const gameActive = gameRevealed && isGameProject
  const lockHoverSwitch = gameActive

  // 游戏态与普通态之间，4 个标签要在「右侧竖排」和「底部编号方块」之间移动。
  // 用 GSAP Flip 做 FLIP：先在点击时量下旧位置，等布局改完再补位移动画。
  const captureTabState = () => {
    const tabs = tabsRef.current?.querySelectorAll('.archive-tab')
    if (!tabs || tabs.length === 0) return
    flipStateRef.current = Flip.getState(tabs)
  }

  // 游戏态时给 body 挂类名：顶部导航在 section 之外，只能靠 body 上的类名去隐藏
  useEffect(() => {
    document.body.classList.toggle('is-game-mode', gameActive)
    return () => document.body.classList.remove('is-game-mode')
  }, [gameActive])

  // 把当前界面状态直接写进 iframe 的 window，供游戏侧轮询。
  // 为什么不用事件/失焦：实测把游戏层设成 visibility:hidden 甚至 display:none，
  // iframe 内的 document.visibilityState 依然是 visible，Godot 不会自己知道被藏起来了，
  // 于是音乐继续放、游戏也继续推进。同源直写标记最可靠。
  const pushGameState = () => {
    const win = gameLayerRef.current?.querySelector('iframe')?.contentWindow
    if (!win) return
    try {
      win.__portfolioGameVisible = gameActive
    } catch {
      // 忽略跨域等异常
    }
  }

  useEffect(() => {
    if (!gameStarted) return undefined
    pushGameState()
    // 周期重写：iframe 导航后 window 会被替换（标记丢失），也覆盖 Godot 尚未启动的时间差
    const timer = setInterval(pushGameState, 800)
    return () => clearInterval(timer)
  }, [gameStarted, gameActive])

  useLayoutEffect(() => {
    const state = flipStateRef.current
    if (!state) return
    flipStateRef.current = null

    // ⚠️ Flip 动画期间必须关掉 .archive-tab 自身的 CSS 过渡。
    // 原因：GSAP 每帧都会写 transform，而 CSS 又去缓动这个变化，两者互相打架 ——
    // 表现为进入时不丝滑、离开时收尾阶段又多动一次。
    // 用 html 上的类名统一压制，并带兜底计时器，避免类名残留。
    const host = document.documentElement
    host.classList.add('is-flipping-tabs')
    const release = () => host.classList.remove('is-flipping-tabs')
    const safety = setTimeout(release, 2500)

    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      stagger: 0.03,
      onComplete: () => {
        clearTimeout(safety)
        // 再等一帧，确认 GSAP 清完 inline 样式再恢复过渡，避免收尾再动一次
        requestAnimationFrame(release)
      },
    })

    return () => {
      clearTimeout(safety)
      release()
    }
  }, [gameActive])

  useEffect(() => {
    if (stage !== 'loading') return undefined
    setMinLoadingElapsed(false)
    const timer = setTimeout(() => setMinLoadingElapsed(true), 900)
    return () => clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    if (stage === 'loading' && done && minLoadingElapsed) {
      setStage('ready')
    }
  }, [stage, done, minLoadingElapsed])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [activeId])

  useEffect(() => {
    setIsVideoPlaying(false)
  }, [currentMedia?.src])

  useEffect(() => {
    if (stage !== 'ready' || mediaCount <= 1 || isPaused || currentIsVideo) return undefined

    const timer = setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % mediaCount)
    }, 5000)

    return () => clearInterval(timer)
  }, [stage, activeId, mediaCount, activeImageIndex, isPaused, currentIsVideo])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return undefined

    const updateScale = () => {
      const rect = node.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const scale = Math.min(rect.width / 1920, rect.height / 1080)
      const safeScale = scale > 0 ? scale : 1
      setStageScale(safeScale)
      setStageSize({
        width: rect.width / safeScale,
        height: rect.height / safeScale,
      })
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(node)
    window.addEventListener('resize', updateScale)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  const showNextImage = () => {
    if (mediaCount <= 1) return
    setActiveImageIndex((index) => (index + 1) % mediaCount)
  }

  const showPrevImage = () => {
    if (mediaCount <= 1) return
    setActiveImageIndex((index) => (index - 1 + mediaCount) % mediaCount)
  }

  const handleVideoEnded = () => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.pause()
    }
    setIsVideoPlaying(false)
  }

  const playCurrentVideo = () => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }

  const showImage = (index) => {
    setActiveImageIndex(index)
  }

  const selectProject = (id) => {
    if (gameActive) {
      captureTabState()
      // 离开游戏前先让 iframe 失焦，触发 Godot 的失焦自动暂停，
      // 这样切回来时仍停在暂停界面。
      const frame = gameLayerRef.current?.querySelector('iframe')
      frame?.blur()
      try {
        frame?.contentWindow?.blur()
      } catch {
        // 忽略跨域等异常
      }
    }
    if (gameActive) setGameRevealed(false)   // 显示还原成未加载外观（进程保留）
    setActiveId(id)
  }

  // 切换瞬间标签正在飞，鼠标可能被另一个滑过的标签"扫到"从而触发 mouseenter，
  // 导致刚切走又被弹回游戏。这里在点击后把悬停切换锁一小段时间（会自然过期，不会卡死）。
  const handleTabClick = (id) => {
    hoverLockUntilRef.current = Date.now() + 1000
    selectProject(id)
  }

  const startGame = () => {
    captureTabState()
    setGameStarted(true)
    setGameRevealed(true)
  }

  // 从故障终端启动屏点进来：进程其实一直挂着（所以进度不丢），这里只把它显示出来
  const resumeGame = () => {
    captureTabState()
    setGameRevealed(true)
  }

  const closeGame = () => {
    captureTabState()
    setGameRevealed(false)
    setGameStarted(false)
  }

  const toggleGameFullscreen = () => {
    const node = gameLayerRef.current
    if (!node) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
      return
    }
    node.requestFullscreen?.()
  }

  const handleViewerKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPrevImage()
    }

    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      showNextImage()
    }
  }

  return (
    <section
      className={`projects section${gameActive ? ' is-game-mode' : ''}`}
      id="projects"
    >
      <Archive3DBackground />
      <div className="projects__frost" aria-hidden="true">
        <span className="projects__frost-edge projects__frost-edge--top" />
        <span className="projects__frost-edge projects__frost-edge--right" />
        <span className="projects__frost-edge projects__frost-edge--bottom" />
        <span className="projects__frost-edge projects__frost-edge--left" />
      </div>
      <div className="archive-stage" ref={stageRef}>
        <div
          className="archive-stage__inner"
          style={{
            '--stage-scale': stageScale,
            '--stage-w': `${stageSize.width}px`,
            '--stage-h': `${stageSize.height}px`,
          }}
        >
          <div className="container">
            <SectionHeading
          index="02"
          title="历史项目"
          en="PROJECT ARCHIVE"
          description="视觉、AI、游戏与视频创作的交叉实践，以完整项目闭环为线索。"
        />

        {stage === 'gate' && <ArchiveGate onEnter={() => setStage('loading')} />}

        {stage === 'loading' && <ArchiveBoot progress={progress} />}

        {stage === 'ready' && (
          <div className="archive-shell">
            <Reveal className="archive-viewer-wrap">
              <div
                className={`archive-viewer ${currentIsVideo ? 'is-video' : ''} ${currentIsPortrait ? 'is-portrait' : ''}${gameUrl ? ' is-game' : ''}`}
                role="group"
                tabIndex={0}
                aria-label={isGameProject ? '试玩入口' : '媒体展示，使用左右区域切换'}
                onKeyDown={handleViewerKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {isGameProject ? (
                  !gameRevealed &&
                  (gameStarted ? (
                    <button
                      type="button"
                      className="archive-viewer__resume"
                      onClick={(event) => {
                        event.stopPropagation()
                        resumeGame()
                      }}
                    >
                      <FaultyTerminal
                        scale={1}   // 图案大小：uScale 越小图案越大（2 改 1 = 放大一倍）
                        digitSize={1.5}
                        scanlineIntensity={0.3}
                        glitchAmount={1}
                        flickerAmount={1}
                        noiseAmp={0}
                        chromaticAberration={0}
                        dither={0}
                        curvature={0.2}
                        tint="#ffffff"
                        mouseReact
                        mouseStrength={0.2}
                        brightness={1}
                      />
                      <span className="archive-viewer__resume-text">
                        点击屏幕继续游戏
                      </span>
                    </button>
                  ) : (
                    <div className="archive-viewer__game">
                      {activeProject.poster && (
                        <picture className="archive-viewer__game-poster">
                          <source
                            srcSet={activeProject.poster.replace(/\.png$/, '.webp')}
                            type="image/webp"
                          />
                          <img src={activeProject.poster} alt="" />
                        </picture>
                      )}
                      <div className="archive-viewer__game-overlay">
                        <span className="archive-viewer__game-label">
                          {activeProject.category}
                        </span>
                        <button
                          type="button"
                          className="btn btn--primary archive-viewer__game-btn"
                          onClick={(event) => {
                            event.stopPropagation()
                            startGame()
                          }}
                        >
                          <span>{activeProject.gameLabel || '开始游戏'}</span>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path
                              d="M2 8h11M9 3.5 13.5 8 9 12.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <small className="archive-viewer__game-note">
                          独立 Web 版 · 首次加载约 45MB
                        </small>
                        <small className="archive-viewer__game-mobile">
                          请在桌面端游玩（需要键盘）
                        </small>
                      </div>
                    </div>
                  ))
                ) : currentIsVideo ? (
                  <video
                    ref={videoRef}
                    key={currentMedia.src}
                    className="archive-viewer__video"
                    src={currentMedia.src}
                    poster={currentMedia.poster}
                    controls
                    preload="metadata"
                    playsInline
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={handleVideoEnded}
                    onClick={(event) => event.stopPropagation()}
                  />
                ) : (
                  <picture>
                    <source
                      srcSet={currentMedia.src.replace(/\.png$/, '.webp')}
                      type="image/webp"
                    />
                    <img
                      key={currentMedia.src}
                      src={currentMedia.src}
                      alt={activeProject.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}

                {gameStarted && gameProject && (
                  <div
                    className={`archive-game${gameActive ? ' is-active' : ''}`}
                    ref={gameLayerRef}
                  >
                    <iframe
                      className="archive-game__frame"
                      src={gameProject.gameUrl}
                      title={`${gameProject.title} 试玩`}
                      allow="autoplay; fullscreen; gamepad"
                      allowFullScreen
                    />
                    <div className="archive-game__tools">
                      <button type="button" onClick={toggleGameFullscreen}>
                        全屏
                      </button>
                      <a
                        href={gameProject.gameUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        新标签页
                      </a>
                      <button type="button" onClick={closeGame}>
                        关闭
                      </button>
                    </div>
                  </div>
                )}

                {mediaCount > 1 && (
                  <>
                    <button
                      type="button"
                      className="archive-viewer__nav archive-viewer__nav--prev"
                      aria-label="上一项"
                      onClick={(event) => {
                        event.stopPropagation()
                        showPrevImage()
                      }}
                    />
                    <button
                      type="button"
                      className="archive-viewer__nav archive-viewer__nav--next"
                      aria-label="下一项"
                      onClick={(event) => {
                        event.stopPropagation()
                        showNextImage()
                      }}
                    />
                  </>
                )}

                {currentIsVideo && !isVideoPlaying && (
                  <button
                    type="button"
                    className="archive-viewer__play"
                    aria-label="播放视频"
                    onClick={(event) => {
                      event.stopPropagation()
                      videoRef.current?.play()
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </button>
                )}

                <div className="archive-viewer__scan" aria-hidden="true" />
                <div className="archive-viewer__grid" aria-hidden="true" />

                <div className="archive-viewer__hud">
                  <span>
                    FILE <RollingNumber value={activeProjectIndex + 1} length={2} />
                  </span>
                  <span>{activeProject.year}</span>
                </div>

                <div className="archive-viewer__caption">
                  <span className="archive-viewer__category">{activeProject.category}</span>
                  <ScrambleText className="archive-viewer__title" text={activeProject.title} />
                </div>

                {!isGameProject && (
                  <div className="archive-viewer__count">
                    <RollingNumber value={activeImageIndex + 1} length={2} />
                    <i>/</i>
                    <RollingNumber value={mediaCount} length={2} />
                  </div>
                )}

                {mediaCount > 1 && (
                  <div className="projects__dots" role="tablist" aria-label="媒体切换">
                    {projectMedia.map((media, index) => (
                      <button
                        key={media.src}
                        type="button"
                        role="tab"
                        aria-selected={activeImageIndex === index}
                        aria-label={`查看第 ${index + 1} 项`}
                        className={`projects__dot ${activeImageIndex === index ? 'is-active' : ''}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          showImage(index)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            <div className="archive-side">
              <div className="archive-side__head">
                <span>ARCHIVE / SELECT</span>
                <strong>
                  <RollingNumber value={activeProjectIndex + 1} length={2} />
                  <i>/</i>
                  <RollingNumber value={projects.length} length={2} />
                </strong>
              </div>

              <div
                className="archive-tabs"
                role="tablist"
                aria-label="项目切换"
                ref={tabsRef}
              >
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={activeProject.id === project.id}
                    className={`archive-tab ${activeProject.id === project.id ? 'is-active' : ''}`}
                    onMouseEnter={() => {
                      // 游戏运行时禁用悬停切换；刚点击切换后的动画期间也禁用（防回弹）
                      if (lockHoverSwitch) return
                      if (Date.now() < hoverLockUntilRef.current) return
                      selectProject(project.id)
                    }}
                    onClick={() => handleTabClick(project.id)}
                  >
                    <span className="archive-tab__index">
                      <span className="archive-tab__prefix">X-</span>
                      <RollingNumber value={index + 1} length={2} />
                    </span>
                    <span className="archive-tab__body">
                      <ScrambleText className="archive-tab__title" text={project.title} />
                      <small>{project.category}</small>
                    </span>
                    <span className="archive-tab__ticks" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </button>
                ))}
              </div>

              <div className="archive-meta">
                <p>{activeProject.description}</p>
                <div className="archive-meta__tags">
                  {activeProject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </section>
  )
}