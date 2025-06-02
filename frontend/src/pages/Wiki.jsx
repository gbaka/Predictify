import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import createI18nText from "../i18n/createI18nText";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

const I18nNamespace = "wiki";
const I18nText = createI18nText(I18nNamespace);

export default function Wiki() {
  useTranslation(I18nNamespace);
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

      {/* Навигационная панель */}
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
              <I18nText textKey="nav-section-1" />
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
              <I18nText textKey="nav-section-2" />
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
              <I18nText textKey="nav-section-3" />
            </a>
          </li>
        </ul>
      </nav>

      <div className="container mt-3 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 p-6 px-8">
        <h1 id="main" className="text-3xl font-bold text-center">
          <I18nText textKey="title" />
        </h1>
        <p className="mt-4 text-center">
          <I18nText textKey="descr" />
        </p>

        <section id="section1" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            <I18nText textKey="section-1.title" />
          </h2>
          <p className="mb-6">
            <I18nText textKey="section-1.descr" />
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey={"section-1.1.title"} />
          </h3>
          <p className="mb-3">
            <I18nText textKey={"section-1.1.descr"} />
          </p>
          <TeX
            math={`X_t = c + \\varepsilon_t + \\sum_{i=1}^p \\phi_i X_{t-i} `}
            block
            className="mb-3"
          />
          <I18nText
            textKey={"section-1.1.notation"}
            dlClass={"ml-6"}
            dtClass="inline font-mono"
            ddClass="inline"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey={"section-1.2.title"} />
          </h3>
          <p className="mb-3">
            <I18nText textKey={"section-1.2.descr"} />
          </p>
          <TeX
            math={`X_t = c + \\varepsilon_t + \\sum_{j=1}^q \\theta_j \\varepsilon_{t-j}`}
            block
            className="mb-3"
          />
          <I18nText
            textKey={"section-1.2.notation"}
            dlClass={"ml-6"}
            dtClass="inline font-mono"
            ddClass="inline"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey={"section-1.3.title"} />
          </h3>
          <p className="mb-3">
            <I18nText textKey={"section-1.3.descr"} />
          </p>
          <TeX
            math={`X_t = c + \\sum_{i=1}^p \\phi_i X_{t-i} + \\varepsilon_t + \\sum_{j=1}^q \\theta_j \\varepsilon_{t-j}`}
            block
            className="mb-3"
          />
          <p className="mb-4">
            <I18nText textKey={"section-1.3.notation"} />
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey={"section-1.4.title"} />
          </h3>
          <p className="mb-3">
            <I18nText textKey={"section-1.4.descr"} />
          </p>
          <TeX
            math={`(1 - \\sum_{i=1}^p \\phi_i L^i)(1 - L)^d X_t = c + (1 + \\sum_{j=1}^q \\theta_j L^j) \\varepsilon_t`}
            block
            className="mb-3"
          />
          <I18nText
            textKey={"section-1.4.notation"}
            dlClass={"ml-6"}
            dtClass="inline font-mono"
            ddClass="inline"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey={"section-1.5.title"} />
          </h3>
          <p className="mb-3">
            <I18nText textKey={"section-1.5.descr"} />
          </p>
          <TeX
            math={`
              \\Phi_P(L^m)\\,\\phi_p(L)\\,(1 - L)^d\\,(1 - L^m)^D X_t = c + \\Theta_Q(L^m)\\,\\theta_q(L)\\,\\varepsilon_t
            `}
            block
            className="mb-3"
          />
          <I18nText
            textKey={"section-1.5.notation"}
            dlClass={"ml-6"}
            dtClass="inline font-mono"
            ddClass="inline"
          />
        </section>

        <section id="section2" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            <I18nText textKey="section-2.title" />
          </h2>
          <p className="mb-6">
            <I18nText textKey="section-2.descr" />
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey={"section-2.1.title"} />
          </h3>
          <p className="mb-3">
            <I18nText textKey={"section-2.1.descr"} />
          </p>
          <TeX
            math={`\\hat{y}_t = \\alpha y_{t-1} + (1 - \\alpha) \\hat{y}_{t-1}`}
            block
            className="mb-3"
          />
          <I18nText
            textKey="section-2.1.notation"
            dlClass="ml-6"
            dtClass="inline font-mono"
            ddClass="inline"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey="section-2.2.title" />
          </h3>
          <p className="mb-3">
            <I18nText textKey="section-2.2.descr" />
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
          <I18nText
            textKey="section-2.2.notation"
            dlClass="ml-6"
            dtClass="inline font-mono"
            ddClass="inline"
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">
            <I18nText textKey="section-2.3.title" />
          </h3>
          <p className="mb-3">
            <I18nText textKey="section-2.3.descr" />
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
          <I18nText
            textKey="section-2.3.notation"
            dlClass="ml-6"
            dtClass="inline font-mono"
            ddClass="inline"
          />
        </section>
        
        <section id="section3" className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            <I18nText textKey={"section-3.title"} />
          </h2>
          <p className="mb-6">
            <I18nText textKey={"section-3.descr"} />
          </p>
          <I18nText
            textKey="section-3.notation"
            h3Class="text-xl font-semibold mt-6 mb-2"
            olClass="ml-6 mb-6 list-decimal list-inside"
            liClass="mt-2"
          />
          <I18nText
            textKey="section-3.examples"
            h3Class="text-xl font-semibold mt-6 mb-2"
            dlClass="ml-6 mb-6"
            dtClass="inline"
            ddClass="inline"
          />
        </section>
      </div>
    </div>
  );
}
