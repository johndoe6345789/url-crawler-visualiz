import { describe, it, expect } from 'vitest'
import { isValidUrl, resolveUrl, extractUrls } from '../lib/crawler'

describe('crawler utilities', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://api.example.com/data')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('//example')).toBe(false)
    })
  })

  describe('resolveUrl', () => {
    it('should resolve relative URLs correctly', () => {
      const baseUrl = 'https://example.com/api'
      expect(resolveUrl(baseUrl, '/users')).toBe('https://example.com/users')
      expect(resolveUrl(baseUrl, './users')).toBe('https://example.com/users')
      expect(resolveUrl(baseUrl, '../users')).toBe('https://example.com/users')
    })

    it('should return absolute URLs unchanged', () => {
      const baseUrl = 'https://example.com/api'
      expect(resolveUrl(baseUrl, 'https://other.com/data')).toBe('https://other.com/data')
    })

    it('should return the relative URL if resolution fails', () => {
      const baseUrl = 'invalid-base'
      const relativeUrl = 'relative-path'
      expect(resolveUrl(baseUrl, relativeUrl)).toBe(relativeUrl)
    })
  })

  describe('extractUrls', () => {
    it('should extract valid URLs from strings', () => {
      const obj = {
        link: 'https://example.com/api',
        description: 'Visit https://example.com for more info'
      }
      const urls = extractUrls(obj, 'https://base.com')
      expect(urls).toContain('https://example.com/api')
      expect(urls).toContain('https://example.com')
    })

    it('should resolve relative URLs', () => {
      const obj = {
        link: '/api/users'
      }
      const urls = extractUrls(obj, 'https://example.com')
      expect(urls).toContain('https://example.com/api/users')
    })

    it('should extract URLs from nested objects', () => {
      const obj = {
        data: {
          items: [
            { url: 'https://example.com/1' },
            { url: 'https://example.com/2' }
          ]
        }
      }
      const urls = extractUrls(obj, 'https://base.com')
      expect(urls).toContain('https://example.com/1')
      expect(urls).toContain('https://example.com/2')
    })

    it('should return empty array for objects without URLs', () => {
      const obj = { name: 'test', value: 123 }
      const urls = extractUrls(obj, 'https://base.com')
      expect(urls).toEqual([])
    })
  })
})
