const EmptyState = ({ icon = 'bi-inbox', title = 'Nothing here', message = '' }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
      <i className={`bi ${icon} text-3xl text-purple-400`}></i>
    </div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
    {message && <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm">{message}</p>}
  </div>
)

export default EmptyState
