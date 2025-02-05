import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import { BaseDie } from './base-die.js';
import { DieSymbol } from './symbols.js';

export class SetbackDie extends BaseDie {
  static styles = [
    BaseDie.styles,
    css`
      .die {
        background-color: #000000;
        color: white;
      }
    `
  ];

  getFaces() {
    return [
      DieSymbol.BLANK,
      DieSymbol.BLANK,
      DieSymbol.FAILURE,
      DieSymbol.FAILURE_THREAT,
      DieSymbol.THREAT,
      DieSymbol.DOUBLE_THREAT,
    ];
  }

  render() {
    return html`
      <div class="die square ${this.rolling ? 'rolling' : ''} ${this.static ? 'static' : ''}">
        ${this.result || DieSymbol.THREAT}
      </div>
    `;
  }
}

customElements.define('sw-setback-die', SetbackDie);
