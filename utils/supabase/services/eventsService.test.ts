import { describe, it, expect, vi, beforeEach } from 'vitest'
import { eventsService } from './eventsService'
import type { TypedSupabaseClient } from '@/utils/types'

describe('eventsService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { event_id: '123', title: 'Test Event', team_id: 'team123', start_time: '2023-01-01T10:00:00Z' }
    mockError = null

    // Create a mock of the Supabase client
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation(() => Promise.resolve({ data: mockData, error: mockError })),
    } as unknown as TypedSupabaseClient
  })

  describe('getById', () => {
    it('should get event by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await eventsService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(eventsService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByTeam', () => {
    it('should get events by team ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await eventsService.getByTeam(mockSupabase, 'team123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual([mockData])
    })
  })

  describe('getUpcoming', () => {
    it('should get upcoming events', async () => {
      const mockResponse = { data: [mockData], error: null }
      // For getUpcoming without limit, we need to mock the query chain that ends with order()
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await eventsService.getUpcoming(mockSupabase)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual([mockData])
    })

    it('should get upcoming events with custom limit', async () => {
      const mockResponse = { data: [mockData], error: null }
      // For getUpcoming with limit, we need to mock the query chain that ends with limit()
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await eventsService.getUpcoming(mockSupabase, 5)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByDateRange', () => {
    it('should get events by date range', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await eventsService.getByDateRange(
        mockSupabase, 
        '2023-01-01T00:00:00Z', 
        '2023-01-31T23:59:59Z'
      )
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create an event', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const eventData = {
        title: 'Test Event',
        team_id: 'team123',
        start_time: '2023-01-01T10:00:00Z',
        end_time: '2023-01-01T12:00:00Z',
        location: 'Test Location',
      }

      const result = await eventsService.create(mockSupabase, eventData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update an event', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates = {
        title: 'Updated Event',
        location: 'New Location',
      }

      const result = await eventsService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete an event', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await eventsService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
    })
  })
})