import { describe, it, expect, vi, beforeEach } from 'vitest'
import { playerRatingsService } from './playerRatingsService'
import type { TypedSupabaseClient } from '@/utils/types'

describe('playerRatingsService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { rating_id: '123', player_id: 'player123', coach_id: 'coach123', rating: 4.5 }
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
      avg: vi.fn().mockReturnThis(),
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
        avg: vi.fn().mockReturnThis(),
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
    it('should get player rating by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(playerRatingsService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByRatee', () => {
    it('should get ratings received by a player', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getByRatee(mockSupabase, 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByRater', () => {
    it('should get ratings given by a player', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getByRater(mockSupabase, 'coach123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual([mockData])
    })
  })

  describe('getAveragePerformanceRating', () => {
    it('should get average performance rating for a player in a week', async () => {
      const mockRatingsData = [
        { performance_rating: 4 },
        { performance_rating: 5 }
      ]
      const mockResponse = { data: mockRatingsData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getAveragePerformanceRating(mockSupabase, 'player123', '2023-01-01')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual(4.5)
    })

    it('should return 0 if no ratings exist', async () => {
      const mockResponse = { data: [], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getAveragePerformanceRating(mockSupabase, 'player123', '2023-01-01')
      
      expect(result).toEqual(0)
    })
  })

  describe('getAverageAttitudeRating', () => {
    it('should get average attitude rating for a player in a week', async () => {
      const mockRatingsData = [
        { attitude_rating: 3 },
        { attitude_rating: 5 }
      ]
      const mockResponse = { data: mockRatingsData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getAverageAttitudeRating(mockSupabase, 'player123', '2023-01-01')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual(4)
    })

    it('should return 0 if no ratings exist', async () => {
      const mockResponse = { data: [], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await playerRatingsService.getAverageAttitudeRating(mockSupabase, 'player123', '2023-01-01')
      
      expect(result).toEqual(0)
    })
  })

  describe('create', () => {
    it('should create a player rating', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const ratingData = {
        ratee_id: 'player123',
        rater_id: 'coach123',
        performance_rating: 4,
        attitude_rating: 5,
        week_start_date: '2023-01-01',
        notes: 'Good performance',
      }

      const result = await playerRatingsService.create(mockSupabase, ratingData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update a player rating', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates = {
        comment: 'Updated comment',
      }

      const result = await playerRatingsService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete a player rating', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await playerRatingsService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('player_ratings')
    })
  })
})