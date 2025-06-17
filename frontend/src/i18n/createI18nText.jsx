import { Trans } from "react-i18next";
import TeX from "@matejmazur/react-katex";

/**
 * Компонент обёртка для <TeX /> из @matejmazur/react-katex,
 * предназначен для использования внутри <Trans />.
 * Приводит children к строке, чтобы избежать ошибки "KaTeX can only parse string typed expression".
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
 * Создаёт компонент перевода с поддержкой HTML-тегов и одиночной ссылки для заданного namespace.
 *
 * Пример:
 *   const I18nText = createI18nText('home');
 *   <I18nText textKey="welcome" link="https://example.com" />
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