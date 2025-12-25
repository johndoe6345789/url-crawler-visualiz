import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { URLNode } from '@/lib/types'
import { CheckCircle, XCircle, Clock, Link } from '@phosphor-icons/react'

interface URLDetailsPanelProps {
  node: URLNode | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function URLDetailsPanel({ node, open, onOpenChange }: URLDetailsPanelProps) {
  if (!node) return null

  const StatusIcon = {
    success: CheckCircle,
    error: XCircle,
    loading: Clock,
    pending: Clock,
  }[node.status]

  const statusColor = {
    success: 'bg-primary/20 text-primary border-primary/40',
    error: 'bg-destructive/20 text-destructive border-destructive/40',
    loading: 'bg-muted text-muted-foreground border-muted-foreground/40',
    pending: 'bg-muted text-muted-foreground border-muted-foreground/40',
  }[node.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link size={20} weight="bold" />
            URL Details
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">URL</h3>
              <code className="text-xs bg-secondary/50 px-2 py-1 rounded break-all block">
                {node.url}
              </code>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Status</h3>
                <Badge variant="outline" className={statusColor}>
                  <StatusIcon size={14} className="mr-1" weight="bold" />
                  {node.status}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Depth</h3>
                <Badge variant="outline">Level {node.depth}</Badge>
              </div>

              {node.responseTime !== undefined && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Response Time</h3>
                  <Badge variant="outline">{Math.round(node.responseTime)}ms</Badge>
                </div>
              )}

              {node.discoveredUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Links Found</h3>
                  <Badge variant="outline">{node.discoveredUrls.length}</Badge>
                </div>
              )}
            </div>

            {node.error && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-destructive">Error</h3>
                  <p className="text-sm text-destructive/90 bg-destructive/10 px-3 py-2 rounded">
                    {node.error}
                  </p>
                </div>
              </>
            )}

            {node.discoveredUrls.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">Discovered URLs</h3>
                  <div className="space-y-2">
                    {node.discoveredUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-secondary/30 px-2 py-1.5 rounded break-all font-mono"
                      >
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {node.data && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">JSON Response</h3>
                  <pre className="text-xs bg-secondary/30 px-3 py-2 rounded overflow-x-auto font-mono">
                    {JSON.stringify(node.data, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
