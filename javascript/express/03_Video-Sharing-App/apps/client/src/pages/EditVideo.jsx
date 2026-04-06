import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { videoService } from '../services/api'
import { PageLoader } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const EditVideo = () => {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  useEffect(() => {
    videoService.getById(videoId)
      .then(res => {
        const v = res.data.data
        setVideo(v)
        setForm({ title: v.title, description: v.description })
      })
      .catch(() => toast.error('Video not found'))
      .finally(() => setLoading(false))
  }, [videoId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      if (thumbnail) fd.append('thumbnail', thumbnail)
      await videoService.update(videoId, fd)
      toast.success('Video updated!')
      navigate(`/video/${videoId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />
  if (!video) return <div className="text-center py-20 text-gray-400">Video not found</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Edit Video</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
              <input type="text" className="input-field" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={6} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Thumbnail</label>
            <div
              className="aspect-video rounded-2xl overflow-hidden cursor-pointer relative group"
              onClick={() => document.getElementById('edit-thumb').click()}
            >
              <img src={thumbnailPreview || video.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="bi bi-camera text-white text-2xl" />
              </div>
            </div>
            <input id="edit-thumb" type="file" accept="image/*" className="hidden" onChange={e => {
              const file = e.target.files[0]
              if (file) { setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)) }
            }} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <><i className="bi bi-arrow-repeat animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(`/video/${videoId}`)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default EditVideo
