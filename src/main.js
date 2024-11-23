import './theme.css';
import './components/MovieCard.js';
import './components/MovieInfo.js';
import './components/MoviePoster.js';
import './components/MovieCast.js';
import './components/MovieRecommendations.js';
import './components/TVSeasons.js';
import './components/SearchScreen.js';
import './components/TabBar.js';
import './components/MoviesScreen.js';
import './components/TVShowsScreen.js';
import TMDBService from './services/tmdb.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    
    const container = document.querySelector('#movies-container');
    if (!container) {
        console.error('Container not found!');
        return;
    }

    try {
        const searchScreen = document.createElement('search-screen');
        container.appendChild(searchScreen);
        console.log('Search screen added');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});
