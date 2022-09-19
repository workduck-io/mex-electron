export interface GraphNode {
  id: number
  path: string
  nodeid?: string
  // label: string
  color: {
    font: string
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
  group?: string
  font?: {
    color?: string
    face?: string
    size?: string
  }
  // val?: number
  // size?: number
}

export interface GraphEdge {
  source: number
  target: number
  color: string
  // value?: number
  // physics?: boolean
}
