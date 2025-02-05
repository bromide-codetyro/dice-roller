import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import './dice/dice-pool.js';

class History extends LitElement {
  static properties = {
    history: { type: Array }
  };

  static styles = css`
    .history-section {
      margin-top: 30px;
      padding: 20px;
      background: #2a2a2a;
      border-radius: 8px;
      border: 1px solid #3a3a3a;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #3a3a3a;
      padding-bottom: 10px;
    }

    .history-header h2 {
      margin: 0;
      font-size: 1.2em;
      color: #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .clear-button {
      padding: 8px 16px;
      font-size: 0.9em;
      background-color: #cc0000;
      color: #e0e0e0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .clear-button:hover {
      background-color: #ff0000;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
    }

    .clear-button:disabled {
      background-color: #2a2a2a;
      color: #666;
      cursor: not-allowed;
      box-shadow: none;
    }

    .empty-history {
      text-align: center;
      color: #888;
      font-style: italic;
      padding: 20px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .history-entry {
      padding: 15px;
      background: #222;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      border: 1px solid #3a3a3a;
    }
  `;

  constructor() {
    super();
    this.history = [];
  }

  clearHistory() {
    this.dispatchEvent(new CustomEvent('clear-history', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const hasHistory = this.history.length > 0;

    return html`
      <div class="history-section">
        <div class="history-header">
          <h2>History</h2>
          <button 
            class="clear-button" 
            @click=${this.clearHistory}
            ?disabled=${!hasHistory}
          >Clear</button>
        </div>
        ${!hasHistory ? 
          html`<div class="empty-history">No rolls yet</div>` :
          html`<div class="history-list">
            ${this.history.map(entry => html`
              <div class="history-entry">
                <dice-pool .dice=${entry.rolls.map(r => ({...r, id: Math.random()}))} .static=${true}></dice-pool>
              </div>
            `)}
          </div>`
        }
      </div>
    `;
  }
}

customElements.define('c-history', History);
