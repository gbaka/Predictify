import FlexSearch from "flexsearch";

// Создаем индекс
const index = new FlexSearch.Document({
  document: {
    id: "id",          // Уникальный ID документа
    index: ["title", "content"], // Поля для поиска
    store: ["title", "path"] // Поля, которые будем сохранять
  },
  tokenize: "full", // Поиск по частям слов
  threshold: 1,      // Уровень нечеткого поиска (опечатки)
  resolution: 9        // Точность поиска
});

// Данные для поиска (страницы сайта)
const pages = [
  { id: 1, title: "Ъ", content: "Добро пожаловать на сайт прогнозирования", path: "/" },
  { id: 2, title: "Вики", content: "Справочник по методам прогнозирования", path: "/wiki" },
  { id: 3, title: "Прогнозирование", content: "Здесь можно загрузить данные и получить прогноз и много чего еще Ю", path: "/forecast" },
  { id: 4, title: "Ю", content: "Что-то здесь", path: "/biba" },
  { id: 5, title: "Юю", content: "Что-то здесь", path: "/biba" },
  { id: 6, title: "П", content: "Что-то здесь", path: "/biba" },
  { id: 7, title: "Щ", content: "Что-то здесь", path: "/biba" },
  { id: 8, title: "К", content: "Что-то здесь", path: "/biba" },
  { id: 9, title: "ЫЫ", content: "Что-то здесь Ы", path: "/biba" },
  { id: 10, title: "Пп", content: "Что-то здесь", path: "/biba" },
  // Добавь сюда другие страницы
];

// Добавляем страницы в индекс
pages.forEach(page => index.add(page));

export { index, pages };
