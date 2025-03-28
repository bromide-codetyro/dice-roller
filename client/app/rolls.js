import { css, html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import './dice/dice-pool.js';

class Rolls extends LitElement {
  static properties = {
    rolling: { type: Boolean },
    poolDice: { type: Array },
    showSymbolNames: { type: Boolean }
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
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    .center-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-grow: 1;
      min-width: 200px;
    }
    
    /* Ensure buttons have minimum width and shrink appropriately */
    .action-button {
      min-width: 80px;
      flex-shrink: 1;
    }
    
    /* On small screens, align buttons and adjust layout */
    @media (max-width: 480px) {
      .action-buttons {
        justify-content: center;
      }
      
      .toggle-button {
        order: 3;
        margin-top: 10px;
        width: 100%;
        max-width: 200px;
      }
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
    
    .toggle-button {
      background-color: #336699;
      color: #e0e0e0;
    }

    .toggle-button:hover {
      background-color: #4477aa;
      box-shadow: 0 0 15px rgba(51, 102, 153, 0.3);
      transform: translateY(-1px);
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
    this.showSymbolNames = false;
    
    // We'll load the pool in connectedCallback for better reliability
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Load saved pool from localStorage when component is connected to DOM
    this.loadPoolFromStorage();
    
    // Add window storage event listener to update if localStorage changes in another tab
    window.addEventListener('storage', (event) => {
      if (event.key === 'currentPool') {
        this.loadPoolFromStorage();
      }
    });
    
    // Add a load event listener to ensure pool is loaded on refresh
    window.addEventListener('load', () => {
      console.log('Rolls component: Window load event triggered');
      this.loadPoolFromStorage();
    });
    
    // Add a beforeunload event to save the state before the page unloads
    window.addEventListener('beforeunload', () => {
      console.log('Saving pool before page unload');
      this.savePool();
    });
    
    // Save the pool periodically, every 10 seconds
    this.saveInterval = setInterval(() => {
      if (this.poolDice.length > 0) {
        this.savePool();
      }
    }, 10000);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up the interval when the component is disconnected
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }
  
  loadPoolFromStorage() {
    try {
      const savedPool = localStorage.getItem('currentPool');
      if (savedPool) {
        this.poolDice = JSON.parse(savedPool);
        console.log('Loaded dice pool from storage, dice count:', this.poolDice.length);
        
        // Force an update of the component
        this.requestUpdate();
        
        // Ensure any dice with results are displayed correctly
        setTimeout(() => {
          // Try to get the dice-pool component and force it to update
          const dicePool = this.shadowRoot.querySelector('dice-pool');
          if (dicePool) {
            dicePool.requestUpdate();
          }
        }, 100);
      }
    } catch (e) {
      console.error('Error loading pool:', e);
    }
  }

  savePool() {
    try {
      // Save the current pool to localStorage
      const poolJSON = JSON.stringify(this.poolDice);
      localStorage.setItem('currentPool', poolJSON);
      
      // Add a timestamp to track when the pool was last saved
      localStorage.setItem('poolLastSaved', Date.now().toString());
      
      // Log the save for debugging
      console.log('Dice pool saved, dice count:', this.poolDice.length);
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
    const diceArray = Array.from(dice);
    
    // Create a mapping between die elements and poolDice entries
    const dieToPoolMapping = new Map();
    
    // We'll map the dice elements to pool dice entries based on their type and position
    // This creates a more reliable mapping than using array indices
    const typeCounters = {
      'SW-ABILITY-DIE': 0,
      'SW-PROFICIENCY-DIE': 0,
      'SW-BOOST-DIE': 0,
      'SW-DIFFICULTY-DIE': 0,
      'SW-CHALLENGE-DIE': 0,
      'SW-SETBACK-DIE': 0,
      'SW-FORCE-DIE': 0
    };
    
    const typeMap = {
      'SW-ABILITY-DIE': 'ability',
      'SW-PROFICIENCY-DIE': 'proficiency',
      'SW-BOOST-DIE': 'boost',
      'SW-DIFFICULTY-DIE': 'difficulty',
      'SW-CHALLENGE-DIE': 'challenge',
      'SW-SETBACK-DIE': 'setback',
      'SW-FORCE-DIE': 'force'
    };
    
    // First, build the mapping between die elements and poolDice entries
    diceArray.forEach(die => {
      const type = typeMap[die.tagName];
      const position = typeCounters[die.tagName]++;
      
      // Find the corresponding pool die of the same type at the same position
      const poolDieIndex = this.poolDice.findIndex((poolDie, index) => {
        // Find dice of the same type
        if (poolDie.type === type) {
          // Count previous dice of this type to determine position
          const prevCount = this.poolDice.slice(0, index).filter(pd => pd.type === type).length;
          return prevCount === position;
        }
        return false;
      });
      
      if (poolDieIndex !== -1) {
        dieToPoolMapping.set(die, poolDieIndex);
      }
    });

    diceArray.forEach(die => {
      const listener = (event) => {
        const type = typeMap[die.tagName];
        const result = event.detail.result;
        dieResults.set(die, result);
        
        rollResults.push({
          type: type,
          result: result,
          id: Math.random()
        });

        if (rollResults.length === dice.length) {
          // All dice have rolled - update pool dice with results
          listeners.forEach(v => v.die.removeEventListener('roll-complete', v.listener));
          this.rolling = false;
          
          // Update poolDice with results using our mapping
          const updatedDice = [...this.poolDice];
          dieResults.forEach((result, dieElement) => {
            const poolIndex = dieToPoolMapping.get(dieElement);
            if (poolIndex !== undefined) {
              updatedDice[poolIndex] = {
                ...updatedDice[poolIndex],
                result: result
              };
            }
          });
          
          this.poolDice = updatedDice;
          this.savePool(); // Save to localStorage

          this.dispatchEvent(new CustomEvent('dice-rolled', {
            detail: { rolls: rollResults }
          }));
          
          this.requestUpdate();
          
          // Double-check that the pool is saved to localStorage after a short delay
          // This ensures it's saved even if there's any race condition
          setTimeout(() => {
            this.savePool();
          }, 100);
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
                html`<div class="empty-pool">Click dice above to add them to your pool.<br>Click dice in the pool to remove them.</div>` :
                html`<dice-pool 
                  .dice=${this.poolDice} 
                  .showSymbolNames=${this.showSymbolNames} 
                  @die-removed=${this.handleDieRemoved}></dice-pool>`
            }
        </div>

        <div class="action-buttons">
            <div class="center-buttons">
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
            <button
                class="action-button toggle-button"
                @click=${() => this.dispatchEvent(new CustomEvent('toggle-display', {bubbles: true, composed: true}))}
            >${this.showSymbolNames ? 'Names' : 'Symbols'}</button>
        </div>
    `;
  }
}

customElements.define('c-rolls', Rolls);
