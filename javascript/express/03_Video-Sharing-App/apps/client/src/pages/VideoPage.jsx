import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVideoById, getAllVideos } from '../api/video.api'
import { toggleVideoLike } from '../api/like.api'
import { getVideoComments, addComment, deleteComment } from '../api/comment.api'
import { toggleSubscription, getUserChannelSubscribers } from '../api/subscription.api'
import { useAuth } from '../context/AuthContext'
import VideoCard from '../components/video/VideoCard'
import Spinner from '../components/common/Spinner'
import { formatViews, formatTimeAgo } from '../utils/formatters'
import toast from 'react-hot-toast'

const VideoPage = () => {
  const { videoId } = useParams()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [subscribed, setSubscribed] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [vRes, cRes, rRes] = await Promise.all([
          getVideoById(videoId),
          getVideoComments(videoId),
          getAllVideos({ limit: 8 }),
        ])
        setVideo(vRes.data.data)
        setLiked(vRes.data.data.isLiked)
        setLikesCount(vRes.data.data.likesCount)
        setComments(cRes.data.data?.docs || [])
        setRelated(rRes.data.data?.docs?.filter((v) => v._id !== videoId) || [])
      } catch {
        toast.error('Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [videoId])

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like videos')
    try {
      const res = await toggleVideoLike(videoId)
      setLiked(res.data.data.liked)
      setLikesCount((prev) => res.data.data.liked ? prev + 1 : prev - 1)
    } catch {
      toast.error('Failed to toggle like')
    }
  }

  const handleSubscribe = async () => {
    if (!user) return toast.error('Please login to subscribe')
    try {
      await toggleSubscription(video.owner._id)
      setSubscribed(!subscribed)
      toast.success(subscribed ? 'Unsubscribed' : 'Subscribed!')
    } catch {
      toast.error('Failed to toggle subscription')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setCommentLoading(true)
    try {
      const res = await addComment(videoId, { content: newComment })
      setComments([res.data.data, ...comments])
      setNewComment('')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(comments.filter((c) => c._id !== commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!video) return <div className="text-center py-20 text-gray-500">Video not found</div>

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2">
          {/* Video player */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4">
            <video
              src={video.videoFile}
              controls
              autoPlay
              className="w-full h-full"
              poster={video.thumbnail}
            />
          </div>

          {/* Video info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30 mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Link to={`/channel/${video.owner?.userName}`}>
                  <img
                    src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.fullname}&background=7c3aed&color=fff`}
                    alt={video.owner?.fullname}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-200 dark:ring-purple-800"
                  />
                </Link>
                <div>
                  <Link to={`/channel/${video.owner?.userName}`} className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 transition-colors">
                    {video.owner?.fullname}
                  </Link>
                  <p className="text-xs text-gray-500">{formatViews(video.views)} views · {formatTimeAgo(video.createdAt)}</p>
                </div>
                {user && user._id !== video.owner?._id && (
                  <button
                    onClick={handleSubscribe}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${subscribed
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'}`}
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${liked
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                >
                  <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  {likesCount}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-purple-300 transition-all">
                  <i className="bi bi-share"></i> Share
                </button>
              </div>
            </div>
            {video.description && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{video.description}</p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="bi bi-chat-dots text-purple-500"></i>
              {comments.length} Comments
            </h2>
            {user && (
              <form onSubmit={handleComment} className="flex gap-3 mb-6">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=7c3aed&color=fff`}
                  alt={user.fullname}
                  className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 text-sm text-gray-800 dark:text-gray-200 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Post
                  </button>
                </div>
              </form>
            )}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <img
                    src={comment.owner?.avatar || `https://ui-avatars.com/api/?name=${comment.owner?.fullname}&background=7c3aed&color=fff`}
                    alt={comment.owner?.fullname}
                    className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{comment.owner?.fullname}</span>
                      <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                  </div>
                  {user && user._id === comment.owner?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <i className="bi bi-trash text-sm"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related videos */}
        <div className="xl:col-span-1">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Related Videos</h2>
          <div className="space-y-3">
            {related.map((v) => (
              <Link key={v._id} to={`/video/${v._id}`} className="flex gap-3 group">
                <div className="w-40 flex-shrink-0 aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${v._id}/320/180` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">{v.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{v.owner?.fullname}</p>
                  <p className="text-xs text-gray-400">{formatViews(v.views)} views</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPage
