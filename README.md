# Gulp Build

Эта Gulp-сборка предназначена для автоматизации процесса разработки. Она включает в себя компиляцию SCSS, минификацию JavaScript, оптимизацию изображений, работу с шрифтами, создание SVG-спрайтов.

## Особенности сборки:

- **Компиляция SCSS в CSS** с автопрефиксами.
- **Минификация JavaScript** с использованием Babel для поддержки старых браузеров.
- **Оптимизация изображений** (JPEG, PNG) с поддержкой форматов WebP и AVIF.
- **Автоматическая генерация SVG-спрайтов**.
- **Конвертация шрифтов** из формата TTF в WOFF2.
- **Кэширование** для ускорения повторных задач.
- **Live Reload** с помощью BrowserSync для автоматического обновления страницы при изменениях.

## Структура проекта:

```bash
/src
  /sass        — SCSS файлы для стилей
  /js          — JavaScript файлы
  /img         — Изображения (исходные и сжатые версии)
    /src       — Исходные изображения
    /icons     — SVG-иконки для генерации спрайтов
  /fonts       — Исходные шрифты (TTF)
  /components  — HTML-компоненты для включения
  /pages       — Основные страницы HTML
/dist          — Итоговая сборка для продакшн

## Основные команды:
npm start      — Запуск локального сервера и сборка для разработки.
npm run build  — Сборка проекта для продакшн.
npm run clear  — Очистка кэша Gulp.
