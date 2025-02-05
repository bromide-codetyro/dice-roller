import { LitElement, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';

export class BaseDie extends LitElement {
  static nextId = 1;

  static properties = {
    rolling: { type: Boolean },
    static: { type: Boolean },
    result: { type: String },
    id: { type: Number }
  };

  static styles = css`
    @font-face {
      font-family: 'SW-FFG';
      src: url('/assets/sw-ffg.otf') format('opentype');
      font-display: block;
    }

    :host {
      display: inline-block;
      cursor: pointer;
      user-select: none;
    }
    
    .die {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'SW-FFG', Arial, sans-serif;
      font-size: 18px;
      transition: transform 0.2s;
      margin: 5px;
    }
    
    .die:hover:not(.static) {
      transform: scale(1.1);
    }
    
    .rolling {
      animation: roll 0.8s ease-in-out;
    }
    
    .diamond {
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    }

    .hexagon {
      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    }

    .square {
      border-radius: 8px;
    }
    
    @keyframes roll {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(360deg) scale(1.2); }
      100% { transform: rotate(720deg) scale(1); }
    }
  `;

  constructor() {
    super();
    this.result = '';
    this.rolling = false;
    this.static = false;
    this.id = BaseDie.nextId++;
  }

  roll() {
    if (this.rolling || this.static) return;
    
    this.rolling = true;
    const results = this.getFaces();
    
    let count = 0;
    const animationInterval = setInterval(() => {
      this.result = results[Math.floor(Math.random() * results.length)];
      count++;
      if (count > 8) {
        clearInterval(animationInterval);
        this.result = results[Math.floor(Math.random() * results.length)];
        this.rolling = false;
        this.dispatchEvent(new CustomEvent('roll-complete', { 
          detail: { result: this.result },
          bubbles: true, 
          composed: true,
        }));
      }
    }, 100);
  }

  getFaces() {
    return [];
  }
}
