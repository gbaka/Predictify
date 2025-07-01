import { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext();


/**
 * ThemeProvider — провайдер контекста темы, управляющий темами (светлой и темной) приложения.
 *
 * Хранит текущее состояние темы в `localStorage` и применяет соответствующие классы к `document.documentElement` и `document.body`.
 * Предоставляет метод `toggleTheme` и текущее значение темы через контекст.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children Дочерние элементы, которым будет доступен контекст темы
 * @returns {JSX.Element} Провайдер контекста темы
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.className = theme; // Устанавливаем класс 'light' или 'dark'
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


/**
 * useTheme — пользовательский хук для доступа к текущей теме и функции переключения темы.
 *
 * Используется внутри компонентов для получения значения темы (`dark` или `light`)
 * и вызова `toggleTheme` для её смены.
 *
 * @returns {{ theme: string, toggleTheme: () => void }} Объект с текущей темой и функцией переключения
 */
export function useTheme() {
  return useContext(ThemeContext);
}
