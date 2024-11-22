export class MoviePoster extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set movie(value) {
        this._movie = value;
        this.render();
    }

    render() {
        if (!this._movie) return;

        this.shadowRoot.innerHTML = `
            <style>
                .action-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    align-self: stretch;
                    border-radius: 40px;
                    position: relative;
                    overflow: hidden;
                }
                
                .action-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url(https://image.tmdb.org/t/p/w500${this._movie.poster_path}) lightgray 50% / cover no-repeat;
                    border-radius: 42px;
                }
                
                .action-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.60);
                    backdrop-filter: blur(20px);
                }
                
                .image-container {
                    display: flex;
                    padding: 32px 80px 16px 80px;
                    flex-direction: column;
                    align-items: center;
                    align-self: stretch;
                    z-index: 1;
                }
                
                .poster img {
                    width: 100%;
                    height: auto;
                    display: block;
                    border-radius: 4px;
                }
                
                .action-buttons {
                    display: flex;
                    padding: 16px;
                    align-items: center;
                    gap: 8px;
                    align-self: stretch;
                    z-index: 1;
                }
                
                md-filled-tonal-button {
                    flex: 1 0 0;
                    --md-filled-tonal-button-container-shape: 1000px;
                    --md-filled-tonal-button-label-text-font: 600 14px sans-serif;
                    --md-sys-color-secondary-container: rgba(255, 255, 255, 0.32);
                    --md-sys-color-on-secondary-container: #FFF;
                    height: 48px;
                }
            </style>
            
            <div class="action-container">
                <div class="image-container">
                    <div class="poster">
                        <img src="https://image.tmdb.org/t/p/w500${this._movie.poster_path}" 
                            alt="${this._movie.title}"
                            onerror="console.error('Failed to load image:', this.src)">
                    </div>
                </div>
                
                <div class="action-buttons">
                    <md-filled-tonal-button>Want</md-filled-tonal-button>
                    <md-filled-tonal-button>Watched</md-filled-tonal-button>
                </div>
            </div>
        `;
    }
}

customElements.define('movie-poster', MoviePoster); 