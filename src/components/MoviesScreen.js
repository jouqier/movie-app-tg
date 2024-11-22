import TMDBService from '../services/tmdb.js';

export class MoviesScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._trendingMovies = [];
        this._anticipatedMovies = [];
        this._popularMovies = [];
    }

    async connectedCallback() {
        await this.loadData();
        this.render();
    }

    async loadData() {
        try {
            // Загружаем все данные параллельно
            const [trending, anticipated, popular] = await Promise.all([
                TMDBService.getTrendingMovies(),
                TMDBService.getAnticipatedMovies(),
                TMDBService.getPopularMovies()
            ]);
            
            this._trendingMovies = trending;
            this._anticipatedMovies = anticipated;
            this._popularMovies = popular?.results || [];
        } catch (error) {
            console.error('Error loading movies:', error);
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

                /* Общие стили для скроллируемых контейнеров */
                .movies-scroll {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    padding: 8px 16px;
                }

                .movies-scroll::-webkit-scrollbar {
                    display: none;
                }

                /* Стили для трендовых фильмов */
                .trending-movie-card {
                    flex: 0 0 auto;
                    width: 228px;
                    aspect-ratio: 2/3;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                }

                .trending-movie-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Стили для обычных карточек */
                .scroll-movie-card {
                    flex: 0 0 auto;
                    width: 128px;
                    aspect-ratio: 2/3;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .scroll-movie-card img {
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

                .movies-scroll-container {
                    position: relative;
                    display: flex;
                    padding: 8px 0;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                    align-self: stretch;
                }

                .movies-scroll-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    scrollbar-width: none;
                }

                .movies-scroll-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .movies-scroll-container::before,
                .movies-scroll-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 16px;
                    pointer-events: none;
                    z-index: 1;
                }

                .movies-scroll-container::before {
                    left: 0;
                    background: linear-gradient(to right, var(--md-sys-color-background), transparent);
                }

                .movies-scroll-container::after {
                    right: 0;
                    background: linear-gradient(to left, var(--md-sys-color-background), transparent);
                }

                .movies-scroll {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 0 16px;
                }

                .trending-movie-card,
                .scroll-movie-card {
                    cursor: pointer;
                }
            </style>

            <div class="section">
                <div class="section-article">MOVIES</div>
                <div class="section-title">Trending Now</div>
                <div class="movies-scroll-container">
                    <div class="movies-scroll-wrapper">
                        <div class="movies-scroll">
                            ${this._renderTrendingMovies(this._trendingMovies)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-article">MOVIES</div>
                <div class="section-title">Most Anticipated</div>
                <div class="movies-scroll-container">
                    <div class="movies-scroll-wrapper">
                        <div class="movies-scroll">
                            ${this._renderScrollMovieCards(this._anticipatedMovies)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-article">MOVIES</div>
                <div class="section-title">Most Popular</div>
                <div class="movies-scroll-container">
                    <div class="movies-scroll-wrapper">
                        <div class="movies-scroll">
                            ${this._renderScrollMovieCards(this._popularMovies)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._setupEventListeners();
    }

    _renderTrendingMovies(movies) {
        return movies.map(movie => `
            <div class="trending-movie-card" data-movie-id="${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                     alt="${movie.title}"
                     loading="lazy">
                <div class="rating-badge">
                    <svg viewBox="0 0 24 24">
                        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                    </svg>
                    <span class="rating-text">${movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
        `).join('');
    }

    _renderScrollMovieCards(movies) {
        return movies.map(movie => `
            <div class="scroll-movie-card" data-movie-id="${movie.id}">
                <img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" 
                     alt="${movie.title}"
                     loading="lazy">
            </div>
        `).join('');
    }

    _setupEventListeners() {
        this.shadowRoot.querySelectorAll('.trending-movie-card, .scroll-movie-card').forEach(card => {
            card.addEventListener('click', () => {
                const movieId = card.dataset.movieId;
                this.dispatchEvent(new CustomEvent('movie-selected', {
                    detail: { movieId, type: 'movie' },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

customElements.define('movies-screen', MoviesScreen); 