import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserPosts, createPost, deletePost } from '../api/post.api'
import { togglePostLike } from '../api/like.api'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import { formatTimeAgo } from '../utils/formatters'
import toast from 'react-hot-toast'

const CommunityPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newContent, setNewContent] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    if (!user) return
    getUserPosts(user._id)
      .then((res) => setPosts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handlePost = async (e) => {
    e.preventDefault()
    if (!newContent.trim()) return
    setPosting(true)
    try {
      const res = await createPost({ content: newContent })
      setPosts([res.data.data, ...posts])
      setNewContent('')
      toast.success('Post created!')
    } catch {
      toast.error('Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
      setPosts(posts.filter((p) => p._id !== postId))
      toast.success('Post deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Community</h1>

      {user && (
        <form onSubmit={handlePost} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30 mb-6">
          <div className="flex gap-3">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}&background=7c3aed&color=fff`}
              alt=""
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share something with your community..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 text-gray-800 dark:text-gray-200 outline-none transition-colors resize-none text-sm"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={posting || !newContent.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <EmptyState icon="bi-chat-square-text" title="No posts yet" message="Share something with your community!" />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30">
              <div className="flex items-start gap-3">
                <img
                  src={post.owner?.avatar || `https://ui-avatars.com/api/?name=${post.owner?.fullname}&background=7c3aed&color=fff`}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{post.owner?.fullname}</span>
                      <span className="text-xs text-gray-400 ml-2">{formatTimeAgo(post.createdAt)}</span>
                    </div>
                    {user && user._id === post.owner?._id && (
                      <button onClick={() => handleDelete(post._id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <i className="bi bi-trash text-sm"></i>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{post.content}</p>
                  <button
                    onClick={() => togglePostLike(post._id)}
                    className="flex items-center gap-1.5 mt-3 text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    <i className="bi bi-heart"></i> Like
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommunityPage
