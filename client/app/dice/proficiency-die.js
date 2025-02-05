import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import { BaseDie } from './base-die.js';
import { DieSymbol } from './symbols.js';

export class ProficiencyDie extends BaseDie {
  static styles = [
    BaseDie.styles,
    css`
      .die {
        background-color: #ffd700;
        color: black;
      }
    `
  ];

  getFaces() {
    return [
      DieSymbol.BLANK,
      DieSymbol.SUCCESS,
      DieSymbol.SUCCESS,
      DieSymbol.DOUBLE_SUCCESS,
      DieSymbol.DOUBLE_SUCCESS,
      DieSymbol.ADVANTAGE,
      DieSymbol.SUCCESS_ADVANTAGE,
      DieSymbol.SUCCESS_ADVANTAGE,
      DieSymbol.SUCCESS_ADVANTAGE,
      DieSymbol.DOUBLE_ADVANTAGE,
      DieSymbol.DOUBLE_ADVANTAGE,
      DieSymbol.TRIUMPH
    ];
  }

  render() {
    return html`
      <div class="die hexagon ${this.rolling ? 'rolling' : ''} ${this.static ? 'static' : ''}">
        ${this.result || (this.count > 0 ? this.count : DieSymbol.TRIUMPH)}
      </div>
    `;
  }
}

customElements.define('sw-proficiency-die', ProficiencyDie);
