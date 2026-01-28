export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

export interface HorsesState {
  horses: Horse[]
  isGenerated: boolean
}
