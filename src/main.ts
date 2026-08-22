import './style.css';
import { GameApp } from './game3d/GameApp';

const container = document.querySelector<HTMLElement>('#game-container');
if (!container) throw new Error('Game container was not found.');

new GameApp(container);
