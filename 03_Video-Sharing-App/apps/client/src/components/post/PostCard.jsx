import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import { timeAgo } from '../../utils/helpers'
import { likeService, postService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(post.content)

  const handleLike = async () => {
    if (!user) return toast.error('Sign in to like')
    try {
      const res = await likeService.togglePost(post._id)
      setLiked(res.data.data.liked)
    } catch {}
  }

  const handleUpdate = async () => {
    try {
      await postService.update(post._id, { content })
      setEditing(false)
      toast.success('Post updated')
    } catch {
      toast.error('Failed to update post')
    }
  }

  const handleDelete = async () => {
    try {
      await postService.delete(post._id)
      toast.success('Post deleted')
      onDelete?.(post._id)
    } catch {
      toast.error('Failed to delete post')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 card-hover">
      <div className="flex items-start gap-3">
        <Link to={`/channel/${post.owner?.userName}`}>
          <Avatar src={post.owner?.avatar} name={post.owner?.fullname} size="sm" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <Link to={`/channel/${post.owner?.userName}`} className="font-semibold text-sm text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                {post.owner?.fullname}
              </Link>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{timeAgo(post.createdAt)}</span>
            </div>
            {user?._id === post.owner?._id && (
              <div className="flex gap-1">
                <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  <i className="bi bi-pencil" />
                </button>
                <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 text-sm transition-colors">
                  <i className="bi bi-trash" />
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="mt-2 flex gap-2">
              <textarea
                className="input-field text-sm resize-none"
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <button onClick={handleUpdate} className="btn-primary text-xs py-1.5 px-3">Save</button>
                <button onClick={() => setEditing(false)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">{content}</p>
          )}

          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 mt-3 text-sm transition-colors ${
              liked ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 hover:text-red-500'
            }`}
          >
            <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`} />
            Like
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
