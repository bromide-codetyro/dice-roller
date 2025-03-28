import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';
import './rolls.js';
import './history.js';

class Prime extends LitElement {
  static properties = {
    history: { type: Array },
    showSymbolNames: { type: Boolean }
  };

  static styles = css`
    .toggle-button {
      padding: 8px 16px;
      font-size: 0.9em;
      background-color: #336699;
      color: #e0e0e0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
    }

    .toggle-button:hover {
      background-color: #4477aa;
      box-shadow: 0 0 15px rgba(51, 102, 153, 0.3);
    }
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      min-height: 100vh;
      color: #e0e0e0;
      position: relative;
      z-index: 1;
      background-color: rgba(26, 26, 26, 0.7);
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(3px);
    }
    
    /* Additional star effect for larger, brighter stars */
    .bright-star {
      position: absolute;
      background-color: white;
      border-radius: 50%;
      filter: blur(0.5px);
      animation: twinkle-star var(--duration) ease-in-out infinite alternate;
    }
    
    @keyframes twinkle-star {
      0% { opacity: 0.3; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
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
    
    // Load showSymbolNames preference from localStorage
    try {
      const savedShowSymbolNames = localStorage.getItem('showSymbolNames');
      this.showSymbolNames = savedShowSymbolNames ? JSON.parse(savedShowSymbolNames) : false;
    } catch (e) {
      console.error('Error loading symbol display preference:', e);
      this.showSymbolNames = false;
    }
    
    // Generate bright stars
    this.brightStars = this.generateBrightStars(15);
  }
  
  // Generate random bright stars
  generateBrightStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        size: Math.random() * 3 + 2, // 2-5px
        top: Math.random() * 100,    // 0-100%
        left: Math.random() * 100,   // 0-100%
        duration: Math.random() * 3 + 2 + 's', // 2-5s
        delay: Math.random() * 5 + 's'  // 0-5s delay
      });
    }
    return stars;
  }

  saveState() {
    try {
      localStorage.setItem('diceHistory', JSON.stringify(this.history));
      localStorage.setItem('showSymbolNames', JSON.stringify(this.showSymbolNames));
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

  toggleSymbolDisplay() {
    this.showSymbolNames = !this.showSymbolNames;
    this.saveState();
    this.requestUpdate();
  }

  firstUpdated() {
    // When the component is first updated, make sure the dice-roller loads its state
    // Check if the page is already loaded (if we're coming from a SPA navigation)
    if (document.readyState === 'complete') {
      this._initializeRollsComponent();
    } else {
      // Wait for the window load event if the page is still loading
      window.addEventListener('load', () => {
        console.log('Prime component: Window loaded event triggered');
        this._initializeRollsComponent();
      });
    }
  }
  
  _initializeRollsComponent() {
    // Find the c-rolls component and trigger a load
    const rollsComponent = this.shadowRoot.querySelector('c-rolls');
    if (rollsComponent && typeof rollsComponent.loadPoolFromStorage === 'function') {
      // If component is available, tell it to refresh its state
      rollsComponent.loadPoolFromStorage();
    } else {
      // If the component isn't ready yet, try again in a moment
      setTimeout(() => this._initializeRollsComponent(), 100);
    }
  }

  render() {
    return html`
      <!-- Bright stars in the background -->
      ${this.brightStars.map(star => html`
        <div class="bright-star" 
          style="
            width: ${star.size}px; 
            height: ${star.size}px; 
            top: ${star.top}%; 
            left: ${star.left}%; 
            --duration: ${star.duration};
            animation-delay: ${star.delay};
          ">
        </div>
      `)}
      
      <div class="container">
        <c-rolls id="dice-roller" @dice-rolled=${this.handleRoll} @toggle-display=${this.toggleSymbolDisplay} .showSymbolNames=${this.showSymbolNames}></c-rolls>
        <c-history 
          .history=${this.history}
          .showSymbolNames=${this.showSymbolNames}
          @clear-history=${this.handleHistoryClear}>
        </c-history>
      </div>
    `;
  }
}

customElements.define('c-prime', Prime);
