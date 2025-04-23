import { describe, it, expect, vi, beforeEach } from 'vitest'
import { attendanceService } from './attendanceService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { AttendanceInsert, AttendanceUpdate } from './attendanceService'

describe('attendanceService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { attendance_id: '123', event_id: 'event123', player_id: 'player123', attending: true }
    mockError = null

    // Create a mock of the Supabase client
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
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
        upsert: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
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
    it('should get attendance by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await attendanceService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(attendanceService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByEvent', () => {
    it('should get attendance by event ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await attendanceService.getByEvent(mockSupabase, 'event123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByPlayer', () => {
    it('should get attendance by player ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await attendanceService.getByPlayer(mockSupabase, 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
      expect(result).toEqual([mockData])
    })
  })

  describe('getPlayerEventAttendance', () => {
    it('should get player\'s attendance for an event', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await attendanceService.getPlayerEventAttendance(mockSupabase, 'event123', 'player123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
      expect(result).toEqual(mockData)
    })

    it('should not throw error for PGRST116 (no rows returned)', async () => {
      const mockResponse = { data: null, error: { code: 'PGRST116' } }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await attendanceService.getPlayerEventAttendance(mockSupabase, 'event123', 'player123')
      
      expect(result).toBeNull()
    })

    it('should throw error for other error codes', async () => {
      const mockResponse = { data: null, error: { code: 'OTHER_ERROR' } }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(attendanceService.getPlayerEventAttendance(mockSupabase, 'event123', 'player123')).rejects.toThrow()
    })
  })

  describe('upsert', () => {
    it('should upsert attendance record', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const attendanceData: AttendanceInsert = {
        event_id: 'event123',
        player_id: 'player123',
        attending: true,
      }

      const result = await attendanceService.upsert(mockSupabase, attendanceData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update attendance record', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates: AttendanceUpdate = {
        attending: false,
        reason: 'Sick',
      }

      const result = await attendanceService.update(mockSupabase, '123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
      expect(result).toEqual(mockData)
    })
  })

  describe('delete', () => {
    it('should delete attendance record', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await attendanceService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('attendance')
    })
  })
})