import api from './axios'

export const createPost = (data) => api.post('/posts', data)
export const getUserPosts = (userId) => api.get(`/posts/user/${userId}`)
export const updatePost = (postId, data) => api.patch(`/posts/${postId}`, data)
export const deletePost = (postId) => api.delete(`/posts/${postId}`)
