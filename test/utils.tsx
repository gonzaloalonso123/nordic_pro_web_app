import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: '/',
      query: {},
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }
})

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
  },
  from: () => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }),
}

vi.mock('@/utils/supabase/browser', () => {
  return {
    default: () => mockSupabase,
  }
})

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
}

/**
 * Custom render function that wraps the component with necessary providers
 */
function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ReactQueryClientProvider>
        {children}
      </ReactQueryClientProvider>
    )
  }

  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Setup user event for testing interactions
 */
function setupUser(): UserEvent {
  return userEvent.setup()
}

export * from '@testing-library/react'
export { customRender as render, setupUser }