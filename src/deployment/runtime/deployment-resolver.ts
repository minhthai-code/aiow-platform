import type { DeploymentManifest, DeploymentUnit } from '../manifest/deployment-manifest';

export interface DeploymentResolutionContext {
  userId?: string;
  channel?: 'stable' | 'canary' | 'experimental';
}

export interface DeploymentResolver {
  resolve(manifest: DeploymentManifest, ctx: DeploymentResolutionContext): DeploymentUnit[];
}

export class DefaultDeploymentResolver implements DeploymentResolver {
  resolve(manifest: DeploymentManifest, ctx: DeploymentResolutionContext): DeploymentUnit[] {
    const channel = ctx.channel ?? 'stable';
    // Minimal: filter by channel; fall back to stable if none match.
    const matches = manifest.units.filter(u => u.rollout === channel);
    return matches.length ? matches : manifest.units.filter(u => u.rollout === 'stable');
  }
}

