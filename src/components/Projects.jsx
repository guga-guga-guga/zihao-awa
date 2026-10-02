import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Archive3DBackground from './Archive3DBackground'
import ArchiveGate from './ArchiveGate'
import ArchiveBoot from './ArchiveBoot'
import ScrambleText from './ScrambleText'
import RollingNumber from './RollingNumber'
import useArchivePreload from '../hooks/useArchivePreload'
import { projects } from '../data/profile'

export default function Projects() {
  const [stage, setStage] = useState('gate')
  const [minLoadingElapsed, setMinLoadingElapsed] = useState(false)
  const [activeId, setActiveId] = useState(projects[0]?.id)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const stageRef = useRef(null)
  const videoRef = useRef(null)
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
    : (activeProject.images?.length ? activeProject.images : [activeProject.image]).map(
        (src) => ({ type: 'image', src }),
      )
  const mediaCount = projectMedia.length
  const currentMedia = projectMedia[activeImageIndex] || projectMedia[0]
  const currentIsVideo = currentMedia?.type === 'video'
  const currentIsPortrait = currentIsVideo && currentMedia?.orientation === 'portrait'

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
    setActiveId(id)
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
    <section className="projects section" id="projects">
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
                className={`archive-viewer ${currentIsVideo ? 'is-video' : ''} ${currentIsPortrait ? 'is-portrait' : ''}`}
                role="group"
                tabIndex={0}
                aria-label="媒体展示，使用左右区域切换"
                onKeyDown={handleViewerKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {currentIsVideo ? (
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

                <div className="archive-viewer__count">
                  <RollingNumber value={activeImageIndex + 1} length={2} />
                  <i>/</i>
                  <RollingNumber value={mediaCount} length={2} />
                </div>

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

              <div className="archive-tabs" role="tablist" aria-label="项目切换">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={activeProject.id === project.id}
                    className={`archive-tab ${activeProject.id === project.id ? 'is-active' : ''}`}
                    onMouseEnter={() => selectProject(project.id)}
                    onClick={() => selectProject(project.id)}
                  >
                    <span className="archive-tab__index">
                      X-<RollingNumber value={index + 1} length={2} />
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