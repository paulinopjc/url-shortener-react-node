import { useState, useEffect, useCallback } from 'react'
import { Url, CreateUrlInput } from '../types'
import { fetchUrls, createUrl, deleteUrl } from '../api/urlApi'
import CreateUrlForm from '../components/url/CreateUrlForm'
import UrlList from '../components/url/UrlList'

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4003/api/v1').replace('/api/v1', '')

export default function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUrls = useCallback(async () => {
    try {
      const data = await fetchUrls()
      setUrls(data)
    } catch {
      setError('Failed to load URLs')
    }
  }, [])

  useEffect(() => {
    loadUrls()
  }, [loadUrls])

  const handleCreate = async (input: CreateUrlInput) => {
    setLoading(true)
    setError(null)
    try {
      await createUrl(input)
      await loadUrls()
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { error?: string } } }).response?.data?.error
          : 'Failed to create URL'
      setError(message || 'Failed to create URL')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUrl(id)
      setUrls((prev) => prev.filter((u) => u.id !== id))
    } catch {
      setError('Failed to delete URL')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shorten a URL</h1>

      <CreateUrlForm onSubmit={handleCreate} loading={loading} />

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <UrlList urls={urls} onDelete={handleDelete} backendUrl={BACKEND_URL} />
    </div>
  )
}
