export async function loadProduct(id: string): Promise<void> {
  switch (id) {
    case 'youtube':
      await import('@products/youtube/bootstrap');
      return;
    default:
      throw new Error(`Unknown product: ${id}`);
  }
}

