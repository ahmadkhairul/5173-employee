import { render, screen } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import App from './App'
import { MemoryRouter } from 'react-router-dom'
import * as loginService from './api/loginService'

// Mock getToken
vi.mock('./api/loginService', () => ({
  getToken: vi.fn(),
}))

// Mock lazy-loaded pages
vi.mock('./pages/LoginPage', () => ({
  default: () => <div>Login Page Mock</div>,
}))
vi.mock('./pages/EmployeePage', () => ({
  default: () => <div>Employee Page Mock</div>,
}))

// DRY helper
function renderWithRoute(route, token) {
  loginService.getToken.mockReturnValue(token)
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

describe('App routing and auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login if no token and accessing /employee', async () => {
    renderWithRoute('/employee', null)
    expect(await screen.findByText('Login Page Mock')).toBeInTheDocument()
  })

  it('redirects to employee if token exists and accessing /login', async () => {
    renderWithRoute('/login', 'mocktoken')
    expect(await screen.findByText('Employee Page Mock')).toBeInTheDocument()
  })

  it('renders employee page if token exists and access /employee', async () => {
    renderWithRoute('/employee', 'mocktoken')
    expect(await screen.findByText('Employee Page Mock')).toBeInTheDocument()
  })

  it('renders login page if accessing /login and not logged in', async () => {
    renderWithRoute('/login', null)
    expect(await screen.findByText('Login Page Mock')).toBeInTheDocument()
  })

  it('navigates wildcard route correctly', async () => {
    renderWithRoute('/unknownroute', null)
    expect(await screen.findByText('Login Page Mock')).toBeInTheDocument()
  })
})
