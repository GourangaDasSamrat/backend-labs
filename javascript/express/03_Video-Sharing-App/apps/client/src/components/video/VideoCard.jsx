import { Link } from 'react-router-dom'
import { formatViews, formatDuration, formatTimeAgo } from '../../utils/formatters'

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="group block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20 hover:-translate-y-0.5">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <img
            src={video.thumbnail || '/placeholder-thumbnail.jpg'}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${video._id}/640/360` }}
          />
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-mono">
              {formatDuration(video.duration)}
            </span>
          )}
          {!video.isPublished && (
            <span className="absolute top-2 left-2 bg-yellow-500/90 text-white text-xs px-2 py-0.5 rounded-md font-medium">
              Draft
            </span>
          )}
        </div>
        {/* Info */}
        <div className="p-3">
          <div className="flex gap-3">
            <img
              src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.fullname || 'U'}&background=7c3aed&color=fff`}
              alt={video.owner?.fullname}
              className="w-8 h-8 rounded-xl object-cover flex-shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug mb-1">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{video.owner?.fullname}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatViews(video.views)} views · {formatTimeAgo(video.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
