import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash, ArrowClockwise } from '@phosphor-icons/react'

const DEFAULT_HEADERS: Record<string, string> = {
  'accept': 'application/json',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'content-type': 'application/json',
}

interface HeadersConfigPanelProps {
  headers: Record<string, string>
  onChange: (headers: Record<string, string>) => void
  includeCookies: boolean
  onIncludeCookiesChange: (value: boolean) => void
}

export function HeadersConfigPanel({ 
  headers, 
  onChange, 
  includeCookies, 
  onIncludeCookiesChange 
}: HeadersConfigPanelProps) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAddHeader = () => {
    if (newKey.trim() && newValue.trim()) {
      onChange({
        ...headers,
        [newKey.trim()]: newValue.trim(),
      })
      setNewKey('')
      setNewValue('')
    }
  }

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...headers }
    delete newHeaders[key]
    onChange(newHeaders)
  }

  const handleUpdateHeader = (key: string, value: string) => {
    onChange({
      ...headers,
      [key]: value,
    })
  }

  const handleReset = () => {
    onChange(DEFAULT_HEADERS)
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Request Headers</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Configure custom headers for API requests
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <ArrowClockwise size={16} weight="bold" />
            Reset
          </Button>
        </div>

        <Separator />

        <div className="flex items-center space-x-3 py-2">
          <Checkbox
            id="include-cookies"
            checked={includeCookies}
            onCheckedChange={(checked) => onIncludeCookiesChange(checked === true)}
          />
          <Label
            htmlFor="include-cookies"
            className="text-sm font-medium cursor-pointer"
          >
            Include cookies with requests
          </Label>
        </div>

        <Separator />

        <div className="space-y-3">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={key}
                      disabled
                      className="font-mono text-xs bg-muted/50"
                    />
                  </div>
                  <div className="flex-[2]">
                    <Input
                      value={value}
                      onChange={(e) => handleUpdateHeader(key, e.target.value)}
                      placeholder="Header value"
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveHeader(key)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash size={16} weight="bold" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs font-semibold">Add New Header</Label>
          <div className="flex gap-2">
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Header name"
              className="flex-1 font-mono text-xs"
              onKeyDown={(e) => e.key === 'Enter' && handleAddHeader()}
            />
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Header value"
              className="flex-[2] font-mono text-xs"
              onKeyDown={(e) => e.key === 'Enter' && handleAddHeader()}
            />
            <Button
              onClick={handleAddHeader}
              size="icon"
              disabled={!newKey.trim() || !newValue.trim()}
              className="shrink-0"
            >
              <Plus size={18} weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
