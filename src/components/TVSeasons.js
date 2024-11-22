export class TVSeasons extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set seasons(value) {
        this._seasons = value;
        this.render();
    }

    render() {
        if (!this._seasons || !this._seasons.length) return;

        const seasonTabs = this._seasons.map((season, index) => `
            <md-filled-tonal-button class="season-tab" data-season="${index + 1}" 
                ${index === 0 ? 'selected' : ''}>
                Сезон ${index + 1}
            </md-filled-tonal-button>
        `).join('');

        const currentSeason = this._seasons[0];
        const episodes = currentSeason.episodes?.map(episode => `
            <div class="episode-wrapper">
                <div class="episode-item">
                    <div class="episode-number">${episode.episode_number}</div>
                    <div class="episode-info">
                        <div class="episode-title">${episode.name}</div>
                        <div class="episode-date">${new Date(episode.air_date).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <md-checkbox touch-target="wrapper"></md-checkbox>
                </div>
                <div class="divider"></div>
            </div>
        `).join('') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    align-self: stretch;
                }

                .seasons-container {
                    position: relative;
                    display: flex;
                    padding: 8px 0;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    align-self: stretch;
                    height: 40px;
                }

                .seasons-list-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                }

                .seasons-list-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .seasons-container::before,
                .seasons-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 16px;
                    pointer-events: none;
                    z-index: 1;
                }

                .seasons-container::before {
                    left: 0;
                    background: linear-gradient(to right, #10131B, transparent);
                }

                .seasons-container::after {
                    right: 0;
                    background: linear-gradient(to left, #10131B, transparent);
                }

                .seasons-list {
                    display: flex;
                    align-items: flex-start;
                    flex-wrap: nowrap;
                    padding: 0 16px;
                }

                .season-tab {
                    --md-filled-tonal-button-container-color: rgba(255, 255, 255, 0.0);
                    --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-surface);
                    --md-filled-tonal-button-hover-label-text-color: var(--md-sys-color-on-surface);
                    --md-filled-tonal-button-pressed-label-text-color: var(--md-sys-color-on-surface);
                    --md-filled-tonal-button-container-shape: 1000px;
                    --md-filled-tonal-button-label-text-font: 600 14px sans-serif;
                    --md-filled-tonal-button-container-height: 40px;
                    --md-filled-tonal-button-focus-label-text-color: var(--md-sys-color-on-surface);
                    flex: 0 0 auto;
                }

                .season-tab[selected] {
                    --md-filled-tonal-button-container-color: var(--md-sys-color-surface-container-high);
                }

                .episodes-list {
                    display: flex;
                    padding: 8px 0px;
                    flex-direction: column;
                    align-items: flex-start;
                    align-self: stretch;
                }

                .episode-item {
                    display: flex;
                    padding: 10px 16px;
                    align-items: center;
                    gap: 4px;
                    align-self: stretch;
                }

                .episode-number {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 20px;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    color: var(--md-sys-color-outline);
                    text-overflow: ellipsis;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 20px;
                }

                .episode-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    flex: 1 0 0;
                }

                .episode-title {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    color: var(--md-sys-color-on-surface);;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 20px;
                }

                .episode-date {
                    overflow: hidden;
                    color: var(--md-sys-color-outline);
                    text-overflow: ellipsis;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 16px;
                }

                .episode-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-self: stretch;
                }

                .divider {
                    height: 1px;
                    background: var(--md-sys-color-outline-variant);
                    margin: 8px 16px;
                }

                md-checkbox {
                    --md-checkbox-container-shape: 4px;
                    --md-checkbox-outline-color: rgba(255, 255, 255, 0.5);
                    --md-checkbox-selected-container-color: #E0E2ED;
                    --md-checkbox-selected-icon-color: #10131B;
                    margin-right: auto;
                }
            </style>

            <div class="seasons-container">
                <div class="seasons-list-wrapper">
                    <div class="seasons-list">
                        ${seasonTabs}
                        <div style="padding-right: 4px; flex-shrink: 0;"> </div>
                    </div>
                </div>
            </div>

            <div class="episodes-list">
                ${episodes}
            </div>
        `;

        this.shadowRoot.querySelectorAll('.season-tab').forEach(tab => {
            tab.addEventListener('click', () => this._handleSeasonChange(tab.dataset.season));
        });
    }

    _handleSeasonChange(seasonNumber) {
        // Обновляем UI для выбранного сезона
        const season = this._seasons[seasonNumber - 1];
        const episodesList = this.shadowRoot.querySelector('.episodes-list');
        
        // Обновляем стили табов
        this.shadowRoot.querySelectorAll('.season-tab').forEach(tab => {
            tab.toggleAttribute('selected', tab.dataset.season === seasonNumber);
        });

        // Обновляем списо эпизодов
        episodesList.innerHTML = season.episodes.map(episode => `
            <div class="episode-wrapper">
                <div class="episode-item">
                    <div class="episode-number">${episode.episode_number}</div>
                    <div class="episode-info">
                        <div class="episode-title">${episode.name}</div>
                        <div class="episode-date">${new Date(episode.air_date).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <md-checkbox touch-target="wrapper"></md-checkbox>
                </div>
                <div class="divider"></div>
            </div>
        `).join('');
    }
}

customElements.define('tv-seasons', TVSeasons); 