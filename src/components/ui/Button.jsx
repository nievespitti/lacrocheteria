import './Button.css'

export default function Button({ children, variant = 'primary', as: Tag = 'button', ...props }) {
  return (
    <Tag className={`btn btn--${variant}`} {...props}>
      {children}
    </Tag>
  )
}
