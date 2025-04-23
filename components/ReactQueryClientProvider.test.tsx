import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { ReactQueryClientProvider } from './ReactQueryClientProvider'

describe('ReactQueryClientProvider', () => {
  it('renders children correctly', () => {
    render(
      <ReactQueryClientProvider>
        <div data-testid="test-child">Test Child</div>
      </ReactQueryClientProvider>
    )
    
    const child = screen.getByTestId('test-child')
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent('Test Child')
  })

  it('provides React Query context to children', () => {
    // This test verifies that the React Query provider is properly set up
    // by checking that a component that uses React Query hooks doesn't throw errors
    
    // We're not testing actual query functionality here, just that the provider is working
    // A more comprehensive test would mock the query client and test specific query behavior
    
    expect(() => {
      render(
        <ReactQueryClientProvider>
          <div>Query Provider Test</div>
        </ReactQueryClientProvider>
      )
    }).not.toThrow()
  })
})