import Reveal from './Reveal'

export default function SectionHeading({ index, title, en, description }) {
  return (
    <Reveal className="section-heading">
      <div className="section-heading__meta">
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__line" />
        <span className="section-heading__en">{en}</span>
      </div>
      <h2 className="section-heading__title">{title}</h2>
      {description && <p className="section-heading__desc">{description}</p>}
    </Reveal>
  )
}
