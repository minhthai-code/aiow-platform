export interface TopicDescriptor {
  name: string;
}

export class TopicRegistry {
  private topics = new Map<string, TopicDescriptor>();

  register(topic: TopicDescriptor): void {
    this.topics.set(topic.name, topic);
  }

  get(name: string): TopicDescriptor | undefined {
    return this.topics.get(name);
  }
}

