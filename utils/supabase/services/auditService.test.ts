import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auditService } from './auditService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { AuditLogInsert } from './auditService'

describe('auditService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { id: '123', action: 'test_action' }
    mockError = null

    // Create a mock of the Supabase client
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
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
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
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
    it('should get an audit log by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(auditService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByUser', () => {
    it('should get audit logs by user ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.getByUser(mockSupabase, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByAction', () => {
    it('should get audit logs by action', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.getByAction(mockSupabase, 'test_action')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual([mockData])
    })
  })

  describe('getRecent', () => {
    it('should get recent audit logs with default limit', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.getRecent(mockSupabase)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual([mockData])
    })

    it('should get recent audit logs with custom limit', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.getRecent(mockSupabase, 50)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create an audit log', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const logData: AuditLogInsert = {
        action: 'test_action',
        user_id: 'user123',
        details: { test: 'data' },
      }

      const result = await auditService.create(mockSupabase, logData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual(mockData)
    })
  })

  describe('search', () => {
    it('should search audit logs with query only', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.search(mockSupabase, 'test')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual([mockData])
    })

    it('should search audit logs with date range', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await auditService.search(
        mockSupabase, 
        'test', 
        '2023-01-01', 
        '2023-12-31',
        50
      )
      
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs')
      expect(result).toEqual([mockData])
    })
  })
})