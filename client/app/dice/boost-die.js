import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import { BaseDie } from './base-die.js';
import { DieSymbol } from './symbols.js';

export class BoostDie extends BaseDie {
  static styles = [
    BaseDie.styles,
    css`
      .die {
        background-color: #87ceeb;
        color: black;
      }
    `
  ];

  getFaces() {
    return [
      DieSymbol.BLANK,
      DieSymbol.BLANK,
      DieSymbol.SUCCESS,
      DieSymbol.SUCCESS_ADVANTAGE,
      DieSymbol.ADVANTAGE,
      DieSymbol.DOUBLE_ADVANTAGE
    ];
  }

  render() {
    return html`
      <div class="die square ${this.rolling ? 'rolling' : ''} ${this.static ? 'static' : ''}">
        ${this.result || DieSymbol.ADVANTAGE}
      </div>
    `;
  }
}

customElements.define('sw-boost-die', BoostDie);
