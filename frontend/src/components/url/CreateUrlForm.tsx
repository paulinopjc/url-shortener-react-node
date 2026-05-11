import { useState, FormEvent } from 'react'
import { CreateUrlInput } from '../../types'

interface Props {
  onSubmit: (input: CreateUrlInput) => Promise<void>
  loading: boolean
}

export default function CreateUrlForm({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit({
      original_url: url,
      title: title || undefined,
      custom_code: customCode || undefined,
    })
    setUrl('')
    setTitle('')
    setCustomCode('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a long URL here..."
          required
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-3 text-sm text-gray-500 hover:text-gray-700"
      >
        {showAdvanced ? 'Hide options' : 'More options'}
      </button>

      {showAdvanced && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Custom code (optional)"
            maxLength={10}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </form>
  )
}
