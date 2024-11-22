import './MovieStats.js';
import './MovieCast.js';
import './MovieRecommendations.js';
import './MovieInfo.js';
import './MoviePoster.js';
import './TVSeasons.js';

export class MovieCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    width: 100%;
                    box-sizing: border-box;
                    padding-bottom: 72px;
                }
            </style>
            <movie-poster></movie-poster>
            <movie-info></movie-info>
            <movie-cast></movie-cast>
            <movie-recommendations></movie-recommendations>
        `;
    }

    set movie(value) {
        this._movie = value;
        this.render();
    }

    render() {
        if (!this._movie) return;

        console.log('Movie data:', this._movie);

        // Установка данных для дочерних компонентов
        this.shadowRoot.querySelector('movie-poster').movie = this._movie;

        if (this._movie.credits) {
            const castElement = this.shadowRoot.querySelector('movie-cast');
            castElement.cast = this._movie.credits.cast;
        }
        
        if (this._movie) {
            const info = {
                title: this._movie.title || this._movie.name,
                rating: this._movie.vote_average,
                releaseDate: this._movie.release_date,
                firstAirDate: this._movie.first_air_date,
                lastAirDate: this._movie.last_air_date,
                status: this._movie.status,
                numberOfSeasons: this._movie.number_of_seasons,
                numberOfEpisodes: this._movie.number_of_episodes,
                runtime: this._movie.runtime,
                overview: this._movie.overview,
                genres: this._movie.genres.map(g => g.name),
                type: this._movie.type || 'movie',
                seasons: this._movie.seasons,
                air_date: this._movie.air_date
            };
            
            console.log('Info being passed:', info);
            const movieInfo = this.shadowRoot.querySelector('movie-info');
            movieInfo.info = info;
        }
        
        if (this._movie.recommendations) {
            const recommendationsElement = this.shadowRoot.querySelector('movie-recommendations');
            recommendationsElement.recommendations = this._movie.recommendations;
            recommendationsElement.currentMovie = this._movie.title || this._movie.name;
        }
    }
}

customElements.define('movie-card', MovieCard); 