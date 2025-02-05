import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import { BaseDie } from './base-die.js';
import { DieSymbol } from './symbols.js';

export class AbilityDie extends BaseDie {
  static styles = [
    BaseDie.styles,
    css`
      .die {
        background-color: #1fab2e;
        color: white;
      }
    `
  ];

  getFaces() {
    return [
      DieSymbol.BLANK,
      DieSymbol.SUCCESS,
      DieSymbol.SUCCESS,
      DieSymbol.DOUBLE_SUCCESS,
      DieSymbol.ADVANTAGE,
      DieSymbol.ADVANTAGE,
      DieSymbol.SUCCESS_ADVANTAGE,
      DieSymbol.DOUBLE_ADVANTAGE
    ];
  }

  render() {
    return html`
      <div class="die diamond ${this.rolling ? 'rolling' : ''} ${this.static ? 'static' : ''}">
        ${this.result || DieSymbol.SUCCESS}
      </div>
    `;
  }
}

customElements.define('sw-ability-die', AbilityDie);
