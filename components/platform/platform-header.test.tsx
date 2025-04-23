import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, setupUser } from '../../test/utils'
import PlatformHeader from './platform-header'

// Mock the hooks used in the component
vi.mock('@/app/actions', () => ({
  useCurrentUser: vi.fn().mockReturnValue({ id: 'user-123', email: 'test@example.com' }),
}))

vi.mock('@/hooks/queries', () => ({
  useNotificationsByUser: vi.fn().mockReturnValue({
    data: [
      { id: 'notif-1', type: 'notification', message: 'Test notification 1', read: false },
      { id: 'notif-2', type: 'notification', message: 'Test notification 2', read: true },
      { id: 'msg-1', type: 'message', message: 'Test message 1', read: false },
    ],
    isPending: false,
    isError: false,
  }),
}))

describe('PlatformHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the header with logo and search bar', () => {
    render(<PlatformHeader />)
    
    // Check for logo
    expect(screen.getByText('NordicPro')).toBeInTheDocument()
    
    // Check for search bar
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('renders the right menu with notification and user dropdown', () => {
    render(<PlatformHeader />)
    
    // Check for notification and message buttons
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /messages/i })).toBeInTheDocument()
    
    // Check for user dropdown
    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument()
  })

  it('shows notification count badge when there are notifications', () => {
    render(<PlatformHeader />)
    
    // Check for notification badge
    const notificationButton = screen.getByRole('button', { name: /notifications/i })
    const badge = notificationButton.querySelector('.bg-accent')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('2') // Two notifications
  })

  it('shows message count badge when there are messages', () => {
    render(<PlatformHeader />)
    
    // Check for message badge
    const messageButton = screen.getByRole('button', { name: /messages/i })
    const badge = messageButton.querySelector('.bg-accent')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('1') // One message
  })

  it('opens user dropdown when clicked', async () => {
    render(<PlatformHeader />)
    const user = setupUser()
    
    // Click user menu button
    await user.click(screen.getByRole('button', { name: /user menu/i }))
    
    // Check that dropdown is shown
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Log out')).toBeInTheDocument()
  })
})