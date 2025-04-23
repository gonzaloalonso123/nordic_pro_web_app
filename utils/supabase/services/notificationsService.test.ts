import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notificationsService } from './notificationsService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { NotificationInsert, NotificationUpdate, NotificationType } from './notificationsService'

describe('notificationsService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { notification_id: '123', user_id: 'user123', title: 'Test Notification', message: 'This is a test', type: 'general' }
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
    it('should get notification by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await notificationsService.getById(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(notificationsService.getById(mockSupabase, '123')).rejects.toThrow()
    })
  })

  describe('getByUser', () => {
    it('should get notifications by user ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await notificationsService.getByUser(mockSupabase, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result).toEqual([mockData])
    })
  })

  describe('getUnreadByUser', () => {
    it('should get unread notifications by user ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await notificationsService.getUnreadByUser(mockSupabase, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result).toEqual([mockData])
    })
  })

  describe('getByTypeAndUser', () => {
    it('should get notifications by type and user ID', async () => {
      const mockResponse = { data: [mockData], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const type: NotificationType = 'general'
      const result = await notificationsService.getByTypeAndUser(mockSupabase, type, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result).toEqual([mockData])
    })
  })

  describe('create', () => {
    it('should create a notification', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const notificationData: NotificationInsert = {
        user_id: 'user123',
        title: 'Test Notification',
        message: 'This is a test',
        type: 'general',
        is_read: false,
      }

      const result = await notificationsService.create(mockSupabase, notificationData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result).toEqual(mockData)
    })
  })

  describe('createBatch', () => {
    it('should create notifications for multiple users', async () => {
      const mockBatchData = [mockData, { ...mockData, user_id: 'user456' }]
      const mockResponse = { data: mockBatchData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const userIds = ['user123', 'user456']
      const title = 'Test Notification'
      const message = 'This is a test'
      const type: NotificationType = 'general'

      const result = await notificationsService.createBatch(mockSupabase, userIds, title, message, type)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result).toEqual(mockBatchData)
    })
  })

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const mockResponse = { data: { ...mockData, is_read: true }, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await notificationsService.markAsRead(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
      expect(result.is_read).toBe(true)
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for a user', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await notificationsService.markAllAsRead(mockSupabase, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
    })
  })

  describe('delete', () => {
    it('should delete a notification', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await notificationsService.delete(mockSupabase, '123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
    })
  })

  describe('deleteAllForUser', () => {
    it('should delete all notifications for a user', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await notificationsService.deleteAllForUser(mockSupabase, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('notifications')
    })
  })
})