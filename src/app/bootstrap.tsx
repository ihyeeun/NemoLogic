import { Engine } from '@/engine/engine';
import { App } from '@/hud/App';
import { render } from 'preact';

export function bootstrap() {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const engine = new Engine(canvas, 10, 10);
  const hudRoot = document.getElementById('hud')!;
  render(<App engine={engine} />, hudRoot);
}
