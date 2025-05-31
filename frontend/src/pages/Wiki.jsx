import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

export default function Wiki() {
  const navRef = useRef(null);
  const bgRef = useRef(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const updateWidth = () => {
      if (navRef.current && bgRef.current) {
        const navWidth = navRef.current.offsetWidth;
        bgRef.current.style.width = `${navWidth}px`;
      }
    };

    // Обновляем ширину при загрузке и изменении размера окна
    updateWidth();
    window.addEventListener("resize", updateWidth);

    // Очистка
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="flex">
      {/* Фоновая панель */}
      <div
        ref={bgRef}
        className={`fixed hidden md:block left-0 top-0 h-full shadow-sm z-0 ${
          theme === "dark"
            ? "bg-gray-850 text-white"
            : "bg-gray-150 text-gray-800"
        } `}
      />

      {/* Навигационная панель (sticky) */}
      <nav
        ref={navRef}
        className={`sticky hidden md:block left-0 top-20 w-64 md:w-56 lg:w-72 h-full p-4 z-10 ${
          theme === "dark"
            ? "bg-gray-850 text-white"
            : "bg-gray-150 text-gray-800"
        } `}
      >
        <ul className="space-y-2 w-full">
          <li
            className={`w-full border-b pb-2 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } `}
          >
            <a
              href="#section1"
              className={`block p-2 rounded-lg ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
              } `}
            >
              Линейные модели
            </a>
          </li>
          <li
            className={`w-full border-b pb-2 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } `}
          >
            <a
              href="#section2"
              className={`block p-2 rounded-lg ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
              } `}
            >
              Экспоненциальное сглаживание
            </a>
          </li>
          <li
            className={`w-full border-b pb-2 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } `}
          >
            <a
              href="#section3"
              className={`block p-2 rounded-lg ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
              } `}
            >
              Машинное обучение
            </a>
          </li>
        </ul>
      </nav>

      {/* <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">  */}
      <div className="container mt-3 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 p-6 px-8">
        <h1 id="main" className="text-3xl font-bold text-center">
          Вики
        </h1>
        <p className="mt-4 text-center">
          В этом разделе собрана справочная информация о моделях прогнозирования
          временных рядов, используемых в Predictify.
        </p>

        <section id="section1" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Линейные модели</h2>

          <p className="mb-6">
            Линейные модели — класс моделей временных рядов, описывающих текущее
            значение ряда как линейную комбинацию его прошлых значений и
            случайных ошибок. Эти модели — основа классического прогнозирования
            временных рядов.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Автокорреляционная модель (AR)
          </h3>
          <p className="mb-3">
            Модель AR(p) выражает текущее значение ряда через сумму прошлых{" "}
            <TeX math={`p`} /> значений:
          </p>
          <TeX
            math={`X_t = c + \\varepsilon_t + \\sum_{i=1}^p \\phi_i X_{t-i} `}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`c`} />
            </dt>
            <dd className="inline">&nbsp;&mdash;&nbsp;константа;</dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\varepsilon_t`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;белый шум (случайная ошибка);
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\phi_i`} />
            </dt>
            <dd className="inline">&nbsp;&mdash;&nbsp;коэффициенты модели.</dd>
          </dl>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Модель скользящего среднего (MA)
          </h3>
          <p className="mb-3">
            Модель MA(q) описывает текущее значение ряда как сумму текущей и
            прошлых случайных ошибок:
          </p>
          <TeX
            math={`X_t = c + \\varepsilon_t + \\sum_{j=1}^q \\theta_j \\varepsilon_{t-j}`}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`c`} />
            </dt>
            <dd className="inline">&nbsp;&mdash;&nbsp;константа.</dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\varepsilon_t`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;белый шум (случайная ошибка);
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\theta_j`} />
            </dt>
            <dd className="inline">&nbsp;&mdash;&nbsp;коэффициенты модели;</dd>
          </dl>

          <h3 className="text-xl font-semibold mt-6 mb-2">Модель ARMA</h3>
          <p className="mb-3">
            Модель ARMA(p,q) объединяет компоненты AR и MA:
          </p>
          <TeX
            math={`X_t = c + \\sum_{i=1}^p \\phi_i X_{t-i} + \\varepsilon_t + \\sum_{j=1}^q \\theta_j \\varepsilon_{t-j}`}
            block
            className="mb-3"
          />
          <p className="mb-4">
            Параметры аналогичны параметрам моделей AR и MA.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Модель ARIMA</h3>
          <p className="mb-3">
            ARIMA(p,d,q) включает дифференцирование порядка <TeX math={`d`} />{" "}
            для работы с нестационарными рядами:
          </p>
          <TeX
            math={`(1 - \\sum_{i=1}^p \\phi_i L^i)(1 - L)^d X_t = c + (1 + \\sum_{j=1}^q \\theta_j L^j) \\varepsilon_t`}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`L`} />
            </dt>
            <dd className="inline">&nbsp;&mdash;&nbsp;оператор лага;</dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`d`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;порядок дифференцирования;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`p, q`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;порядки AR и MA (аналогично ARMA);
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`c`} />, <TeX math={`\\phi_i`} />,{" "}
              <TeX math={`\\theta_j`} />, <TeX math={`\\varepsilon_t`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;константа, коэффициенты и белый шум (аналогично
              ARMA).
            </dd>
          </dl>

          <h3 className="text-xl font-semibold mt-6 mb-2">Модель SARIMA</h3>
          <p className="mb-3">
            SARIMA расширяет ARIMA, добавляя сезонные компоненты с порядками{" "}
            <TeX math={`P, D, Q`} /> и сезонным периодом <TeX math={`m`} />:
          </p>
          <TeX
            math={`
              \\Phi_P(L^m)\\,\\phi_p(L)\\,(1 - L)^d\\,(1 - L^m)^D X_t = c + \\Theta_Q(L^m)\\,\\theta_q(L)\\,\\varepsilon_t
            `}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`\\Phi_P, \\Theta_Q`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;сезонные коэффициенты AR и MA;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`P, D, Q`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;порядки сезонных AR, дифференцирования и MA;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`m`} />
            </dt>
            <dd className="inline">&nbsp;&mdash;&nbsp;сезонный период;</dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`p, d, q`} />,{" "}
              <TeX math={`c, \\phi_i, \\theta_j, \\varepsilon_t`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;аналогичные параметры ARIMA.
            </dd>
          </dl>
        </section>

        <section id="section2" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Экспоненциальное сглаживание
          </h2>

          <p className="mb-6">
            Экспоненциальное сглаживание — класс моделей, основанных на
            взвешенном усреднении прошлых наблюдений, где более свежие данные
            получают больший вес.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Simple Exponential Smoothing (SES)
          </h3>
          <p className="mb-3">
            В модели SES прогноз строится на основе единственного уравнения
            сглаживания уровня:
          </p>
          <TeX
            math={`\\hat{y}_t = \\alpha y_{t-1} + (1 - \\alpha) \\hat{y}_{t-1}`}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`\\alpha`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;коэффициент сглаживания уровня (
              <TeX math={`0 < \\alpha \\le 1`} />
              );
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`y_{t-1}`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;наблюдаемое значение в предыдущий момент;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\hat{y}_{t-1}`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;сглаженное значение уровня из прошлого шага.
            </dd>
          </dl>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Holt’s Exponential Smoothing (HES)
          </h3>
          <p className="mb-3">
            В модели HES добавляется линейный тренд. Используются две связи для
            уровня <TeX math={`l_t`} /> и тренда <TeX math={`b_t`} />:
          </p>
          <TeX
            math={`
              \\begin{cases}
                l_t = \\alpha y_t + (1 - \\alpha)(l_{t-1} + b_{t-1}), \\\\
                b_t = \\beta (l_t - l_{t-1}) + (1 - \\beta) b_{t-1}, \\\\
                \\hat{y}_{t+h} = l_t + h b_t
              \\end{cases}
            `}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`\\alpha`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;коэффициент сглаживания уровня (
              <TeX math={`0 < \\alpha \\le 1`} />
              );
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\beta`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;коэффициент сглаживания тренда (
              <TeX math={`0 < \\beta \\le 1`} />
              );
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`y_t`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;текущее наблюдаемое значение;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`l_{t-1}`} />, <TeX math={`b_{t-1}`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;уровень и тренд из предыдущего шага;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\hat{y}_{t+h}`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;прогноз на <TeX math={`h`} /> шагов вперёд.
            </dd>
          </dl>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Holt-Winters Exponential Smoothing (HWES)
          </h3>
          <p className="mb-3">
            HWES включает сезонную компоненту. Рассмотрим аддитивный вариант
            (сезонные колебания добавляются к тренду и уровню):
          </p>
          <TeX
            math={`
      \\begin{cases}
        l_t = \\alpha \\bigl(y_t - s_{t-m}\\bigr) + (1 - \\alpha) (l_{t-1} + b_{t-1}), \\\\
        b_t = \\beta \\bigl(l_t - l_{t-1}\\bigr) + (1 - \\beta) b_{t-1}, \\\\
        s_t = \\gamma \\bigl(y_t - l_t\\bigr) + (1 - \\gamma) s_{t-m}, \\\\
        \\hat{y}_{t+h} = l_t + h b_t + s_{t-m + (h \\bmod m)}
      \\end{cases}
    `}
            block
            className="mb-3"
          />
          <p>Где:</p>
          <dl className="ml-6">
            <dt className="inline font-mono">
              <TeX math={`\\alpha`} />, <TeX math={`\\beta`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;коэффициенты сглаживания уровня и тренда
              (аналогично HES);
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\gamma`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;коэффициент сглаживания сезонности (
              <TeX math={`0 < \\gamma \\le 1`} />
              );
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`m`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;длина сезонного периода (количество шагов в
              сезоне);
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`y_t`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;текущее наблюдаемое значение;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`l_{t-1}`} />, <TeX math={`b_{t-1}`} />,{" "}
              <TeX math={`s_{t-m}`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;предыдущие значения уровня, тренда и
              сезонности;
            </dd>
            <br />
            <dt className="inline font-mono">
              <TeX math={`\\hat{y}_{t+h}`} />
            </dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;прогноз на <TeX math={`h`} /> шагов вперёд с
              учётом сезонного компонента.
            </dd>
          </dl>
        </section>
        <section id="section3" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Машинное обучение</h2>

          <p className="mb-6">
            Подходы машинного обучения позволяют выявлять сложные нелинейные
            зависимости во временных рядах и строить более точные прогнозы на
            основе различных признаков.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Основные этапы</h3>
          <p className="mb-2">Типичный ML-пайплайн включает:</p>
          <ol className="ml-6 mb-6 list-decimal list-inside">
            <li>
              <span className="font-mono">Фиче-инжиниринг</span>
              &nbsp;&mdash;&nbsp;преобразование ряда в табличный формат: лаговые
              значения, скользящие статистики, календарные признаки;
            </li>
            <li className="mt-2">
              <span className="font-mono">Разбиение данных</span>
              &nbsp;&mdash;&nbsp;деление на тренировочный и валидационный
              наборы;
            </li>
            <li className="mt-2">
              <span className="font-mono">Обучение модели</span>
              &nbsp;&mdash;&nbsp;поиск оптимальных гиперпараметров и обучение на
              тренировочных данных;
            </li>
            <li className="mt-2">
              <span className="font-mono">Оценка качества</span>
              &nbsp;&mdash;&nbsp;проверка на валидационных данных и выбор лучшей
              конфигурации параметров модели.
            </li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Примеры алгоритмов
          </h3>
          <dl className="ml-6 mb-6">
            <dt className="inline font-mono">Ансамбли деревьев</dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;Random Forest, XGBoost, LightGBM: настраиваются
              количество деревьев, глубина и скорость обучения;
            </dd>
            <br />
            <dt className="inline font-mono">Нейронные сети</dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;RNN, LSTM, GRU: ключевые параметры — число
              слоёв, число нейронов, скорость обучения;
            </dd>
            <br />
            <dt className="inline font-mono">Линейные модели</dt>
            <dd className="inline">
              &nbsp;&mdash;&nbsp;Lasso, Ridge: регулируются коэффициенты
              регуляризации.
            </dd>
          </dl>
        </section>
      </div>
    </div>
  );
}
