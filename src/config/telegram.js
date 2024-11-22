export const TG = window.Telegram.WebApp;

// Инициализация
TG.ready();

// Включаем главную кнопку
TG.MainButton.setParams({
    text: 'ОТКРЫТЬ ПРИЛОЖЕНИЕ',
    color: '#2481cc',
});

// Настраиваем тему
TG.setHeaderColor('#10131B');
TG.setBackgroundColor('#10131B');

export const initTelegram = () => {
    // Закрываем сплэш-скрин
    TG.closeSplashScreen();
    
    // Расширяем приложение на весь экран
    TG.expand();
}; 