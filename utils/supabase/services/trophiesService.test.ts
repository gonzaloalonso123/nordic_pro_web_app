import { describe, it, expect, vi, beforeEach } from 'vitest'
import { trophiesService } from './trophiesService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { TrophyInsert, TrophyUpdate } from './trophiesService'

describe('trophiesService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { trophy_id: '123', player_id: 'player123', trophy_type: 'gold', week_start_date: '2023-01-01' }
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
    it('should get trophy by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await trophiesService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(trophiesService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByWeek', () => {
    it('should get trophies by week', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await trophiesService.getByWeek(mockSupabase, '2023-01-01')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByPlayer', () => {
    it('should get trophies by player ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await trophiesService.getByPlayer(mockSupabase, 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByTypeAndWeek', () => {
    it('should get trophies by type and week', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await trophiesService.getByTypeAndWeek(mockSupabase, 'gold', '2023-01-01')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual([mockData])
    })
  })

  describe('getPlayerWeekTrophies', () => {
    it('should get player\'s trophies for a specific week', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await trophiesService.getPlayerWeekTrophies(mockSupabase, 'player123', '2023-01-01')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create a trophy', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const trophyData: TrophyInsert = {
        player_id: 'player123',
        trophy_type: 'gold',
        week_start_date: '2023-01-01',
      }

      const result = await trophiesService.create(mockSupabase, trophyData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update a trophy', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates: TrophyUpdate = {
        trophy_type: 'green',
      }

      const result = await trophiesService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete a trophy', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await trophiesService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
    })
  })

  describe('countByPlayer', () => {
    it('should count trophies by player', async () => {
      const mockTrophiesData = [
        { trophy_type: 'gold' },
        { trophy_type: 'gold' },
        { trophy_type: 'green' },
      ]
      const mockResponse = { data: mockTrophiesData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await trophiesService.countByPlayer(mockSupabase, 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('trophies')
      expect(result).toEqual({ gold: 2, green: 1, total: 3 })
    })
  })
})