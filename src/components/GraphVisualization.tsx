import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { URLNode, URLEdge } from '@/lib/types'

interface GraphVisualizationProps {
  nodes: URLNode[]
  edges: URLEdge[]
  onNodeClick: (node: URLNode) => void
  selectedNodeId: string | null
}

export function GraphVisualization({ nodes, edges, onNodeClick, selectedNodeId }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const defs = svg.append('defs')
    
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur')
    
    const feMerge = glowFilter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    const g = svg.append('g')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    const link = g.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', 'oklch(0.45 0.06 240)')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
      .on('click', (_event, d) => {
        onNodeClick(d as URLNode)
      })

    node.append('circle')
      .attr('r', (d: any) => {
        if (d.depth === 0) return 12
        return 8
      })
      .attr('fill', (d: any) => getNodeColor(d))
      .attr('stroke', (d: any) => {
        if (d.id === selectedNodeId) return 'oklch(0.75 0.15 200)'
        return 'oklch(0.15 0.02 250)'
      })
      .attr('stroke-width', (d: any) => {
        if (d.id === selectedNodeId) return 3
        return 2
      })
      .attr('opacity', (d: any) => {
        if (d.status === 'pending') return 0.4
        return 1
      })
      .attr('filter', (d: any) => {
        if (d.status === 'success' || d.id === selectedNodeId) return 'url(#glow)'
        return null
      })
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', (d: any) => d.depth === 0 ? 14 : 10)
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', (d: any) => d.depth === 0 ? 12 : 8)
      })

    const labels = node.append('text')
      .text((d: any) => {
        try {
          const url = new URL(d.url)
          return url.hostname
        } catch {
          return d.url.substring(0, 20)
        }
      })
      .attr('x', 0)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'oklch(0.85 0.02 200)')
      .attr('font-size', '10px')
      .attr('font-family', 'Space Grotesk, sans-serif')
      .attr('pointer-events', 'none')

    node.filter((d: any) => d.status === 'loading')
      .append('circle')
      .attr('r', (d: any) => d.depth === 0 ? 16 : 12)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.75 0.15 200)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('from', (d: any) => d.depth === 0 ? 12 : 8)
      .attr('to', (d: any) => d.depth === 0 ? 16 : 12)
      .attr('dur', '1s')
      .attr('repeatCount', 'indefinite')

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: any) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, onNodeClick, selectedNodeId])

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

function getNodeColor(node: URLNode): string {
  switch (node.status) {
    case 'success':
      return 'oklch(0.75 0.15 200)'
    case 'error':
      return 'oklch(0.65 0.22 25)'
    case 'loading':
      return 'oklch(0.6 0.12 200)'
    case 'pending':
      return 'oklch(0.45 0.06 240)'
    default:
      return 'oklch(0.45 0.06 240)'
  }
}
