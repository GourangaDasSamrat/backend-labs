import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { videoService, commentService, likeService, subscriptionService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import VideoCard from '../components/video/VideoCard'
import { PageLoader } from '../components/ui/Spinner'
import { formatViews, timeAgo, formatDuration } from '../utils/helpers'
import toast from 'react-hot-toast'

const VideoPlayer = () => {
  const { videoId } = useParams()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showDesc, setShowDesc] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchVideo()
    fetchComments()
    fetchRelated()
    window.scrollTo(0, 0)
  }, [videoId])

  const fetchVideo = async () => {
    setLoading(true)
    try {
      const res = await videoService.getById(videoId)
      const v = res.data.data
      setVideo(v)
      setLiked(v.isLiked)
    } catch {
      toast.error('Video not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await commentService.getVideoComments(videoId, { page: 1, limit: 20 })
      setComments(res.data.data.docs || [])
    } catch {}
  }

  const fetchRelated = async () => {
    try {
      const res = await videoService.getAll({ limit: 10 })
      setRelated((res.data.data.docs || []).filter(v => v._id !== videoId))
    } catch {}
  }

  const handleLike = async () => {
    if (!user) return toast.error('Sign in to like')
    try {
      const res = await likeService.toggleVideo(videoId)
      setLiked(res.data.data.liked)
    } catch {}
  }

  const handleSubscribe = async () => {
    if (!user) return toast.error('Sign in to subscribe')
    try {
      const res = await subscriptionService.toggle(video.owner._id)
      setSubscribed(res.data.data.subscribed)
      toast.success(res.data.data.subscribed ? 'Subscribed!' : 'Unsubscribed')
    } catch {}
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Sign in to comment')
    if (!commentText.trim()) return
    setCommentLoading(true)
    try {
      const res = await commentService.add(videoId, { content: commentText })
      const newComment = { ...res.data.data, owner: { userName: user.userName, fullname: user.fullname, avatar: user.avatar, _id: user._id } }
      setComments(p => [newComment, ...p])
      setCommentText('')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.delete(commentId)
      setComments(p => p.filter(c => c._id !== commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return
    try {
      const res = await commentService.update(commentId, { content: editContent })
      setComments(p => p.map(c => c._id === commentId ? { ...c, content: res.data.data.content } : c))
      setEditingComment(null)
      toast.success('Comment updated')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  if (loading) return <PageLoader />

  if (!video) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <i className="bi bi-camera-video-off text-6xl mb-4" />
      <p>Video not found</p>
    </div>
  )

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Video player */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/20">
          <video
            key={videoId}
            src={video.videoFile}
            controls
            autoPlay
            className="w-full h-full"
            poster={video.thumbnail}
          />
        </div>

        {/* Video info */}
        <div className="mt-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {video.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
            {/* Channel info */}
            <div className="flex items-center gap-3 flex-1">
              <Link to={`/channel/${video.owner?.userName}`}>
                <Avatar src={video.owner?.avatar} name={video.owner?.fullname} size="md" />
              </Link>
              <div>
                <Link to={`/channel/${video.owner?.userName}`} className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm">
                  {video.owner?.fullname}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">@{video.owner?.userName}</p>
              </div>
              {user && user._id !== video.owner?._id && (
                <button
                  onClick={handleSubscribe}
                  className={`ml-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    subscribed
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg'
                  }`}
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  liked
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'} text-base`} />
                <span>{video.likesCount || 0}</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                <i className="bi bi-eye text-base" />
                <span>{formatViews(video.views)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl cursor-pointer"
            onClick={() => setShowDesc(p => !p)}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{timeAgo(video.createdAt)}</span>
              <i className={`bi ${showDesc ? 'bi-chevron-up' : 'bi-chevron-down'} ml-auto`} />
            </div>
            {showDesc && (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {video.description}
              </p>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {comments.length} Comments
          </h3>

          {/* Add comment */}
          {user && (
            <form onSubmit={handleComment} className="flex gap-3 mb-6">
              <Avatar src={user.avatar} name={user.fullname} size="sm" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="input-field text-sm"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                {commentText && (
                  <div className="flex gap-2 mt-2 justify-end">
                    <button type="button" onClick={() => setCommentText('')} className="btn-secondary text-sm py-1.5 px-4">Cancel</button>
                    <button type="submit" disabled={commentLoading} className="btn-primary text-sm py-1.5 px-4">
                      {commentLoading ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* Comment list */}
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment._id} className="flex gap-3 group">
                <Link to={`/channel/${comment.owner?.userName}`}>
                  <Avatar src={comment.owner?.avatar} name={comment.owner?.fullname} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/channel/${comment.owner?.userName}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      @{comment.owner?.userName}
                    </Link>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(comment.createdAt)}</span>
                  </div>

                  {editingComment === comment._id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input-field text-sm flex-1"
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                      />
                      <button onClick={() => handleUpdateComment(comment._id)} className="btn-primary text-sm py-1.5 px-3">Save</button>
                      <button onClick={() => setEditingComment(null)} className="btn-secondary text-sm py-1.5 px-3">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                  )}
                </div>

                {user && user._id === comment.owner?._id && editingComment !== comment._id && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingComment(comment._id); setEditContent(comment.content) }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors text-sm"
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - Related videos */}
      <aside className="w-full xl:w-96 flex-shrink-0">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Up Next</h3>
        <div className="space-y-3">
          {related.map(v => <VideoCard key={v._id} video={v} horizontal />)}
        </div>
      </aside>
    </div>
  )
}

export default VideoPlayer
