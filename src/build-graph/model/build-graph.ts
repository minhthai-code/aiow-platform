export interface BuildChunk {
  name: string;
  sizeBytes: number;
  imports: string[];
}

export interface BuildGraph {
  chunks: BuildChunk[];
}

