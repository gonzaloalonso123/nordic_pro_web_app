import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, setupUser } from '@/test/utils'
import { ThemeSwitcher } from './theme-switcher'

// Mock the next-themes hook
vi.mock('next-themes', () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the theme switcher button', () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('displays the correct icon based on current theme', () => {
    const { useTheme } = require('next-themes')
    
    // Test light theme
    useTheme.mockReturnValue({ theme: 'light', setTheme: vi.fn() })
    const { rerender } = render(<ThemeSwitcher />)
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
    
    // Test dark theme
    useTheme.mockReturnValue({ theme: 'dark', setTheme: vi.fn() })
    rerender(<ThemeSwitcher />)
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
    
    // Test system theme
    useTheme.mockReturnValue({ theme: 'system', setTheme: vi.fn() })
    rerender(<ThemeSwitcher />)
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })

  it('opens dropdown menu when clicked', async () => {
    render(<ThemeSwitcher />)
    const user = setupUser()
    
    // Click the theme switcher button
    await user.click(screen.getByRole('button'))
    
    // Check that dropdown options are shown
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('calls setTheme when a theme option is selected', async () => {
    const setTheme = vi.fn()
    const { useTheme } = require('next-themes')
    useTheme.mockReturnValue({ theme: 'light', setTheme })
    
    render(<ThemeSwitcher />)
    const user = setupUser()
    
    // Open the dropdown
    await user.click(screen.getByRole('button'))
    
    // Click the Dark theme option
    await user.click(screen.getByText('Dark'))
    
    // Check that setTheme was called with 'dark'
    expect(setTheme).toHaveBeenCalledWith('dark')
  })
})