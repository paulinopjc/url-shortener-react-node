import { Link } from 'react-router-dom'
import { Url } from '../../types'

interface Props {
  urls: Url[]
  onDelete: (id: number) => void
  backendUrl: string
}

export default function UrlList({ urls, onDelete, backendUrl }: Props) {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(`${backendUrl}/r/${code}`)
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No shortened URLs yet. Create one above.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => (
        <div key={url.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={`/urls/${url.id}`}
                className="text-indigo-600 font-medium text-sm hover:underline"
              >
                {backendUrl}/r/{url.code}
              </Link>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {url.click_count} click{url.click_count !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-sm truncate mt-1">
              {url.title ? `${url.title} - ` : ''}{url.original_url}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard(url.code)}
              className="text-gray-400 hover:text-gray-600 text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Copy short URL"
            >
              Copy
            </button>
            <button
              onClick={() => onDelete(url.id)}
              className="text-red-400 hover:text-red-600 text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
