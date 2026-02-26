import api from './axios'

export const toggleVideoLike = (videoId) => api.post(`/likes/toggle/v/${videoId}`)
export const toggleCommentLike = (commentId) => api.post(`/likes/toggle/c/${commentId}`)
export const togglePostLike = (postId) => api.post(`/likes/toggle/p/${postId}`)
export const getLikedVideos = () => api.get('/likes/videos')
