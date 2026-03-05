import { getInitials } from '../../utils/helpers'

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-3xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style.removeProperty('display') }}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  )
}

export default Avatar
