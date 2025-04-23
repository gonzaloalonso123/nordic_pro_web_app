import { describe, it, expect, vi, beforeEach } from 'vitest'
import { chatService } from './chatService'
import type { TypedSupabaseClient } from '@/utils/types'
import type { ChatRoomInsert, ChatRoomUpdate, MessageInsert } from './chatService'

describe('chatService', () => {
  let mockSupabase: TypedSupabaseClient
  let mockData: any
  let mockError: any

  beforeEach(() => {
    mockData = { room_id: 'room123', name: 'Test Room' }
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

  describe('getRoomById', () => {
    it('should get a chat room by ID', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await chatService.getRoomById(mockSupabase, 'room123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_rooms')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if the query fails', async () => {
      const mockResponse = { data: null, error: new Error('Query failed') }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await expect(chatService.getRoomById(mockSupabase, 'room123')).rejects.toThrow()
    })
  })

  describe('getRoomsByUser', () => {
    it('should get chat rooms for a user', async () => {
      const mockRoomData = { room_id: 'room123', name: 'Test Room', participants: [] }
      const mockResponse = { data: [{ room: mockRoomData }], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await chatService.getRoomsByUser(mockSupabase, 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_participants')
      expect(result).toEqual([mockRoomData])
    })
  })

  describe('getRoomParticipants', () => {
    it('should get room participants', async () => {
      const mockUserData = { user_id: 'user123', full_name: 'Test User' }
      const mockResponse = { data: [{ user: mockUserData }], error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await chatService.getRoomParticipants(mockSupabase, 'room123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_participants')
      expect(result).toEqual([mockUserData])
    })
  })

  describe('createRoom', () => {
    it('should create a chat room with participants', async () => {
      // Mock for room creation
      const mockRoomResponse = { data: mockData, error: null }
      const mockParticipantsResponse = { data: null, error: null }
      
      let fromCallCount = 0
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        fromCallCount++
        if (fromCallCount === 1) {
          // First call for room creation
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockImplementation(() => Promise.resolve(mockRoomResponse)),
          } as any
        } else {
          // Second call for participants
          return {
            insert: vi.fn().mockImplementation(() => Promise.resolve(mockParticipantsResponse)),
          } as any
        }
      })

      const roomData: ChatRoomInsert = {
        created_by: 'user123',
      }

      const participantIds = ['user123', 'user456']

      const result = await chatService.createRoom(mockSupabase, roomData, participantIds)
      
      expect(mockSupabase.from).toHaveBeenCalledTimes(2)
      expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'chat_rooms')
      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'chat_participants')
      expect(result).toEqual(mockData)
    })

    it('should throw an error if room creation fails', async () => {
      const mockRoomResponse = { data: null, error: new Error('Room creation failed') }
      
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockRoomResponse)),
      } as any))

      const roomData: ChatRoomInsert = {
        name: 'Test Room',
        created_by: 'user123',
      }

      const participantIds = ['user123', 'user456']

      await expect(chatService.createRoom(mockSupabase, roomData, participantIds)).rejects.toThrow()
    })

    it('should throw an error if adding participants fails', async () => {
      // Mock for room creation success but participants failure
      const mockRoomResponse = { data: mockData, error: null }
      const mockParticipantsResponse = { data: null, error: new Error('Adding participants failed') }
      
      let fromCallCount = 0
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        fromCallCount++
        if (fromCallCount === 1) {
          // First call for room creation
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockImplementation(() => Promise.resolve(mockRoomResponse)),
          } as any
        } else {
          // Second call for participants
          return {
            insert: vi.fn().mockImplementation(() => Promise.resolve(mockParticipantsResponse)),
          } as any
        }
      })

      const roomData: ChatRoomInsert = {
        name: 'Test Room',
        created_by: 'user123',
      }

      const participantIds = ['user123', 'user456']

      await expect(chatService.createRoom(mockSupabase, roomData, participantIds)).rejects.toThrow()
    })
  })

  describe('updateRoom', () => {
    it('should update a chat room', async () => {
      const mockResponse = { data: mockData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const updates: ChatRoomUpdate = {
        name: 'Updated Room Name',
      }

      const result = await chatService.updateRoom(mockSupabase, 'room123', updates)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_rooms')
      expect(result).toEqual(mockData)
    })
  })

  describe('deleteRoom', () => {
    it('should delete a chat room', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await chatService.deleteRoom(mockSupabase, 'room123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_rooms')
    })
  })

  describe('getMessages', () => {
    it('should get messages for a room', async () => {
      const mockMessagesData = [{ message_id: 'msg123', content: 'Hello' }]
      const mockResponse = { data: mockMessagesData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await chatService.getMessages(mockSupabase, 'room123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('messages')
      expect(result).toEqual(mockMessagesData)
    })

    it('should get messages with custom limit', async () => {
      const mockMessagesData = [{ message_id: 'msg123', content: 'Hello' }]
      const mockResponse = { data: mockMessagesData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const result = await chatService.getMessages(mockSupabase, 'room123', 50)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('messages')
      expect(result).toEqual(mockMessagesData)
    })
  })

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const mockMessageData = { message_id: 'msg123', content: 'Hello', room_id: 'room123' }
      const mockResponse = { data: mockMessageData, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      const messageData: MessageInsert = {
        room_id: 'room123',
        sender_id: 'user123',
        content: 'Hello',
      }

      const result = await chatService.sendMessage(mockSupabase, messageData)
      
      expect(mockSupabase.from).toHaveBeenCalledWith('messages')
      expect(result).toEqual(mockMessageData)
    })
  })

  describe('deleteMessage', () => {
    it('should delete a message', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await chatService.deleteMessage(mockSupabase, 'msg123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('messages')
    })
  })

  describe('addParticipant', () => {
    it('should add a participant to a room', async () => {
      const mockResponse = { data: null, error: null }
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockImplementation(() => Promise.resolve(mockResponse)),
      } as any))

      await chatService.addParticipant(mockSupabase, 'room123', 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_participants')
    })
  })

  describe('removeParticipant', () => {
    it('should remove a participant from a room', async () => {
      const mockResponse = { data: null, error: null }
      
      // Create a mock implementation that handles chained eq calls
      const mockDelete = {
        eq: vi.fn().mockReturnThis()
      }
      mockDelete.eq.mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => Promise.resolve(mockResponse))
      }))
      
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
        delete: vi.fn().mockReturnValue(mockDelete)
      } as any))

      await chatService.removeParticipant(mockSupabase, 'room123', 'user123')
      
      expect(mockSupabase.from).toHaveBeenCalledWith('chat_participants')
    })
  })
})