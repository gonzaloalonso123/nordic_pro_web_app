import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Input } from './input'

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('h-10')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />)
    expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" placeholder="Email input" />)
    expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password input" />)
    expect(screen.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('passes additional props to the input element', () => {
    render(
      <Input 
        id="test-id" 
        placeholder="Test placeholder" 
        disabled 
        required 
        aria-label="Test input"
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-id')
    expect(input).toHaveAttribute('placeholder', 'Test placeholder')
    expect(input).toBeDisabled()
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-label', 'Test input')
  })
})