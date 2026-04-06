import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoService } from '../services/api'
import toast from 'react-hot-toast'

const Upload = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '' })
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  const handleVideoFile = (file) => {
    if (!file || !file.type.startsWith('video/')) return toast.error('Please select a video file')
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleVideoFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile) return toast.error('Please select a video')
    if (!thumbnail) return toast.error('Please add a thumbnail')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('videoFile', videoFile)
      fd.append('thumbnail', thumbnail)

      const res = await videoService.publish(fd)
      toast.success('Video published!')
      navigate(`/video/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Upload Video
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Share your content with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video drop zone */}
        {!videoFile ? (
          <div
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 cursor-pointer ${
              dragOver
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('video-input').click()}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/20">
              <i className="bi bi-cloud-arrow-up text-white text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Drop your video here
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">or click to browse</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">MP4, WebM, MOV supported</p>
            <input
              id="video-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={e => handleVideoFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group">
            <video src={videoPreview} controls className="w-full h-full" />
            <button
              type="button"
              onClick={() => { setVideoFile(null); setVideoPreview(null) }}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form fields */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Give your video a great title"
                className="input-field"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea
                placeholder="Tell viewers about your video"
                className="input-field resize-none"
                rows={5}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Thumbnail <span className="text-red-500">*</span></label>
            <div
              className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-400 cursor-pointer overflow-hidden relative group transition-all"
              onClick={() => document.getElementById('thumb-input').click()}
            >
              {thumbnailPreview
                ? <img src={thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                    <i className="bi bi-image text-3xl mb-2" />
                    <p className="text-xs">Click to upload</p>
                  </div>
                )
              }
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="bi bi-camera text-white text-xl" />
              </div>
            </div>
            <input id="thumb-input" type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
              <span className="text-sm text-gray-500">Please wait</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
            {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Uploading...</> : <><i className="bi bi-cloud-upload" /> Publish Video</>}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-8 py-3 text-base">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Upload
