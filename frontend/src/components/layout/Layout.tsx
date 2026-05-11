import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
            Snip
          </Link>
          <span className="text-sm text-gray-500">URL Shortener</span>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-400">
        Built with React + Node.js + TypeScript
      </footer>
    </div>
  )
}
