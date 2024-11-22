import { API_CONFIG } from '../config/api.js';

class TMDBService {
    // Получить популярные фильмы
    static async getPopularMovies(page = 1) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/movie/popular?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}&page=${page}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', data); // Добавим для отладки
            return data;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    }

    // Получить детали фильма
    static async getMovieDetails(movieId) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/movie/${movieId}?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    }

    // Поиск фильмов
    static async searchMovies(query) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/search/movie?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}&query=${encodeURIComponent(query)}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }

    // Получить актёрский состав фильма
    static async getMovieCredits(movieId) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/movie/${movieId}/credits?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie credits:', error);
            throw error;
        }
    }

    // Получить рекомендации для фильма
    static async getMovieRecommendations(movieId) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/movie/${movieId}/recommendations?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie recommendations:', error);
            throw error;
        }
    }

    // Получить полную информацию о фильме (детали + актёры + рекомендации)
    static async getFullMovieInfo(id, type = 'movie') {
        try {
            const [details, credits, recommendations] = await Promise.all([
                type === 'movie' ? this.getMovieDetails(id) : this.getTVDetails(id),
                type === 'movie' ? this.getMovieCredits(id) : this.getTVCredits(id),
                type === 'movie' ? this.getMovieRecommendations(id) : this.getTVRecommendations(id)
            ]);

            let seasons = [];
            if (type === 'tv') {
                seasons = await this.getTVSeasons(id);
            }

            const directors = credits.crew.filter(person => 
                type === 'movie' 
                    ? person.job === 'Director'
                    : person.job === 'Executive Producer'
            );

            const fullCast = [...directors, ...credits.cast];

            const result = {
                ...details,
                type,
                seasons,
                credits: {
                    cast: fullCast,
                    crew: credits.crew
                },
                recommendations: recommendations.results
            };
            
            console.log('Full result:', result); // Для отладки
            return result;
        } catch (error) {
            console.error('Error fetching full info:', error);
            throw error;
        }
    }

    static async searchMulti(query) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/search/multi?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}&query=${encodeURIComponent(query)}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching:', error);
            throw error;
        }
    }

    // Получить детали сериала
    static async getTVDetails(id) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/${id}?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            const data = await response.json();
            console.log('TV Details:', data); // Для отладки
            return data;
        } catch (error) {
            console.error('Error fetching TV details:', error);
            throw error;
        }
    }

    // Получить актёрский состав сериала
    static async getTVCredits(tvId) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/${tvId}/credits?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching TV credits:', error);
            throw error;
        }
    }

    // Получить рекомендации для сериала
    static async getTVRecommendations(tvId) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/${tvId}/recommendations?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching TV recommendations:', error);
            throw error;
        }
    }

    static async getTVSeasons(tvId) {
        try {
            const details = await this.getTVDetails(tvId);
            console.log('TV Details:', details);
            
            // Фильтруем специальные эпизоды (season_number === 0)
            const regularSeasons = details.seasons.filter(season => season.season_number > 0);
            
            // Получаем информацию о каждом сезоне с пагинацией
            const seasonsPromises = [];
            for (const season of regularSeasons) {
                const promise = fetch(
                    `${API_CONFIG.BASE_URL}/tv/${tvId}/season/${season.season_number}?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
                )
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                });
                seasonsPromises.push(promise);
            }

            const seasons = await Promise.all(seasonsPromises);
            console.log('Seasons data:', seasons);
            return seasons;
        } catch (error) {
            console.error('Error fetching TV seasons:', error);
            throw error;
        }
    }

    static async getTrendingMovies() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/trending/movie/day?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            throw error;
        }
    }

    static async getAnticipatedMovies() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/movie/upcoming?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching anticipated movies:', error);
            throw error;
        }
    }

    static async getTrendingTV() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/trending/tv/day?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching trending TV shows:', error);
            throw error;
        }
    }

    static async getAnticipatedTV() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/on_the_air?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching anticipated TV shows:', error);
            throw error;
        }
    }

    static async getPopularTV() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/popular?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching popular TV shows:', error);
            throw error;
        }
    }

    static async getAiringTodayTV() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/airing_today?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching airing today TV shows:', error);
            throw error;
        }
    }

    static async getTopRatedTV() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/top_rated?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching top rated TV shows:', error);
            throw error;
        }
    }    

    static async getOnTheAirTV() {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/tv/on_the_air?api_key=${API_CONFIG.API_KEY}&language=${API_CONFIG.LANGUAGE}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching on the air TV shows:', error);
            throw error;
        }
    }
}

export default TMDBService; 