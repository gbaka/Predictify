import FlexSearch from "flexsearch";

const homeContentRu = `
Добро пожаловать в Predictify
Простой и удобный сервис для прогнозирования временных рядов и их визуализации. Predictify позволяет тестировать разные модели прогнозирования, предоставляя интуитивно понятный интерфейс.
Визуализация данных
Визуализируйте результаты с помощью наглядных и интерактивных графиков.
Тестирование моделей
Проверяйте эффективность различных моделей и выбирайте лучшие.
Гибкие настройки
Настраивайте широкий набор параметров для моделей и графиков.
Для того, чтобы посмотреть примеры или попробовать самому — перейдите в раздел «Прогнозирование».
`.trim();

const homeContentEn = `
Welcome to Predictify
A simple and user-friendly service for time series forecasting and visualization. Predictify allows you to test various forecasting models through an intuitive interface.
Data Visualization
Visualize results with clear and interactive charts.
Model Testing
Evaluate the performance of different models and choose the best ones.
Flexible Settings
Adjust a wide range of parameters for models and charts.
To see examples or try it yourself — go to the «Forecasting» section.
`.trim();

const wikiContentRu = `
Линейные модели
Экспоненциальное сглаживание
Машинное обучение

Вики
В этом разделе собрана справочная информация о моделях прогнозирования временных рядов, используемых в Predictify.

Линейные модели
Линейные модели — класс моделей временных рядов, описывающих текущее значение ряда как линейную комбинацию его прошлых значений и случайных ошибок. Эти модели — основа классического прогнозирования временных рядов.

Автокорреляционная модель (AR)
Модель AR(p) выражает текущее значение ряда через сумму прошлых p значений:
Где: c — константа; ε_t — белый шум (случайная ошибка); φ_i — коэффициенты модели.

Модель скользящего среднего (MA)
Модель MA(q) описывает текущее значение ряда как сумму текущей и прошлых случайных ошибок:
Где: c — константа; ε_t — белый шум (случайная ошибка); θ_j — коэффициенты модели.

Модель ARMA
Модель ARMA(p,q) объединяет компоненты AR и MA:
Параметры аналогичны параметрам моделей AR и MA.

Модель ARIMA
ARIMA(p,d,q) включает дифференцирование порядка d для работы с нестационарными рядами:
Где: L — оператор лага; d — порядок дифференцирования; p, q — порядки AR и MA (аналогично ARMA); c, φ_i, θ_j, ε_t — константа, коэффициенты и белый шум (аналогично ARMA).

Модель SARIMA
SARIMA расширяет ARIMA, добавляя сезонные компоненты с порядками P, D, Q и сезонным периодом m:
Где: Φ_P, Θ_Q — сезонные коэффициенты AR и MA; P, D, Q — порядки сезонных AR, дифференцирования и MA; m — сезонный период; p, d, q, c, φ_i, θ_j, ε_t — аналогичные параметры ARIMA.

Экспоненциальное сглаживание
Экспоненциальное сглаживание — класс моделей, основанных на взвешенном усреднении прошлых наблюдений, где более свежие данные получают больший вес.

Simple Exponential Smoothing (SES)
В модели SES прогноз строится на основе единственного уравнения сглаживания уровня:
Где: α — коэффициент сглаживания уровня (0 ≤ α ≤ 1); y_{t-1} — наблюдаемое значение в предыдущий момент; ŷ_{t-1} — сглаженное значение уровня из прошлого шага.

Holt’s Exponential Smoothing (HES)
В модели HES добавляется линейный тренд. Используются две связи для уровня l_t и тренда b_t:
Где: α — коэффициент сглаживания уровня (0 ≤ α ≤ 1); β — коэффициент сглаживания тренда (0 ≤ β ≤ 1); y_t — текущее наблюдаемое значение; l_{t-1}, b_{t-1} — уровень и тренд из предыдущего шага; ŷ_{t+h} — прогноз на h шагов вперёд.

Holt-Winters Exponential Smoothing (HWES)
HWES включает сезонную компоненту. Рассмотрим аддитивный вариант (сезонные колебания добавляются к тренду и уровню):
Где: α, β — коэффициенты сглаживания уровня и тренда (аналогично HES); γ — коэффициент сглаживания сезонности (0 ≤ γ ≤ 1); m — длина сезонного периода (количество шагов в сезоне); y_t — текущее наблюдаемое значение; l_{t-1}, b_{t-1}, s_{t-m} — предыдущие значения уровня, тренда и сезонности; ŷ_{t+h} — прогноз на h шагов вперёд с учётом сезонного компонента.

Машинное обучение
Подходы машинного обучения позволяют выявлять сложные нелинейные зависимости во временных рядах и строить более точные прогнозы на основе различных признаков.

Основные этапы
Типичный ML-пайплайн включает:
1. Фиче-инжиниринг — преобразование ряда в табличный формат: лаговые значения, скользящие статистики, календарные признаки;
2. Разбиение данных — деление на тренировочный и валидационный наборы;
3. Обучение модели — поиск оптимальных гиперпараметров и обучение на тренировочных данных;
4. Оценка качества — проверка на валидационных данных и выбор лучшей конфигурации параметров модели.

Примеры алгоритмов
Ансамбли деревьев — Random Forest, XGBoost, LightGBM: настраиваются количество деревьев, глубина и скорость обучения;
Нейронные сети — RNN, LSTM, GRU: ключевые параметры — число слоёв, число нейронов, скорость обучения;
Линейные модели — Lasso, Ridge: регулируются коэффициенты регуляризации.
`.trim();

const wikiContentEn = `
Linear models
Exponential smoothing
Machine learning

Wiki
This section contains reference information about time series forecasting models used in Predictify.

Linear models
Linear models are a class of time series models that describe the current value of the series as a linear combination of its past values and random errors. These models are the basis of classical time series forecasting.

Autoregressive model (AR)
The AR(p) model expresses the current value of the series as the sum of the past p values:
Where: c — constant; ε_t — white noise (random error); φ_i — model coefficients.

Moving average model (MA)
The MA(q) model describes the current value of the series as the sum of current and past random errors:
Where: c — constant; ε_t — white noise (random error); θ_j — model coefficients;

ARMA model
The ARMA(p,q) model combines AR and MA components:
Parameters are similar to AR and MA models.

ARIMA model
ARIMA(p,d,q) includes differencing of order d to handle non-stationary series:
Where: L — lag operator; d — order of differencing; p, q — orders of AR and MA (similar to ARMA); c, φ_i, θ_j, ε_t — constant, coefficients, and white noise (similar to ARMA).

SARIMA model
SARIMA extends ARIMA by adding seasonal components with orders P, D, Q and seasonal period m:
Where: Φ_P, Θ_Q — seasonal AR and MA coefficients; P, D, Q — orders of seasonal AR, differencing, and MA; m — seasonal period; p, d, q, c, φ_i, θ_j, ε_t — parameters similar to ARIMA.

Exponential smoothing
Exponential smoothing is a class of models based on weighted averaging of past observations where more recent data receive greater weight.

Simple Exponential Smoothing (SES)
The SES model builds the forecast based on a single level smoothing equation:
Where: α — level smoothing coefficient (0 ≤ α ≤ 1); y_{t-1} — observed value at previous time; ŷ_{t-1} — smoothed level value from previous step.

Holt’s Exponential Smoothing (HES)
The HES model adds a linear trend. Two equations are used for level l_t and trend b_t:
Where: α — level smoothing coefficient (0 ≤ α ≤ 1); β — trend smoothing coefficient (0 ≤ β ≤ 1); y_t — current observed value; l_{t-1}, b_{t-1} — level and trend from previous step; ŷ_{t+h} — forecast h steps ahead.

Holt-Winters Exponential Smoothing (HWES)
HWES includes a seasonal component. Consider the additive version (seasonal fluctuations are added to trend and level):
Where: α, β — smoothing coefficients for level and trend (similar to HES); γ — seasonal smoothing coefficient (0 ≤ γ ≤ 1); m — length of seasonal period (number of steps in season); y_t — current observed value; l_{t-1}, b_{t-1}, s_{t-m} — previous values of level, trend and seasonality; ŷ_{t+h} — forecast h steps ahead including seasonal component.

Machine learning
Machine learning approaches allow detecting complex nonlinear dependencies in time series and building more accurate forecasts based on various features.

Main stages
Typical ML pipeline includes:
Feature engineering — transforming the series into tabular format: lag values, rolling statistics, calendar features;
Data splitting — dividing into training and validation sets;
Model training — hyperparameter tuning and training on training data;
Quality evaluation — validation checking and selection of the best model configuration.

Algorithm examples
Tree ensembles — Random Forest, XGBoost, LightGBM: tuned by number of trees, depth and learning rate;
Neural networks — RNN, LSTM, GRU: key parameters — number of layers, number of neurons, learning rate;
Linear models — Lasso, Ridge: regularization coefficients are tuned.
`.trim();

const forecastingContentRu = `
Примеры
Здесь вы можете увидеть, как выглядят прогнозы, созданные в Predictify. Прогнозы построены посредством разных моделей и основаны на данных, взятых с открытых API.
Мы уделяем особое внимание безопасности ваших данных. Мы не сохраняем загруженные файлы и не передаём их третьим лицам.

Прогнозирование
Здесь вы можете построить прогноз временного ряда на основе собственных данных. Загрузите данные в формате Excel или CSV, выберите модель и настройте ее параметры, после этого нажмите кнопку «Начать».
Мы уделяем особое внимание безопасности ваших данных. Мы не сохраняем загруженные файлы и не передаём их третьим лицам.
`.trim();

const forecastingContentEn = `
Examples
Here you can see how forecasts created in Predictify look like. Forecasts are built using different models and based on data taken from open APIs.
We pay special attention to the security of your data. We do not store uploaded files or share them with third parties.

Forecasting
Here you can build a time series forecast based on your own data. Upload data in Excel or CSV format, select a model and adjust its parameters, then click the 'Start' button.
We pay special attention to the security of your data. We do not store uploaded files or share them with third parties.
`.trim();

const privacyContentRu = `
Политика конфиденциальности

Мы уважаем вашу конфиденциальность и стремимся быть максимально прозрачными в работе с данными.

1. Какие данные мы собираем
Мы можем автоматически собирать минимальную техническую информацию (например, тип браузера, продолжительность сессии) для улучшения работы сервиса.

2. Что мы не делаем
Мы не сохраняем загруженные вами файлы и не передаём ваши данные третьим лицам.

3. Безопасность
Мы используем технические меры защиты, чтобы обеспечить безопасность при передаче и обработке данных.

4. Изменения
При обновлении политики все изменения будут опубликованы на этой странице.

5. Контакты
Если у вас есть вопросы, напишите нам: <a href="mailto:project.predictify@proton.me">project.predictify@proton.me</a>.
`.trim();

const privacyContentEn = `
Privacy Policy

We respect your privacy and are committed to being as transparent as possible in how we handle data.

1. What data we collect
We may automatically collect minimal technical information (such as browser type and session duration) to improve the service.

2. What we don’t do
We do not store the files you upload or share your data with third parties.

3. Security
We use technical safeguards to ensure the security of data during transmission and processing.

4. Changes
Any updates to the policy will be published on this page.

5. Contact
If you have any questions, feel free to contact us: <a href="mailto:project.predictify@proton.me">project.predictify@proton.me</a>.
`.trim();

const helpContentRu = `
Помощь

Здесь вы найдете краткую инструкцию по загрузке данных и использованию сервиса прогнозирования.

1. Поддерживаемые форматы
Вы можете загружать файлы в формате <strong>CSV</strong> или <strong>Excel (.xlsx/.xls)</strong>. Файл должен иметь размер до <strong>10 МБ</strong>.

2. Требования к структуре данных
Для построения прогноза необходимо, чтобы данные содержали хотя бы один числовой столбец — <strong>endog</strong> (значения временного ряда). Для разметки данных по времени в файле может находится столбец с датами — <strong>date</strong>, но его наличие необязательно. Строка заголовков (названия столбцов) тажке необязательно должна присутствовать в файле.

3. Как загрузить данные
Для загрузки данных, перейдите на вкладку <strong>«Попробовать»</strong> раздела <strong>«Прогнозирование»</strong>, далее перетащите нужный файл в Drag'n'drop поле (или кликните по нему и выберите файл в Проводнике).

4. Контакты
Если вы столкнулись с проблемой или у вас есть вопрос, напишите нам на <a href="mailto:project.predictify@proton.me">project.predictify@proton.me</a>. <br /> Мы поможем вам в кратчайшие сроки.
`.trim();

const helpContentEn = `
Help

Here you will find a brief guide on how to upload your data and use the forecasting service.

1. Supported formats
You can upload files in <strong>CSV</strong> or <strong>Excel (.xlsx/.xls)</strong> format. The file size must not exceed <strong>10 MB</strong>.

2. Data structure requirements
To build a forecast, the data must contain at least one numerical column — <strong>endog</strong> (time series values). To associate data with time, a column with dates — <strong>date</strong> — can be included, but it is optional. A header row (with column names) is also optional.

3. How to upload data
To upload your data, go to the <strong>“Try it”</strong> tab in the <strong>“Forecasting”</strong> section, then drag and drop your file into the upload area (or click it and choose a file from your computer).

4. Contact
If you encounter a problem or have a question, write to us at <a href="mailto:project.predictify@proton.me">project.predictify@proton.me</a>. <br /> We’ll get back to you as soon as possible.
`.trim();


// Поисковый индекс
const index = new FlexSearch.Document({
  document: {
    id: "id", // Уникальный ID документа
    index: ["title", "content"], // Поля для поиска
    store: ["title", "path"], // Поля, которые будем сохранять
  },
  tokenize: "full", // Поиск по частям слов
  threshold: 1, // Уровень нечеткого поиска (опечатки)
  resolution: 9, // Точность поиска
});

// Данные для поиска (страницы сайта)
const pages = [
  {
    id: 1,
    title: "Главная",
    content: homeContentRu,
    path: "/",
  },
  {
    id: 2,
    title: "Home",
    content: homeContentEn,
    path: "/",
  },
  {
    id: 3,
    title: "Вики",
    content: wikiContentRu,
    path: "/wiki",
  },
  {
    id: 4,
    title: "Wiki",
    content: wikiContentEn,
    path: "/wiki",
  },
  {
    id: 5,
    title: "Прогнозирование",
    content: forecastingContentRu,
    path: "/forecast",
  },
  {
    id: 6,
    title: "Forecasting",
    content: forecastingContentEn,
    path: "/forecast",
  },
  {
    id: 7,
    title: "Политика Конфиденциальности",
    content: privacyContentRu,
    path: "/privacy",
  },
  {
    id: 8,
    title: "Privacy Policy",
    content: privacyContentEn,
    path: "/privacy",
  },
  {
    id: 9,
    title: "Помощь",
    content: helpContentRu,
    path: "/help",
  },
  {
    id: 10,
    title: "Help",
    content: helpContentEn,
    path: "/help",
  },
];

// Добавляем страницы в индекс
pages.forEach((page) => index.add(page));

export { index, pages };
