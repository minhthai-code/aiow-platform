export interface PlayerController {
  play(): void;
  pause(): void;
  seek(_seconds: number): void;
}

