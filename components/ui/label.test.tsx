import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Label } from './label'

describe('Label', () => {
  it('renders correctly with default props', () => {
    render(<Label>Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm')
    expect(label).toHaveClass('font-medium')
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>)
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-class')
  })

  it('passes additional props to the label element', () => {
    render(
      <Label 
        id="test-id" 
        htmlFor="test-input"
        aria-label="Test label"
      >
        For Input
      </Label>
    )
    const label = screen.getByText('For Input')
    expect(label).toHaveAttribute('id', 'test-id')
    expect(label).toHaveAttribute('for', 'test-input')
    expect(label).toHaveAttribute('aria-label', 'Test label')
  })

  it('works with form elements', () => {
    render(
      <div>
        <Label htmlFor="test-input">Email</Label>
        <input id="test-input" type="email" />
      </div>
    )
    const label = screen.getByText('Email')
    const input = screen.getByRole('textbox')
    expect(label).toHaveAttribute('for', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
  })
})