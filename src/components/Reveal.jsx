export default function Reveal({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
