import TMDBService from '../services/tmdb.js';

export class TVShowsScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._trendingShows = [];
        this._anticipatedShows = [];
        this._popularShows = [];
    }

    async connectedCallback() {
        await this.loadData();
        this.render();
    }

    async loadData() {
        try {
            const [trending, popular, topRated] = await Promise.all([
                TMDBService.getTrendingTV(),
                TMDBService.getPopularTV(),
                TMDBService.getTopRatedTV()
            ]);
            
            this._trendingShows = trending;
            this._anticipatedShows = popular?.results || [];
            this._popularShows = topRated;
        } catch (error) {
            console.error('Error loading TV shows:', error);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    padding-bottom: 80px;
                    padding-top: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 16px;                    
                }

                .section {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    align-self: stretch;
                }

                .section-article {
                    display: flex;
                    padding: 8px 16px 0px 16px;
                    flex-direction: column;
                    justify-content: center;
                    align-self: stretch;                
                    color: var(--md-sys-color-outline);
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 16px;
                }

                .section-title {
                    display: flex;
                    padding: 0px 16px 8px 16px;
                    flex-direction: column;
                    justify-content: center;
                    align-self: stretch;
                    color: var(--md-sys-color-on-surface);
                    font-size: 24px;
                    font-weight: 600;
                    line-height: 32px;
                }

                .shows-scroll {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    padding: 8px 16px;
                }

                .shows-scroll::-webkit-scrollbar {
                    display: none;
                }

                .trending-show-card {
                    flex: 0 0 auto;
                    width: 228px;
                    aspect-ratio: 2/3;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                }

                .trending-show-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .scroll-show-card {
                    flex: 0 0 auto;
                    width: 128px;
                    aspect-ratio: 2/3;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .scroll-show-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .rating-badge {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(2px);
                    padding: 4px 8px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .rating-badge svg {
                    width: 12px;
                    height: 12px;
                    fill: #FFD700;
                }

                .rating-text {
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                }

                .shows-scroll-container {
                    position: relative;
                    display: flex;
                    padding: 8px 0;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    align-self: stretch;
                }

                .shows-scroll-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    scrollbar-width: none;
                }

                .shows-scroll-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .shows-scroll-container::before,
                .shows-scroll-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 16px;
                    pointer-events: none;
                    z-index: 1;
                }

                .shows-scroll-container::before {
                    left: 0;
                    background: linear-gradient(to right, var(--md-sys-color-background), transparent);
                }

                .shows-scroll-container::after {
                    right: 0;
                    background: linear-gradient(to left, var(--md-sys-color-background), transparent);
                }

                .shows-scroll {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 0 16px;
                }

                .trending-show-card,
                .scroll-show-card {
                    cursor: pointer;
                }
            </style>

            <div class="section">
                <div class="section-article">TV SHOWS</div>
                <div class="section-title">Trending Now</div>
                <div class="shows-scroll-container">
                    <div class="shows-scroll-wrapper">
                        <div class="shows-scroll">
                            ${this._renderTrendingShows(this._trendingShows)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-article">TV SHOWS</div>
                <div class="section-title">Most Popular</div>
                <div class="shows-scroll-container">
                    <div class="shows-scroll-wrapper">
                        <div class="shows-scroll">
                            ${this._renderScrollShowCards(this._anticipatedShows)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-article">TV SHOWS</div>
                <div class="section-title">Top Rated</div>
                <div class="shows-scroll-container">
                    <div class="shows-scroll-wrapper">
                        <div class="shows-scroll">
                            ${this._renderScrollShowCards(this._popularShows)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._setupEventListeners();
    }

    _renderTrendingShows(shows) {
        return shows.map(show => `
            <div class="trending-show-card" data-show-id="${show.id}">
                <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
                     alt="${show.name}"
                     loading="lazy">
                <div class="rating-badge">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                    </svg>
                    <span class="rating-text">${show.vote_average.toFixed(1)}</span>
                </div>
            </div>
        `).join('');
    }

    _renderScrollShowCards(shows) {
        return shows.map(show => `
            <div class="scroll-show-card" data-show-id="${show.id}">
                <img src="https://image.tmdb.org/t/p/w342${show.poster_path}" 
                     alt="${show.name}"
                     loading="lazy">
            </div>
        `).join('');
    }

    _setupEventListeners() {
        this.shadowRoot.querySelectorAll('.trending-show-card, .scroll-show-card').forEach(card => {
            card.addEventListener('click', () => {
                const showId = card.dataset.showId;
                this.dispatchEvent(new CustomEvent('movie-selected', {
                    detail: { movieId: showId, type: 'tv' },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

customElements.define('tv-shows-screen', TVShowsScreen); 