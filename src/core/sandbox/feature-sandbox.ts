export interface FeatureSandbox {
  id: string;
  run(fn: () => void): void;
}

export class InProcessFeatureSandbox implements FeatureSandbox {
  constructor(public id: string) {}

  run(fn: () => void): void {
    fn();
  }
}

