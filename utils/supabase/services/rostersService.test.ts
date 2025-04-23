import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rostersService } from './rostersService'
import type { TypedSupabaseClient } from '@/utils/types'

describe('rostersService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { roster_id: '123', team_id: 'team123', player_id: 'player123', position: 'forward' }
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
    it('should get roster entry by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(rostersService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByPlayer', () => {
    it('should get roster entries by player ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.getByPlayer(mockSupabase, 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByEvent', () => {
    it('should get roster entries by event ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.getByEvent(mockSupabase, 'event123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual([mockData])
    })
  })

  describe('getPlayerEventRoster', () => {
    it('should get player roster status for an event', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.getPlayerEventRoster(mockSupabase, 'event123', 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual(mockData)
    })

    it('should handle case when no roster entry exists', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows returned' }
      const mockResponse = { data: null, error: mockError }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.getPlayerEventRoster(mockSupabase, 'event123', 'player123')
      
      expect(result).toBeNull()
    })

    it('should throw an error for other error codes', async () => {
      const mockError = { code: 'OTHER_ERROR', message: 'Some other error' }
      const mockResponse = { data: null, error: mockError }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(rostersService.getPlayerEventRoster(mockSupabase, 'event123', 'player123')).rejects.toThrow()
    })
  })

  describe('createBatch', () => {
    it('should create roster entries for multiple players', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const eventId = 'event123'
      const playerIds = ['player123', 'player456']

      const result = await rostersService.createBatch(mockSupabase, eventId, playerIds)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual([mockData])
    })
  })

  describe('updateResponse', () => {
    it('should update a roster response', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const response = 'confirmed' as const

      const result = await rostersService.updateResponse(mockSupabase, '123', response)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual(mockData)
    })
  })

  describe('updateResponseByEventAndPlayer', () => {
    it('should update a roster response by event and player', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const response = 'confirmed' as const

      const result = await rostersService.updateResponseByEventAndPlayer(mockSupabase, 'event123', 'player123', response)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete a roster entry', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toBe(true)
    })
  })

  describe('deleteByEvent', () => {
    it('should delete all roster entries for an event', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await rostersService.deleteByEvent(mockSupabase, 'event123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('rosters')
      expect(result).toBe(true)
    })
  })
})