import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js';

class Fonts extends LitElement {
  static styles = css`
    .container {
      padding: 30px;
      max-width: 800px;
      margin: 40px auto;
      background: #2a2a2a;
      border-radius: 8px;
      border: 1px solid #3a3a3a;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }
    
    .section {
      margin: 30px 0;
    }
    
    .section:first-child {
      margin-top: 0;
    }
    
    .label {
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 1.2em;
      color: #e0e0e0;
      border-bottom: 2px solid #3a3a3a;
      padding-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .char-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 10px;
    }
    
    .char-pair {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #3a3a3a;
      border-radius: 4px;
      padding: 10px;
      background: #222;
      color: #e0e0e0;
      transition: transform 0.2s ease;
    }
    
    .char-pair:hover {
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(0, 102, 204, 0.2);
    }
    
    .arial {
      font-family: Arial, sans-serif;
    }
    
    .sw-ffg {
      font-family: 'SW-FFG';
      margin-top: 5px;
    }
  `;

  render() {
    const createPairs = chars => html`
      <div class="char-grid">
        ${chars.split('').map(char => html`
          <div class="char-pair">
            <span class="arial">${char}</span>
            <span class="sw-ffg">${char}</span>
          </div>
        `)}
      </div>
    `;

    return html`
      <div class="container">
        <div class="section">
          <div class="label">Uppercase Letters</div>
          ${createPairs('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}
        </div>
        
        <div class="section">
          <div class="label">Lowercase Letters</div>
          ${createPairs('abcdefghijklmnopqrstuvwxyz')}
        </div>
        
        <div class="section">
          <div class="label">Numbers</div>
          ${createPairs('0123456789')}
        </div>
      </div>
    `;
  }
}

customElements.define('c-fonts', Fonts);
