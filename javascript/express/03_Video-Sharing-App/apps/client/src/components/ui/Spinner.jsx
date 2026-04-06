const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 animate-spin" />
    </div>
  )
}

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Spinner size="lg" />
  </div>
)

export default Spinner
