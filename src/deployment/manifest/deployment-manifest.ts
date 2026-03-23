export type RolloutChannel = 'stable' | 'canary' | 'experimental';

export interface DeploymentUnit {
  id: string;
  version: string;
  owners: string[];
  rollout: RolloutChannel;
}

export interface DeploymentManifest {
  units: DeploymentUnit[];
}

