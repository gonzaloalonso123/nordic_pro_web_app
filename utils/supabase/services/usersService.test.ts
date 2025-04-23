import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usersService } from './usersService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { UserInsert, UserUpdate, UserRole } from './usersService'

describe('usersService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { user_id: '123', full_name: 'Test User', email: 'test@example.com', role: 'player' }
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

  describe('getAll', () => {
    it('should get all users', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getAll(mockSupabase)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual([mockData])
    })
  })

  describe('getById', () => {
    it('should get user by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(usersService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByEmail', () => {
    it('should get user by email', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getByEmail(mockSupabase, 'test@example.com')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual(mockData)
    })
  })

  describe('getByRole', () => {
    it('should get users by role', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const role: UserRole = 'player'
      const result = await usersService.getByRole(mockSupabase, role)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByTeam', () => {
    it('should get users by team ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getByTeam(mockSupabase, 'team123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual([mockData])
    })
  })

  describe('getPlayersByTeam', () => {
    it('should get players by team ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getPlayersByTeam(mockSupabase, 'team123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual([mockData])
    })
  })

  describe('getCoachesByTeam', () => {
    it('should get coaches by team ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getCoachesByTeam(mockSupabase, 'team123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual([mockData])
    })
  })

  describe('getChildren', () => {
    it('should get children of a parent', async () => {
      const mockChildData = { user_id: '456', full_name: 'Child User' }
      const mockResponse = { data: [{ child: mockChildData }], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getChildren(mockSupabase, 'parent123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('parent_child')
      expect(result).toEqual([mockChildData])
    })
  })

  describe('getParents', () => {
    it('should get parents of a child', async () => {
      const mockParentData = { user_id: '789', full_name: 'Parent User' }
      const mockResponse = { data: [{ parent: mockParentData }], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.getParents(mockSupabase, 'child123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('parent_child')
      expect(result).toEqual([mockParentData])
    })
  })

  describe('create', () => {
    it('should create a user', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const userData: UserInsert = {
        full_name: 'Test User',
        email: 'test@example.com',
        role: 'player',
      }

      const result = await usersService.create(mockSupabase, userData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates: UserUpdate = {
        full_name: 'Updated Name',
      }

      const result = await usersService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await usersService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('users')
    })
  })

  describe('addParentChild', () => {
    it('should add a parent-child relationship', async () => {
      const mockRelationData = [{ parent_id: 'parent123', child_id: 'child123' }]
      const mockResponse = { data: mockRelationData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await usersService.addParentChild(mockSupabase, 'parent123', 'child123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('parent_child')
      expect(result).toEqual(mockRelationData)
    })
  })

  describe('removeParentChild', () => {
    it('should remove a parent-child relationship', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await usersService.removeParentChild(mockSupabase, 'parent123', 'child123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('parent_child')
    })
  })
})