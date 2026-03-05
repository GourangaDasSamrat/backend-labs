import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
})

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post('/api/v1/users/refresh-tokens', {}, { withCredentials: true })
        return api(original)
      } catch {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ----- Videos -----
export const videoService = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  publish: (data) => api.post('/videos', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.patch(`/videos/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/videos/${id}`),
  togglePublish: (id) => api.patch(`/videos/toggle/publish/${id}`),
}

// ----- Users -----
export const userService = {
  getProfile: (userName) => api.get(`/users/channel/${userName}`),
  updateDetails: (data) => api.patch('/users/update-account', data),
  updateAvatar: (data) => api.patch('/users/avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCover: (data) => api.patch('/users/cover-image', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.post('/users/change-password', data),
  getWatchHistory: () => api.get('/users/watch-history'),
}

// ----- Comments -----
export const commentService = {
  getVideoComments: (videoId, params) => api.get(`/comments/${videoId}`, { params }),
  add: (videoId, data) => api.post(`/comments/${videoId}`, data),
  update: (commentId, data) => api.patch(`/comments/channel/${commentId}`, data),
  delete: (commentId) => api.delete(`/comments/channel/${commentId}`),
}

// ----- Likes -----
export const likeService = {
  toggleVideo: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  toggleComment: (commentId) => api.post(`/likes/toggle/c/${commentId}`),
  togglePost: (postId) => api.post(`/likes/toggle/p/${postId}`),
  getLikedVideos: () => api.get('/likes/videos'),
}

// ----- Subscriptions -----
export const subscriptionService = {
  toggle: (channelId) => api.post(`/subscriptions/channel/${channelId}`),
  getSubscribers: (channelId) => api.get(`/subscriptions/channel/${channelId}`),
  getSubscribed: (subscriberId) => api.get(`/subscriptions/u/${subscriberId}`),
}

// ----- Playlists -----
export const playlistService = {
  create: (data) => api.post('/playlists', data),
  getById: (id) => api.get(`/playlists/${id}`),
  update: (id, data) => api.patch(`/playlists/${id}`, data),
  delete: (id) => api.delete(`/playlists/${id}`),
  getUserPlaylists: (userId) => api.get(`/playlists/user/${userId}`),
  addVideo: (videoId, playlistId) => api.patch(`/playlists/add/${videoId}/${playlistId}`),
  removeVideo: (videoId, playlistId) => api.patch(`/playlists/remove/${videoId}/${playlistId}`),
}

// ----- Posts -----
export const postService = {
  create: (data) => api.post('/posts', data),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  update: (id, data) => api.patch(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
}

// ----- Dashboard -----
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getVideos: () => api.get('/dashboard/videos'),
}
