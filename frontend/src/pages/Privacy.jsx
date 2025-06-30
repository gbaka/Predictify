import { useTranslation } from "react-i18next";
import createI18nText from "../i18n/createI18nText";


const I18nNamespace = "privacy";
const I18nText = createI18nText(I18nNamespace);


/**
 * Privacy — страница политики конфиденциальности.
 * 
 * @component
 * @returns {JSX.Element} JSX элемент.
 */
export default function Privacy() {
  useTranslation(I18nNamespace);

  return (
    <>
      <title>Predictify | Privacy</title>

      <div className="container mt-3 mx-auto p-6 px-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-center">
          <I18nText textKey={"title"} />
        </h1>
        <p className="mt-4 text-lg text-center">
          <I18nText textKey={"descr"} />
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            <I18nText textKey={"section-1.title"} />
          </h2>
          <p className="mt-4">
            <I18nText textKey={"section-1.descr"} />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            <I18nText textKey={"section-2.title"} />
          </h2>
          <p className="mt-4">
            <I18nText textKey={"section-2.descr"} />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            <I18nText textKey={"section-3.title"} />
          </h2>
          <p className="mt-4">
            <I18nText textKey={"section-3.descr"} />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            <I18nText textKey={"section-4.title"} />
          </h2>
          <p className="mt-4">
            <I18nText textKey={"section-4.descr"} />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            <I18nText textKey={"section-5.title"} />
          </h2>
          <p className="mt-4">
            <I18nText
              textKey={"section-5.descr"}
              link="mailto:project.predictify@proton.me"
            />
          </p>
        </section>
      </div>
    </>
  );
}
