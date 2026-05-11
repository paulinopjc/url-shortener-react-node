import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Url, ClickStats } from '../types'
import { fetchUrl, fetchClicks } from '../api/urlApi'
import ClickChart from '../components/url/ClickChart'

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4003/api/v1').replace('/api/v1', '')

export default function UrlDetail() {
  const { id } = useParams<{ id: string }>()
  const [url, setUrl] = useState<Url | null>(null)
  const [stats, setStats] = useState<ClickStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const [urlData, clickData] = await Promise.all([
          fetchUrl(Number(id)),
          fetchClicks(Number(id)),
        ])
        setUrl(urlData)
        setStats(clickData)
      } catch {
        setError('URL not found')
      }
    }
    load()
  }, [id])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">Back to dashboard</Link>
      </div>
    )
  }

  if (!url || !stats) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>
  }

  const shortUrl = `${BACKEND_URL}/r/${url.code}`

  return (
    <div>
      <Link to="/" className="text-indigo-600 hover:underline text-sm mb-6 inline-block">
        &larr; Back to dashboard
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-lg font-bold text-gray-900">
          {url.title || url.code}
        </h1>
        <p className="text-indigo-600 text-sm mt-1">{shortUrl}</p>
        <p className="text-gray-500 text-sm mt-1 break-all">{url.original_url}</p>
        <p className="text-gray-400 text-xs mt-2">
          Created {new Date(url.created_at).toLocaleDateString()}
        </p>
      </div>

      <ClickChart stats={stats} />
    </div>
  )
}
