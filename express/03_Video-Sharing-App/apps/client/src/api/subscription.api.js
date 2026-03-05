import api from './axios'

export const toggleSubscription = (channelId) => api.post(`/subscriptions/channel/${channelId}`)
export const getUserChannelSubscribers = (subscriberId) => api.get(`/subscriptions/u/${subscriberId}`)
export const getSubscribedChannels = (channelId) => api.get(`/subscriptions/channel/${channelId}`)
