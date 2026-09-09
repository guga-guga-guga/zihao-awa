import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Grainient from './Grainient'
import { projects } from '../data/profile'

export default function Projects() {
  const [activeId, setActiveId] = useState(projects[0]?.id)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeProject = projects.find((project) => project.id === activeId) || projects[0]
  const projectImages = activeProject.images?.length ? activeProject.images : [activeProject.image]
  const imageCount = projectImages.length
  const currentImage = projectImages[activeImageIndex] || projectImages[0]

  useEffect(() => {
    setActiveImageIndex(0)
  }, [activeId])

  useEffect(() => {
    if (imageCount <= 1 || isPaused) return undefined

    const timer = setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % imageCount)
    }, 5000)

    return () => clearInterval(timer)
  }, [activeId, imageCount, activeImageIndex, isPaused])

  const showNextImage = () => {
    if (imageCount <= 1) return
    setActiveImageIndex((index) => (index + 1) % imageCount)
  }

  const showImage = (index) => {
    setActiveImageIndex(index)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      showNextImage()
    }
  }

  return (
    <section className="projects section" id="projects">
      <Grainient
        className="projects__grainient"
        color1="#1f1d1f"
        color2="#3f2988"
        color3="#252d36"
        timeSpeed={1.2}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={8.3}
        warpSpeed={3.5}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
      <div className="container">
        <SectionHeading
          index="02"
          title="历史项目"
          en="PROJECT ARCHIVE"
          description="视觉、AI、游戏与视频创作的交叉实践，以完整项目闭环为线索。"
        />

        <div className="projects__showcase">
          <Reveal className="projects__stage">
            <div
              className="projects__visual"
              role="button"
              tabIndex={0}
              aria-label="点击切换到下一张图片"
              onClick={showNextImage}
              onKeyDown={handleKeyDown}
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
              <div className="projects__visual-shade" aria-hidden="true" />
              <span className="projects__visual-index">{activeProject.index}</span>
              <span className="projects__visual-year">{activeProject.year}</span>

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

          <div className="projects__side">
            <div className="projects__list" role="tablist" aria-label="项目切换">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={activeProject.id === project.id}
                  className={`projects__tab ${activeProject.id === project.id ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveId(project.id)}
                  onClick={() => setActiveId(project.id)}
                >
                  <span className="projects__tab-inner">
                    <span className="projects__tab-index">{project.index}</span>
                    <span className="projects__tab-title">{project.title}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="projects__caption">
              <span className="projects__caption-category">{activeProject.category}</span>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.description}</p>
              <div className="projects__caption-tags">
                {activeProject.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}