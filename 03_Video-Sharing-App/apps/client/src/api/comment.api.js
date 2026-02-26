import api from './axios'

export const getVideoComments = (videoId, params) => api.get(`/comments/${videoId}`, { params })
export const addComment = (videoId, data) => api.post(`/comments/${videoId}`, data)
export const updateComment = (commentId, data) => api.patch(`/comments/channel/${commentId}`, data)
export const deleteComment = (commentId) => api.delete(`/comments/channel/${commentId}`)
