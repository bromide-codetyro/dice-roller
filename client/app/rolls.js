import { css, html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import './dice/dice-pool.js';

class Rolls extends LitElement {
  static properties = {
    rolling: { type: Boolean },
    poolDice: { type: Array }
  };

  static styles = css`
    .die-selector {
      display: flex;
      gap: 10px;
      padding: 15px;
      background: #2a2a2a;
      border-radius: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      border: 1px solid #3a3a3a;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .die-selector > * {
      cursor: pointer;
      user-select: none;
    }

    .pool-container {
      min-height: 70px;
      padding: 15px;
      background: #2a2a2a;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #3a3a3a;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .action-button {
      padding: 10px 20px;
      font-size: 1.1em;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .roll-button {
      background-color: #0066cc;
      color: #e0e0e0;
    }

    .roll-button:hover {
      background-color: #0077ee;
      box-shadow: 0 0 15px rgba(0, 119, 238, 0.4);
      transform: translateY(-1px);
    }

    .roll-button:disabled {
      background-color: #2a2a2a;
      color: #666;
      cursor: not-allowed;
      box-shadow: none;
    }

    .clear-button {
      background-color: #cc0000;
      color: #e0e0e0;
    }

    .clear-button:hover {
      background-color: #ff0000;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
      transform: translateY(-1px);
    }

    .clear-button:disabled {
      background-color: #2a2a2a;
      color: #666;
      cursor: not-allowed;
      box-shadow: none;
    }

    .empty-pool {
      width: 100%;
      text-align: center;
      color: #888;
      font-style: italic;
    }
  `;

  constructor() {
    super();
    this.rolling = false;
    this.poolDice = [];
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Load saved pool from localStorage
    try {
      const savedPool = localStorage.getItem('currentPool');
      if (savedPool) {
        this.poolDice = JSON.parse(savedPool);
        this.requestUpdate();
      }
    } catch (e) {
      console.error('Error loading pool:', e);
    }
  }

  savePool() {
    try {
      localStorage.setItem('currentPool', JSON.stringify(this.poolDice));
    } catch (e) {
      console.error('Error saving pool:', e);
    }
  }

  handleDieClick(type, e) {
    e.preventDefault();
    e.stopPropagation();
    this.poolDice = [...this.poolDice, { type, id: Math.random() }];
    this.savePool();
    this.requestUpdate();
  }

  handleDieRemoved(e) {
    this.poolDice = this.poolDice.filter(die => die.id !== e.detail.id);
    this.savePool();
    this.requestUpdate();
  }

  clearPool() {
    this.poolDice = [];
    this.savePool();
    this.requestUpdate();
  }

  rollAll() {
    if (this.poolDice.length === 0) return;

    const pool = this.shadowRoot.querySelector('dice-pool');
    const dice = pool.shadowRoot.querySelectorAll('sw-ability-die, sw-proficiency-die, sw-boost-die, sw-difficulty-die, sw-challenge-die, sw-setback-die, sw-force-die');
    
    this.rolling = true;
    const rollResults = [];
    const dieResults = new Map(); // Map to store die elements and their results
    const listeners = [];

    dice.forEach(die => {
      const typeMap = {
        'SW-ABILITY-DIE': 'ability',
        'SW-PROFICIENCY-DIE': 'proficiency',
        'SW-BOOST-DIE': 'boost',
        'SW-DIFFICULTY-DIE': 'difficulty',
        'SW-CHALLENGE-DIE': 'challenge',
        'SW-SETBACK-DIE': 'setback',
        'SW-FORCE-DIE': 'force'
      };

      const listener = (event) => {
        dieResults.set(die, event.detail.result);
        rollResults.push({
          type: typeMap[die.tagName],
          result: event.detail.result,
          id: Math.random()
        });

        if (rollResults.length === dice.length) {
          // All dice have rolled - update pool dice with results
          listeners.forEach(v => v.die.removeEventListener('roll-complete', v.listener));
          this.rolling = false;
          
          // Update poolDice with results while preserving IDs
          this.poolDice = this.poolDice.map((poolDie, index) => ({
            ...poolDie,
            result: Array.from(dice)[index].result
          }));
          
          // Save the updated pool to localStorage
          this.savePool();

          this.dispatchEvent(new CustomEvent('dice-rolled', {
            detail: { rolls: rollResults }
          }));
          
          this.requestUpdate();
        }
      };

      listeners.push({ die, listener });
      die.addEventListener('roll-complete', listener);
      die.roll();
    });
  }

  getDiceCount(type) {
    return this.poolDice.filter(die => die.type === type).length;
  }

  render() {
    const hasPool = this.poolDice.length > 0;
    
    return html`
        <div class="die-selector">
            <sw-challenge-die .static=${true} .count=${this.getDiceCount('challenge')} @click=${(e) => this.handleDieClick('challenge', e)}></sw-challenge-die>
            <sw-difficulty-die .static=${true} .count=${this.getDiceCount('difficulty')} @click=${(e) => this.handleDieClick('difficulty', e)}></sw-difficulty-die>
            <sw-setback-die .static=${true} .count=${this.getDiceCount('setback')} @click=${(e) => this.handleDieClick('setback', e)}></sw-setback-die>
            <sw-proficiency-die .static=${true} .count=${this.getDiceCount('proficiency')} @click=${(e) => this.handleDieClick('proficiency', e)}></sw-proficiency-die>
            <sw-ability-die .static=${true} .count=${this.getDiceCount('ability')} @click=${(e) => this.handleDieClick('ability', e)}></sw-ability-die>
            <sw-boost-die .static=${true} .count=${this.getDiceCount('boost')} @click=${(e) => this.handleDieClick('boost', e)}></sw-boost-die>
            <sw-force-die .static=${true} .count=${this.getDiceCount('force')} @click=${(e) => this.handleDieClick('force', e)}></sw-force-die>
        </div>

        <div class="pool-container">
            ${!hasPool ?
                html`<div class="empty-pool">Click dice above to add them to your pool</div>` :
                html`<dice-pool .dice=${this.poolDice} @die-removed=${this.handleDieRemoved}></dice-pool>`
            }
        </div>

        <div class="action-buttons">
            <button
                class="action-button roll-button"
                @click=${this.rollAll}
                ?disabled=${!hasPool || this.rolling}
            >Roll</button>
            <button
                class="action-button clear-button"
                @click=${this.clearPool}
                ?disabled=${!hasPool || this.rolling}
            >Clear</button>
        </div>
    `;
  }
}

customElements.define('c-rolls', Rolls);
