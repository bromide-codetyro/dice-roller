import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import './ability-die.js';
import './proficiency-die.js';
import './boost-die.js';
import './difficulty-die.js';
import './challenge-die.js';
import './setback-die.js';
import './force-die.js';
import { getSymbolName } from './symbol-names.js';

export class DicePool extends LitElement {
  static properties = {
    dice: { type: Array },
    static: { type: Boolean },
    showSymbolNames: { type: Boolean }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .pool {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      padding: 10px;
    }

    .pool-group {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      padding: 5px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      margin: 2px;
    }

    .die-wrapper {
      cursor: pointer;
    }

    .results {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
    }

    .result-group {
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .result-group span.symbol {
      font-family: 'SW-FFG';
      font-size: 1.2em;
    }

    .result-group span.name {
      font-size: 0.9em;
    }
  `;

  constructor() {
    super();
    this.dice = [];
    this.static = false;
    this.showSymbolNames = false;
  }

  handleDieClick(die, e) {
    if (!this.static) {
      this.dispatchEvent(new CustomEvent('die-removed', {
        detail: { id: die.id },
        bubbles: true,
        composed: true
      }));
    }
  }

  getDieComponent(die) {
    const components = {
      challenge: () => html`<sw-challenge-die ?static=${this.static} .result=${die.result}></sw-challenge-die>`,
      difficulty: () => html`<sw-difficulty-die ?static=${this.static} .result=${die.result}></sw-difficulty-die>`,
      setback: () => html`<sw-setback-die ?static=${this.static} .result=${die.result}></sw-setback-die>`,
      proficiency: () => html`<sw-proficiency-die ?static=${this.static} .result=${die.result}></sw-proficiency-die>`,
      ability: () => html`<sw-ability-die ?static=${this.static} .result=${die.result}></sw-ability-die>`,
      boost: () => html`<sw-boost-die ?static=${this.static} .result=${die.result}></sw-boost-die>`,
      force: () => html`<sw-force-die ?static=${this.static} .result=${die.result}></sw-force-die>`
    };

    return html`<div class="die-wrapper" @click=${(e) => this.handleDieClick(die, e)}>${components[die.type]?.() || null}</div>`;
  }

  groupDiceByType(dice) {
    const order = ['challenge', 'difficulty', 'setback', 'proficiency', 'ability', 'boost', 'force'];
    const groups = {};
    
    order.forEach(type => {
      const typeDice = dice.filter(die => die.type === type);
      if (typeDice.length > 0) {
        groups[type] = typeDice;
      }
    });

    return groups;
  }

  summarizeResults() {
    const summary = {
      success: 0,
      failure: 0,
      advantage: 0,
      threat: 0,
      triumph: 0,
      despair: 0,
      lightside: 0,
      darkside: 0
    };

    this.dice.forEach(die => {
      if (!die.result) return;
      die.result.forEach(symbol => {
        switch(symbol) {
          case 's': summary.success++; break;
          case 'f': summary.failure++; break;
          case 'a': summary.advantage++; break;
          case 't': summary.threat++; break;
          case 'x':
            summary.triumph++;
            summary.success++;
            break;
          case 'y':
            summary.despair++;
            summary.failure++;
            break;
          case 'Z': summary.lightside++; break;
          case 'z': summary.darkside++; break;
        }
      });
    });

    // Calculate net successes/failures and advantages/threats
    summary.netSuccess = summary.success - summary.failure;
    summary.netAdvantage = summary.advantage - summary.threat;
    
    return summary;
  }

  renderResults() {
    const summary = this.summarizeResults();
    const hasResults = this.dice.some(d => d.result);

    if (!hasResults) return null;

    return html`
      <div class="results">
        ${summary.triumph > 0 ? html`
          <div class="result-group">
              ${summary.triumph}
              ${this.showSymbolNames
                ? html`<span class="name">${getSymbolName('x')}</span>`
                : html`<span class="symbol">x</span>`
              }
          </div>
        ` : ''}
        ${summary.despair > 0 ? html`
          <div class="result-group">
            ${summary.despair}
            ${this.showSymbolNames
              ? html`<span class="name">${getSymbolName('y')}</span>`
              : html`<span class="symbol">y</span>`
            }
          </div>
        ` : ''}
        ${summary.netSuccess !== 0 ? html`
          <div class="result-group">
            ${Math.abs(summary.netSuccess)}
            ${this.showSymbolNames
              ? html`<span class="name">${getSymbolName(summary.netSuccess > 0 ? 's' : 'f')}</span>`
              : html`<span class="symbol">${summary.netSuccess > 0 ? 's' : 'f'}</span>`
            }
          </div>
        ` : ''}
        ${summary.netAdvantage !== 0 ? html`
          <div class="result-group">
            ${Math.abs(summary.netAdvantage)}
            ${this.showSymbolNames
              ? html`<span class="name">${getSymbolName(summary.netAdvantage > 0 ? 'a' : 't')}</span>`
              : html`<span class="symbol">${summary.netAdvantage > 0 ? 'a' : 't'}</span>`
            }
          </div>
        ` : ''}
        ${summary.lightside > 0 ? html`
          <div class="result-group">
            ${summary.lightside}
            ${this.showSymbolNames
              ? html`<span class="name">${getSymbolName('Z')}</span>`
              : html`<span class="symbol">Z</span>`
            }
          </div>
        ` : ''}
        ${summary.darkside > 0 ? html`
          <div class="result-group">
            ${summary.darkside}
            ${this.showSymbolNames
              ? html`<span class="name">${getSymbolName('z')}</span>`
              : html`<span class="symbol">z</span>`
            }
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    const groups = this.groupDiceByType(this.dice);

    return html`
      ${this.renderResults()}
      <div class="pool">
        ${Object.entries(groups).map(([type, dice]) => html`
          ${dice.map(die => this.getDieComponent(die))}
        `)}
      </div>
    `;
  }
}

customElements.define('dice-pool', DicePool);
