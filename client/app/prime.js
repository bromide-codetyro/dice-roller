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
    this.history = [];
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Load history from localStorage
    try {
      const savedHistory = localStorage.getItem('diceHistory');
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        this.requestUpdate();
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('diceHistory', JSON.stringify(this.history));
    } catch (e) {
      console.error('Error saving history:', e);
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
