import api from './axios'

export const getAllVideos = (params) => api.get('/videos', { params })
export const publishVideo = (formData) => api.post('/videos', formData)
export const getVideoById = (videoId) => api.get(`/videos/${videoId}`)
export const updateVideo = (videoId, formData) => api.patch(`/videos/${videoId}`, formData)
export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`)
export const togglePublishStatus = (videoId) => api.patch(`/videos/toggle/publish/${videoId}`)
