import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import './rolls.js';
import './history.js';

class Prime extends LitElement {
  static properties = {
    history: { type: Array }
  };

  static styles = css`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      min-height: 100vh;
      color: #e0e0e0;
    }
  `;

  constructor() {
    super();
    
    // Load history from localStorage
    try {
      const savedHistory = localStorage.getItem('diceHistory');
      this.history = savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error('Error loading history:', e);
      this.history = [];
    }

    // Load current dice pool from localStorage
    try {
      const savedPool = localStorage.getItem('currentPool');
      this.currentPool = savedPool ? JSON.parse(savedPool) : [];
    } catch (e) {
      console.error('Error loading pool:', e);
      this.currentPool = [];
    }
  }

  saveState() {
    try {
      localStorage.setItem('diceHistory', JSON.stringify(this.history));
      localStorage.setItem('currentPool', JSON.stringify(this.currentPool));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  handleRoll(e) {
    // Update history
    this.history = [{
      timestamp: new Date(),
      rolls: e.detail.rolls
    }, ...this.history];
    this.saveState();
    this.requestUpdate();
  }

  handleHistoryClear() {
    this.history = [];
    this.saveState();
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <c-rolls @dice-rolled=${this.handleRoll}></c-rolls>
        <c-history 
          .history=${this.history}
          @clear-history=${this.handleHistoryClear}>
        </c-history>
      </div>
    `;
  }
}

customElements.define('c-prime', Prime);
