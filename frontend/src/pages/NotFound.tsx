import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-4">Page not found</p>
      <Link to="/" className="text-indigo-600 hover:underline text-sm">
        Back to dashboard
      </Link>
    </div>
  )
}
