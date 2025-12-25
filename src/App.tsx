import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { GraphVisualization } from '@/components/GraphVisualization'
import { URLDetailsPanel } from '@/components/URLDetailsPanel'
import { CrawlStatsDisplay } from '@/components/CrawlStatsDisplay'
import { HeadersConfigPanel } from '@/components/HeadersConfigPanel'
import { Globe, Graph, Clock, CaretDown, Gear } from '@phosphor-icons/react'
import { crawlUrl, isValidUrl } from '@/lib/crawler'
import type { URLNode, URLEdge, CrawlStats } from '@/lib/types'
import { toast } from 'sonner'

const DEFAULT_HEADERS: Record<string, string> = {
  'accept': 'application/json',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'content-type': 'application/json',
}

function App() {
  const [url, setUrl] = useState('')
  const [nodes, setNodes] = useState<Map<string, URLNode>>(new Map())
  const [isCrawling, setIsCrawling] = useState(false)
  const [selectedNode, setSelectedNode] = useState<URLNode | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [headersOpen, setHeadersOpen] = useState(false)
  const [headers, setHeaders] = useKV<Record<string, string>>('crawler-headers', DEFAULT_HEADERS)

  const nodesArray = useMemo(() => Array.from(nodes.values()), [nodes])

  const edges = useMemo<URLEdge[]>(() => {
    return nodesArray
      .filter(node => node.parentId !== null)
      .map(node => ({
        source: node.parentId!,
        target: node.id,
      }))
  }, [nodesArray])

  const stats = useMemo<CrawlStats>(() => {
    const statusCounts = nodesArray.reduce(
      (acc, node) => {
        acc[node.status]++
        return acc
      },
      { pending: 0, loading: 0, success: 0, error: 0 } as Record<string, number>
    )

    return {
      total: nodesArray.length,
      pending: statusCounts.pending,
      loading: statusCounts.loading,
      success: statusCounts.success,
      error: statusCounts.error,
    }
  }, [nodesArray])

  const handleCrawl = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL')
      return
    }

    setIsCrawling(true)
    setNodes(new Map())
    setSelectedNode(null)
    setDetailsOpen(false)

    const visited = new Set<string>()
    const nodesMap = new Map<string, URLNode>()

    const onNodeUpdate = (node: URLNode) => {
      nodesMap.set(node.id, node)
      setNodes(new Map(nodesMap))
    }

    try {
      await crawlUrl(url, 0, null, 3, visited, onNodeUpdate, headers || DEFAULT_HEADERS)
      toast.success('Crawl completed!')
    } catch (error) {
      toast.error('An error occurred during crawling')
    } finally {
      setIsCrawling(false)
    }
  }

  const handleNodeClick = (node: URLNode) => {
    setSelectedNode(node)
    setDetailsOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Graph size={32} weight="bold" className="text-primary" />
          JSON URL Crawler
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover and visualize interconnected JSON APIs
        </p>
      </div>

      <Card className="p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              weight="bold"
            />
            <Input
              type="url"
              placeholder="https://api.example.com/data"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isCrawling && handleCrawl()}
              disabled={isCrawling}
              className="pl-10 h-11"
            />
          </div>
          <Button
            onClick={handleCrawl}
            disabled={isCrawling}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isCrawling ? (
              <>
                <Clock size={20} weight="bold" className="animate-spin" />
                Crawling...
              </>
            ) : (
              <>
                <Graph size={20} weight="bold" />
                Crawl
              </>
            )}
          </Button>
        </div>
      </Card>

      <Collapsible open={headersOpen} onOpenChange={setHeadersOpen} className="mb-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between gap-2 mb-3"
          >
            <span className="flex items-center gap-2">
              <Gear size={18} weight="bold" />
              Headers Configuration
            </span>
            <CaretDown
              size={16}
              weight="bold"
              className={`transition-transform ${headersOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <HeadersConfigPanel
            headers={headers || DEFAULT_HEADERS}
            onChange={(newHeaders) => setHeaders(newHeaders)}
          />
        </CollapsibleContent>
      </Collapsible>

      {nodesArray.length > 0 && (
        <div className="mb-4">
          <CrawlStatsDisplay stats={stats} isActive={isCrawling} />
        </div>
      )}

      <Card className="flex-1 p-4 sm:p-6 min-h-[500px] overflow-hidden">
        {nodesArray.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <Graph size={64} weight="thin" className="mb-4 opacity-30" />
            <p className="text-lg font-semibold">No data yet</p>
            <p className="text-sm">Enter a URL above to start crawling</p>
          </div>
        ) : (
          <GraphVisualization
            nodes={nodesArray}
            edges={edges}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id || null}
          />
        )}
      </Card>

      <URLDetailsPanel
        node={selectedNode}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  )
}

export default App