import { useEffect } from "react";
import { useLocation } from "react-router-dom";


/**
 * ScrollToTop — служебный компонент, прокручивающий окно в начало страницы.
 *
 * @component
 * @returns {null}
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутка наверх после смены пути
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
