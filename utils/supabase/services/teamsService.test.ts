import { describe, it, expect, vi, beforeEach } from 'vitest'
import { teamsService } from './teamsService'
import type { TypedSupabaseClient } from '@/utils/types'

describe('teamsService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { team_id: '123', name: 'Test Team', organization_id: 'org123' }
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
    it('should get team by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await teamsService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('teams')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(teamsService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getAll', () => {
    it('should get all teams', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await teamsService.getAll(mockSupabase)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('teams')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create a team', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const teamData = {
        team_name: 'Test Team',
        organization_id: 'org123',
        description: 'A test team',
      }

      const result = await teamsService.create(mockSupabase, teamData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('teams')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update a team', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates = {
        team_name: 'Updated Team Name',
      }

      const result = await teamsService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('teams')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete a team', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await teamsService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('teams')
    })
  })
})