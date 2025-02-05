import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import { BaseDie } from './base-die.js';
import { DieSymbol } from './symbols.js';

export class ChallengeDie extends BaseDie {
  static styles = [
    BaseDie.styles,
    css`
      .die {
        background-color: #cc0000;
        color: white;
      }
    `
  ];

  getFaces() {
    return [
      DieSymbol.BLANK,
      DieSymbol.FAILURE,
      DieSymbol.FAILURE,
      DieSymbol.DOUBLE_FAILURE,
      DieSymbol.DOUBLE_FAILURE,
      DieSymbol.THREAT,
      DieSymbol.THREAT,
      DieSymbol.FAILURE_THREAT,
      DieSymbol.FAILURE_THREAT,
      DieSymbol.DOUBLE_THREAT,
      DieSymbol.DOUBLE_THREAT,
      DieSymbol.DESPAIR,
    ];
  }

  render() {
    return html`
      <div class="die hexagon ${this.rolling ? 'rolling' : ''} ${this.static ? 'static' : ''}">
        ${this.result || DieSymbol.DESPAIR}
      </div>
    `;
  }
}

customElements.define('sw-challenge-die', ChallengeDie);
