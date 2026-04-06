import api from './axios'

export const registerUser = (formData) => api.post('/users/register', formData)
export const loginUser = (data) => api.post('/users/login', data)
export const logoutUser = () => api.post('/users/logout')
export const refreshTokens = () => api.post('/users/refresh-tokens')
export const changePassword = (data) => api.post('/users/change-password', data)
export const getCurrentUser = () => api.get('/users/current-user')
export const updateAccountDetails = (data) => api.patch('/users/update-account', data)
export const updateAvatar = (formData) => api.patch('/users/avatar', formData)
export const updateCoverImage = (formData) => api.patch('/users/cover-image', formData)
export const getUserChannelProfile = (userName) => api.get(`/users/channel/${userName}`)
export const getWatchHistory = () => api.get('/users/watch-history')
