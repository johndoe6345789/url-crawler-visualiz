import type { URLNode } from './types'

const URL_REGEX = /https?:\/\/[^\s"']+/g

export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

export function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href
  } catch {
    return relativeUrl
  }
}

export function extractUrls(obj: any, baseUrl: string): string[] {
  const urls = new Set<string>()

  function walk(value: any) {
    if (typeof value === 'string') {
      if (isValidUrl(value)) {
        urls.add(value)
      } else if (value.startsWith('/') || value.startsWith('./') || value.startsWith('../')) {
        const resolved = resolveUrl(baseUrl, value)
        if (isValidUrl(resolved)) {
          urls.add(resolved)
        }
      } else {
        const matches = value.match(URL_REGEX)
        if (matches) {
          matches.forEach(url => {
            if (isValidUrl(url)) {
              urls.add(url)
            }
          })
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach(walk)
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(walk)
    }
  }

  walk(obj)
  return Array.from(urls)
}

export async function fetchUrl(
  url: string,
  customHeaders?: Record<string, string>,
  includeCookies?: boolean
): Promise<{ data: any; responseTime: number }> {
  const startTime = performance.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const headers = customHeaders || {
      'Accept': 'application/json',
    }

    const response = await fetch(url, {
      signal: controller.signal,
      headers,
      credentials: includeCookies ? 'include' : 'same-origin',
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON')
    }

    const data = await response.json()
    const responseTime = performance.now() - startTime

    return { data, responseTime }
  } catch (error) {
    const responseTime = performance.now() - startTime
    throw { error, responseTime }
  }
}

export async function crawlUrl(
  url: string,
  depth: number,
  parentId: string | null,
  maxDepth: number,
  visited: Set<string>,
  onNodeUpdate: (node: URLNode) => void,
  customHeaders?: Record<string, string>,
  includeCookies?: boolean
): Promise<void> {
  if (depth > maxDepth || visited.has(url)) {
    return
  }

  visited.add(url)

  const nodeId = `node-${visited.size}`
  const node: URLNode = {
    id: nodeId,
    url,
    status: 'loading',
    depth,
    parentId,
    discoveredUrls: [],
  }

  onNodeUpdate(node)

  try {
    const { data, responseTime } = await fetchUrl(url, customHeaders, includeCookies)
    const discoveredUrls = extractUrls(data, url)

    const updatedNode: URLNode = {
      ...node,
      status: 'success',
      data,
      responseTime,
      discoveredUrls,
    }

    onNodeUpdate(updatedNode)

    if (depth < maxDepth) {
      for (const discoveredUrl of discoveredUrls) {
        await crawlUrl(discoveredUrl, depth + 1, nodeId, maxDepth, visited, onNodeUpdate, customHeaders, includeCookies)
      }
    }
  } catch (err: any) {
    const errorMessage = err.error?.message || err.message || 'Failed to fetch'
    const updatedNode: URLNode = {
      ...node,
      status: 'error',
      error: errorMessage,
      responseTime: err.responseTime,
      discoveredUrls: [],
    }

    onNodeUpdate(updatedNode)
  }
}
