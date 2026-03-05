import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publishVideo } from '../api/video.api'
import toast from 'react-hot-toast'

const UploadPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '' })
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleFile = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    if (type === 'video') {
      setVideoFile(file)
    } else {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile) return toast.error('Video file required')
    if (!thumbnail) return toast.error('Thumbnail required')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('videoFile', videoFile)
      formData.append('thumbnail', thumbnail)
      const res = await publishVideo(formData)
      toast.success('Video published!')
      navigate(`/video/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Video</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Share your content with the world</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video file */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video File *</label>
          <label className={`flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${videoFile ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 bg-gray-50 dark:bg-gray-900'}`}>
            <i className={`bi ${videoFile ? 'bi-check-circle-fill text-purple-500' : 'bi-cloud-upload text-gray-400'} text-3xl mb-2`}></i>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {videoFile ? videoFile.name : 'Click to upload video'}
            </p>
            <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV up to 2GB</p>
            <input type="file" accept="video/*" onChange={(e) => handleFile(e, 'video')} className="hidden" />
          </label>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail *</label>
          <label className="flex cursor-pointer">
            <div className={`flex-1 aspect-video rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${thumbnailPreview ? 'border-purple-400' : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 bg-gray-50 dark:bg-gray-900'}`}>
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <i className="bi bi-image text-3xl text-gray-400 mb-2 block"></i>
                  <p className="text-sm text-gray-500">Upload thumbnail</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'thumb')} className="hidden" />
          </label>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Give your video a great title..."
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 text-gray-800 dark:text-gray-200 outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Tell viewers about your video..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 text-gray-800 dark:text-gray-200 outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Uploading...</>
          ) : (
            <><i className="bi bi-upload"></i> Publish Video</>
          )}
        </button>
      </form>
    </div>
  )
}

export default UploadPage
