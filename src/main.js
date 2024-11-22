import './theme.css';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/checkbox/checkbox.js';
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
import { initTelegram } from './config/telegram.js';

// Функция для показа экрана поиска
function showSearchScreen() {
    const container = document.querySelector('#movies-container');
    container.innerHTML = '';
    const searchScreen = document.createElement('search-screen');
    container.appendChild(searchScreen);
}

// Функция для показа деталей фильма
async function showMovieDetails(id, type = 'movie') {
    try {
        const data = await TMDBService.getFullMovieInfo(id, type);
        
        document.documentElement.style.setProperty(
            '--movie-backdrop',
            `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
        );
        
        const container = document.querySelector('#movies-container');
        container.innerHTML = '';
        const movieCard = document.createElement('movie-card');
        movieCard.movie = data;
        container.appendChild(movieCard);
        
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error showing movie details:', error);
    }
}

// Функция инициализации
window.addEventListener('DOMContentLoaded', () => {
    // Инициализируем Telegram Mini App
    initTelegram();
    
    const container = document.querySelector('#movies-container');
    const tabBar = document.querySelector('tab-bar');
    
    // Устанавливаем активный таб
    tabBar.setActiveTab('movies');
    
    // Создаем и показываем начальный экран
    const moviesScreen = document.createElement('movies-screen');
    container.innerHTML = '';
    container.appendChild(moviesScreen);
});

// Обработчик переключения табов
document.addEventListener('tab-changed', (event) => {
    const tab = event.detail.tab;
    const container = document.querySelector('#movies-container');
    
    switch (tab) {
        case 'search':
            showSearchScreen();
            break;
        case 'movies':
            container.innerHTML = '';
            const moviesScreen = document.createElement('movies-screen');
            container.appendChild(moviesScreen);
            break;
        case 'tv':
            container.innerHTML = '';
            const tvShowsScreen = document.createElement('tv-shows-screen');
            container.appendChild(tvShowsScreen);
            break;
        // Добавим остальные кейсы позже
    }
});

// Обработчик выбора фильма
document.addEventListener('movie-selected', (event) => {
    showMovieDetails(event.detail.movieId, event.detail.type);
});