export type MutationFn<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

export class MutationManager {
  // Placeholder for mutation lifecycle hooks
  async mutate<TInput, TOutput>(fn: MutationFn<TInput, TOutput>, input: TInput): Promise<TOutput> {
    return fn(input);
  }
}

