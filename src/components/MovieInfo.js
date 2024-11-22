import '@material/web/button/filled-tonal-button.js';

export class MovieInfo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set info(value) {
        this._info = value;
        this.render();
    }

    render() {
        if (!this._info) return;
        
        console.log('Info in MovieInfo:', this._info);

        const { type, title, rating, overview, genres, seasons } = this._info;
        
        const metaInfo = type === 'tv' 
            ? this._renderTVMeta()
            : this._renderMovieMeta();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    padding: 16px 0px;
                    flex-direction: column;
                    align-items: flex-start;
                    align-self: stretch;
                    border-radius: 40px;
                    background: var(--md-sys-color-surface);
                    overflow: hidden;
                }

                h1, h2, h3, h4, p {
                    margin: 0;
                }                

                .title {
                    text-align: center;
                    font-size: 22px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 28px;
                    color: var(--md-sys-color-on-surface);
                }
                
                .title-info {
                    display: flex;
                    padding: 8px 16px 16px 16px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    align-self: stretch;
                }

                .meta {
                    display: flex;
                    padding: 0px 16px;
                    justify-content: center;
                    align-items: flex-start;
                    align-self: stretch;
                    text-align: center;
                    gap: 4px;
                    color: var(--md-sys-color-outline);
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 16px;
                }
                
                .overview {
                    align-self: stretch;
                    font-size: 14px;
                    line-height: 20px;
                    font-style: normal;
                    font-weight: 600;
                    color: var(--md-sys-color-on-surface);
                }
                
                .overview-container {
                    display: flex;
                    padding: 8px 16px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-end;
                    align-self: stretch;
                }

                .genres-container {
                    position: relative;
                    display: flex;
                    padding: 8px 0;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    align-self: stretch;
                    height: 40px;
                }

                .genres-list-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                }

                .genres-list-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .genres-container::before,
                .genres-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 16px;
                    pointer-events: none;
                    z-index: 1;
                }

                .genres-container::before {
                    left: 0;
                    background: linear-gradient(to right, #10131B, transparent);
                }

                .genres-container::after {
                    right: 0;
                    background: linear-gradient(to left, #10131B, transparent);
                }

                .genres-list {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 0 16px;
                }

                md-filled-tonal-button {
                    flex-shrink: 0;
                    --md-filled-tonal-button-container-shape: 1000px;
                    --md-filled-tonal-button-container-color: var(--md-sys-color-surface-container-high);
                    --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-surface);
                    --md-filled-tonal-button-label-text-font: 600 14px sans-serif;
                    --md-filled-tonal-button-container-height: 40px;
                    --md-filled-tonal-button-hover-label-text-color: var(--md-sys-color-on-surface);
                    --md-filled-tonal-button-pressed-label-text-color: var(--md-sys-color-on-surface);
                    --md-filled-tonal-button-focus-label-text-color: var(--md-sys-color-on-surface);
                }

                .subheader {
                    display: flex;
                    padding: 16px 16px 4px 16px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    align-self: stretch;
                    color: var(--md-sys-color-outline);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 20px;
                }
            </style>

            <div class="title-info">
                <div class="title">${title}</div>
                ${metaInfo}
            </div>
            
            ${type === 'tv' && seasons ? `
                <tv-seasons></tv-seasons>
            ` : ''}

            <div class="overview-container">
                <p class="overview">${overview}</p>
            </div>
            
            <div class="subheader">Genres</div>

            <div class="genres-container">
                <div class="genres-list-wrapper">
                    <div class="genres-list">
                        ${genres.map(genre => `
                            <md-filled-tonal-button>${genre}</md-filled-tonal-button>
                        `).join('')}
                        <div style="padding-right: 4px; flex-shrink: 0;"> </div>
                    </div>
                </div>
            </div>
        `;
        
        if (type === 'tv' && seasons) {
            const seasonsElement = this.shadowRoot.querySelector('tv-seasons');
            if (seasonsElement) {
                console.log('Setting seasons data:', seasons);
                seasonsElement.seasons = seasons;
            }
        }
    }

    _renderTVMeta() {
        const { 
            rating, 
            firstAirDate,
            lastAirDate,
            status,
            numberOfSeasons,
            numberOfEpisodes,
            air_date
        } = this._info;

        const startYear = firstAirDate 
            ? new Date(firstAirDate).getFullYear()
            : air_date 
                ? new Date(air_date).getFullYear()
                : this._info.first_air_date 
                    ? new Date(this._info.first_air_date).getFullYear()
                    : '???';
                    
        const endYear = lastAirDate 
            ? new Date(lastAirDate).getFullYear() 
            : status === 'Ended' 
                ? new Date().getFullYear() 
                : 'Present';
                
        const statusText = status === 'Ended' ? 'Ended' : 'In progress';
        
        return `
            <div class="meta">
                <span>${rating} IMDb</span>
                <span>•</span>
                <span>${startYear} - ${endYear}</span>
                <span>•</span>
                <span>${statusText}</span>
            </div>
        `;
    }

    _renderMovieMeta() {
        const { rating, releaseDate, runtime } = this._info;
        
        const date = new Date(releaseDate);
        const formattedDate = date.toLocaleDateString('en-EN', { 
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        const formattedRuntime = `${hours} ч ${minutes} мин`;

        return `
            <div class="meta">
                <span>${rating} IMDb</span>
                <span>•</span>
                <span>${formattedDate}</span>
                <span>•</span>
                <span>${formattedRuntime}</span>
            </div>
        `;
    }

    _pluralize(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }
}

customElements.define('movie-info', MovieInfo); 