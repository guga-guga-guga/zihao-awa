import { useEffect, useState } from 'react'
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

  const { progress, done } = useArchivePreload(projects, stage === 'loading')

  const activeProject = projects.find((project) => project.id === activeId) || projects[0]
  const activeProjectIndex = Math.max(
    0,
    projects.findIndex((project) => project.id === activeProject.id),
  )
  const projectImages = activeProject.images?.length
    ? activeProject.images
    : [activeProject.image]
  const imageCount = projectImages.length
  const currentImage = projectImages[activeImageIndex] || projectImages[0]

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
    if (stage !== 'ready' || imageCount <= 1 || isPaused) return undefined

    const timer = setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % imageCount)
    }, 5000)

    return () => clearInterval(timer)
  }, [stage, activeId, imageCount, activeImageIndex, isPaused])

  const showNextImage = () => {
    if (imageCount <= 1) return
    setActiveImageIndex((index) => (index + 1) % imageCount)
  }

  const showImage = (index) => {
    setActiveImageIndex(index)
  }

  const selectProject = (id) => {
    setActiveId(id)
  }

  const handleViewerKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      showNextImage()
    }
  }

  return (
    <section className="projects section" id="projects">
      <Archive3DBackground />
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
                className="archive-viewer"
                role="button"
                tabIndex={0}
                aria-label="点击切换到下一张图片"
                onClick={showNextImage}
                onKeyDown={handleViewerKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <picture>
                  <source srcSet={currentImage.replace(/\.png$/, '.webp')} type="image/webp" />
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={activeProject.title}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>

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
                  <RollingNumber value={imageCount} length={2} />
                </div>

                {imageCount > 1 && (
                  <div className="projects__dots" role="tablist" aria-label="图片切换">
                    {projectImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        role="tab"
                        aria-selected={activeImageIndex === index}
                        aria-label={`查看第 ${index + 1} 张图片`}
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
    </section>
  )
}