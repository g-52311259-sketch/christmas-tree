export enum AppState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPosition: [number, number, number];
  treePosition: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  type: 'LEAF' | 'ORNAMENT';
}
