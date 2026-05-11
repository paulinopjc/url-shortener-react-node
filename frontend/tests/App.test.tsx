import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'

describe('App', () => {
  it('renders the header with app name', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Snip')).toBeInTheDocument()
    expect(screen.getByText('URL Shortener')).toBeInTheDocument()
  })

  it('renders the create form on the dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Shorten a URL')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Paste a long URL here...')).toBeInTheDocument()
    expect(screen.getByText('Shorten')).toBeInTheDocument()
  })

  it('renders 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('shows "More options" toggle for advanced fields', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('More options')).toBeInTheDocument()
  })
})
