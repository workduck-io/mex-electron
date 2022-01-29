export interface GraphNode {
  id: number
  path: string
  label: string
  color: {
    border: string
    background: string
    highlight: {
      border: string
      background: string
    }
    hover: {
      border: string
      background: string
    }
  }
  font?: {
    color?: string
    face?: string
    size?: string
  }
  size?: number
}

export interface GraphEdge {
  to: number
  from: number
  color?: string
  physics?: boolean
}
