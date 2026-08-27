import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import ShapeGrid from './ShapeGrid'
import { skillGroups } from '../data/profile'
import ToolIcon from './ToolIcon'
import useTheme from '../hooks/useTheme'

export default function Strengths() {
  const { theme } = useTheme()

  return (
    <section className="strengths section" id="skills">
      <ShapeGrid
        className="skills__shapegrid"
        direction="diagonal"
        speed={0.55}
        squareSize={46}
        borderColor={theme === 'light' ? 'rgba(15, 23, 42, 0.12)' : 'rgba(110, 231, 255, 0.12)'}
        hoverFillColor={theme === 'light' ? 'rgba(14, 116, 144, 0.07)' : 'rgba(110, 231, 255, 0.07)'}
        shape="hexagon"
        hoverTrailAmount={6}
      />
      <div className="container">
        <SectionHeading
          index="03"
          title="技能 / 软件"
          en="TOOLKIT"
          description="日常创作中常用的技能与软件工具，按类别整理。"
        />

        <div className="skills__toolkit">
          {skillGroups.map((group, i) => (
            <Reveal className="skills__card" key={group.name} delay={(i % 2) * 80}>
              <div className="skills__card-bg" aria-hidden="true" />
              <div className="skills__card-content">
                <span className="skills__group-name">{group.name}</span>
                <div className="skills__tags">
                  {group.items.map((item) => (
                    <div className="skills__tool" key={item}>
                      <span className="skills__tool-icon">
                        <ToolIcon name={item} />
                      </span>
                      <span className="skills__tool-name">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
