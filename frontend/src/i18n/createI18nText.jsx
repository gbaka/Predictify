import { Trans } from "react-i18next";
import TeX from "@matejmazur/react-katex";


/**
 * I18nTeX — обёртка для компонента <TeX /> из библиотеки @matejmazur/react-katex,
 * предназначена для использования внутри компонента <Trans /> из react-i18next.
 *
 * Приводит переданные дочерние элементы к строке, чтобы избежать ошибки
 * "KaTeX can only parse string typed expression".
 *
 * @component
 * @param {object} props
 * @param {React.ReactNode} props.children Дочерние элементы (формулы в KaTeX)
 * @returns {JSX.Element} Компонент с отрендеренной формулой KaTeX
 */
export function I18nTeX({ children }) {
  const content = Array.isArray(children)
    ? children.join("")
    : typeof children === "string"
    ? children
    : "";
  return <TeX>{content}</TeX>;
}


/**
 * createI18nText — функция, создающая компонент для интернационализированного текста с поддержкой HTML-тегов и KaTeX.
 *
 * Принимает namespace для переводов и возвращает компонент,
 * который рендерит перевод с ключом `textKey` и поддержкой кастомных CSS классов и ссылки.
 *
 * @param {string} ns Namespace для i18next.
 * @returns {function} Компонент с переведенным текстом.
 */
export default function createI18nText(ns) {
  return function I18nText({
    textKey,
    link = "#",
    pClass = "",
    dlClass = "",
    dtClass = "",
    ddClass = "",
    liClass = "",
    olClass = "",
    h3Class = "",
    spanClass = "",
    ...props
  }) {
    return (
      <Trans
        i18nKey={textKey}
        ns={ns}
        components={{
          br: <br />,
          strong: <strong />,
          em: <em />,
          u: <u />,
          a: <a href={link} className="underline text-blue-500" />,
          TeX: <I18nTeX />,
          p: <p className={pClass}/>,
          dl: <dl className={dlClass} />,
          dt: <dt className={dtClass} />,
          dd: <dd className={ddClass} />,
          li: <li className={liClass} />,
          ol: <ol className={olClass} />,
          h3: <h3 className={h3Class} />,
          span: <span className={spanClass} />
        }}
        {...props}
      />
    );
  };
}