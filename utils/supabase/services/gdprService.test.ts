import { describe, it, expect, vi, beforeEach } from 'vitest'
import { gdprService } from './gdprService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { GdprConsentInsert, GdprConsentUpdate, ConsentDetails } from './gdprService'

describe('gdprService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { 
      consent_id: '123', 
      parent_id: 'parent123', 
      child_id: 'child123', 
      consent_given: true,
      consent_details: { chat: true, voting: true, feedback: true, photos: true },
      revoked: false
    }
    mockError = null

    // Create a mock of the Supabase client
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation(() => Promise.resolve({ data: mockData, error: mockError })),
    } as unknown as TypedSupabaseClient

    // Mock the actual response
    vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
      return {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
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
    it('should get GDPR consent by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await gdprService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(gdprService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByParentAndChild', () => {
    it('should get GDPR consent by parent and child IDs', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await gdprService.getByParentAndChild(mockSupabase, 'parent123', 'child123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual(mockData)
    })

    it('should return null if no rows are found (PGRST116 error)', async () => {
      const mockResponse = { data: null, error: { code: 'PGRST116' } }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await gdprService.getByParentAndChild(mockSupabase, 'parent123', 'child123')
      
      expect(result).toBeNull()
    })

    it('should throw an error for other error types', async () => {
      const mockResponse = { data: null, error: { code: 'OTHER_ERROR' } }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(gdprService.getByParentAndChild(mockSupabase, 'parent123', 'child123')).rejects.toThrow()
    })
  })

  describe('getByParent', () => {
    it('should get GDPR consents by parent ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await gdprService.getByParent(mockSupabase, 'parent123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByChild', () => {
    it('should get GDPR consents by child ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await gdprService.getByChild(mockSupabase, 'child123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create a GDPR consent', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const consentData: GdprConsentInsert = {
        parent_id: 'parent123',
        child_id: 'child123',
        consent_given: true,
        consent_details: { chat: true, voting: true, feedback: true, photos: true },
      }

      const result = await gdprService.create(mockSupabase, consentData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update a GDPR consent', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates: GdprConsentUpdate = {
        consent_given: false,
        consent_details: { chat: false, voting: false, feedback: true, photos: true },
      }

      const result = await gdprService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual(mockData)
    })
  })

  describe('revoke', () => {
    it('should revoke a GDPR consent', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await gdprService.revoke(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toEqual(mockData)
    })
  })

  describe('checkSpecificConsent', () => {
    it('should return true if specific consent is given', async () => {
      const mockResponse = { data: [{ consent_details: { chat: true } }], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((callback) => {
          callback(mockResponse);
          return Promise.resolve(mockResponse);
        }),
      } as any))

      const result = await gdprService.checkSpecificConsent(mockSupabase, 'child123', 'chat')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gdpr_consent')
      expect(result).toBe(true)
    })

    it('should return false if specific consent is not given', async () => {
      const mockResponse = { data: [{ consent_details: { chat: false } }], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((callback) => {
          callback(mockResponse);
          return Promise.resolve(mockResponse);
        }),
      } as any))

      const result = await gdprService.checkSpecificConsent(mockSupabase, 'child123', 'chat')
      
      expect(result).toBe(false)
    })

    it('should return false if no consents are found', async () => {
      const mockResponse = { data: [], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((callback) => {
          callback(mockResponse);
          return Promise.resolve(mockResponse);
        }),
      } as any))

      const result = await gdprService.checkSpecificConsent(mockSupabase, 'child123', 'chat')
      
      expect(result).toBe(false)
    })
  })
})
