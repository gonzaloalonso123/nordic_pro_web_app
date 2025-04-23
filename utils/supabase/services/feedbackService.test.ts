import { describe, it, expect, vi, beforeEach } from 'vitest'
import { feedbackService, FeedbackUpdate } from './feedbackService'
import type { TypedSupabaseClient } from '@/utils/types'

describe('feedbackService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { feedback_id: '123', player_id: 'player123', content: 'Great performance!' }
    mockError = null

    // Create a mock of the Supabase client
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation(() => Promise.resolve({ data: mockData, error: mockError })),
    } as unknown as TypedSupabaseClient

    // Mock the actual response
    vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
      return {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: vi.fn(),
        mockReturnValue: (returnValue: any) => {
          return {
            data: returnValue,
            error: null,
          }
        },
      }
    })
  })

  describe('getById', () => {
    it('should get feedback by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await feedbackService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(feedbackService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByPlayer', () => {
    it('should get feedback by player ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((callback) => {
          return Promise.resolve(callback(mockResponse));
        }),
      } as any))

      const result = await feedbackService.getByPlayer(mockSupabase, 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByEvent', () => {
    it('should get feedback by event ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((callback) => {
          return Promise.resolve(callback(mockResponse));
        }),
      } as any))

      const result = await feedbackService.getByEvent(mockSupabase, 'event123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create feedback', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const feedbackData = {
        player_id: 'player123',
        event_id: 'event123',
        content: 'Great performance!',
      }

      const result = await feedbackService.create(mockSupabase, feedbackData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update feedback', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates: FeedbackUpdate = {
        comment: 'Updated feedback',
      }

      const result = await feedbackService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete feedback', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((callback) => {
          return Promise.resolve(callback(mockResponse));
        }),
      } as any))

      await feedbackService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
    })
  })
})