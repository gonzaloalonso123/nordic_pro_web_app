import { describe, it, expect, vi } from 'vitest'
import { render, screen, setupUser } from '@/test/utils'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders correctly with default props', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders in checked state when defaultChecked is true', () => {
    render(<Checkbox defaultChecked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('calls onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} />)
    const user = setupUser()
    const checkbox = screen.getByRole('checkbox')
    
    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('renders as disabled when disabled prop is true', () => {
    render(<Checkbox disabled />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('passes additional props to the checkbox element', () => {
    render(<Checkbox id="test-id" aria-label="Test checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id', 'test-id')
    expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox')
  })
})