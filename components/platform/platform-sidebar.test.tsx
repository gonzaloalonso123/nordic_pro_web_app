import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, setupUser } from '@/test/utils'
import PlatformSidebar from './platform-sidebar'

// Mock the next/navigation hook
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return {
    ...actual,
    usePathname: vi.fn().mockReturnValue('/platform'),
  }
})

describe('PlatformSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the sidebar with navigation links', () => {
    render(<PlatformSidebar />)
    
    // Check for navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
    expect(screen.getByText('Mental Health')).toBeInTheDocument()
    expect(screen.getByText('Motivation')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('highlights the active navigation link based on current path', () => {
    render(<PlatformSidebar />)
    
    // The Dashboard link should be highlighted (active)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveClass('bg-primary')
    expect(dashboardLink).toHaveClass('text-white')
    
    // Other links should not be highlighted
    const teamLink = screen.getByText('Team').closest('a')
    expect(teamLink).not.toHaveClass('bg-primary')
    expect(teamLink).not.toHaveClass('text-white')
  })

  it('collapses the sidebar when collapse button is clicked', async () => {
    render(<PlatformSidebar />)
    const user = setupUser()
    
    // Initially sidebar should be expanded
    expect(screen.getByText('Dashboard')).toBeVisible()
    
    // Click the collapse button
    const collapseButton = screen.getByRole('button', { name: /collapse sidebar/i })
    await user.click(collapseButton)
    
    // After clicking, the sidebar should be collapsed
    // We can't easily test for CSS classes directly, but we can check that the expand button is now visible
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument()
  })

  it('renders the Pro Features section', () => {
    render(<PlatformSidebar />)
    
    expect(screen.getByText('Pro Features')).toBeInTheDocument()
    expect(screen.getByText('Unlock advanced analytics and team insights.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument()
  })

  it('renders the mobile sidebar toggle button', () => {
    render(<PlatformSidebar />)
    
    const mobileToggleButton = screen.getByRole('button', { name: '' })
    expect(mobileToggleButton).toBeInTheDocument()
    expect(mobileToggleButton.querySelector('svg')).toBeInTheDocument() // Check for the menu icon
  })
})