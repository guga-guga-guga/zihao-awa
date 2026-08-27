import { useState } from 'react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Grainient from './Grainient'
import { projects } from '../data/profile'
import useTheme from '../hooks/useTheme'

export default function Projects() {
  const { theme } = useTheme()
  const [activeId, setActiveId] = useState(projects[0]?.id)
  const activeProject = projects.find((project) => project.id === activeId) || projects[0]

  return (
    <section className="projects section" id="projects">
      <Grainient
        className="projects__grainient"
        color1={theme === 'light' ? '#eef1f6' : '#1f1d1f'}
        color2={theme === 'light' ? '#dbe4f0' : '#2c273e'}
        color3={theme === 'light' ? '#e6ecf3' : '#252d36'}
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
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
            <div className="projects__visual">
              <img src={activeProject.image} alt={activeProject.title} />
              <div className="projects__visual-shade" aria-hidden="true" />
              <span className="projects__visual-index">{activeProject.index}</span>
              <span className="projects__visual-year">{activeProject.year}</span>
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
