import { html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import { BaseDie } from './base-die.js';
import { DieSymbol } from './symbols.js';

export class ForceDie extends BaseDie {
  static styles = [
    BaseDie.styles,
    css`
      .die {
        background-color: white;
        color: black;
        border: 2px solid #cccccc;
      }
      .double-symbol {
        display: flex;
        justify-content: center;
        gap: 2px;
      }
    `
  ];

  getFaces() {
    return [
      DieSymbol.DARK,
      DieSymbol.DARK,
      DieSymbol.DARK,
      DieSymbol.DARK,
      DieSymbol.DARK,
      DieSymbol.DARK, // Total 6 dark
      DieSymbol.DOUBLE_DARK, // 1 double dark
      DieSymbol.LIGHT,
      DieSymbol.LIGHT, // Total 2 light
      DieSymbol.DOUBLE_LIGHT,
      DieSymbol.DOUBLE_LIGHT,
      DieSymbol.DOUBLE_LIGHT, // Total 3 double light
    ];
  }

  render() {
    const renderSymbol = (symbol) => {
      if (Array.isArray(symbol)) {
        return html`
          <div class="double-symbol">
            ${symbol.map(s => html`<span>${s}</span>`)}
          </div>
        `;
      }
      return symbol;
    };

    return html`
      <div class="die hexagon ${this.rolling ? 'rolling' : ''} ${this.static ? 'static' : ''}">
        ${this.result ? renderSymbol(this.result) : DieSymbol.LIGHT}
      </div>
    `;
  }
}

customElements.define('sw-force-die', ForceDie);
