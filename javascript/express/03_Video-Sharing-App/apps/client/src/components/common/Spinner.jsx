const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-2 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin`}></div>
    </div>
  )
}

export default Spinner
