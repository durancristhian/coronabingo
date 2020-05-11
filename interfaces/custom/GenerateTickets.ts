export interface RenderOptions {
  normalizeWhitespace: boolean
}

export interface CellContent {
  str: string
}

export interface TextContent {
  items: CellContent[]
}

export interface PageData {
  getTextContent: (options: RenderOptions) => Promise<TextContent>
}
