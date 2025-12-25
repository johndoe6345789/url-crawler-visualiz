import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DownloadSimple } from '@phosphor-icons/react'
import type { CrawlStats, URLNode } from '@/lib/types'

interface CrawlStatsDisplayProps {
  stats: CrawlStats
  isActive: boolean
  nodes: URLNode[]
  onExport: () => void
}

export function CrawlStatsDisplay({ stats, isActive, nodes, onExport }: CrawlStatsDisplayProps) {
  const progress = stats.total > 0 
    ? ((stats.success + stats.error) / stats.total) * 100 
    : 0

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Crawl Progress</h3>
          <div className="flex items-center gap-2">
            {isActive && (
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40">
                Active
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={nodes.length === 0}
              className="gap-2"
            >
              <DownloadSimple size={16} weight="bold" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-lg font-bold">{stats.total}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-lg font-bold text-muted-foreground">{stats.pending}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Loading</div>
            <div className="text-lg font-bold text-primary">{stats.loading}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Success</div>
            <div className="text-lg font-bold text-primary">{stats.success}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Failed</div>
            <div className="text-lg font-bold text-destructive">{stats.error}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
