import { Wrench, BarChart2, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";
import createI18nText from "../i18n/createI18nText";

const I18nNamespace = "home";
const I18nText = createI18nText(I18nNamespace);

export default function Home() {
  useTranslation(I18nNamespace);

  return (
    <div className="mt-4 container mx-auto max-w-8xl p-6 px-8">
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          <I18nText textKey={"welcome"} />
        </h1>

        <p className="text-lg mb-11 text-center max-w-6xl mx-auto">
          <I18nText textKey={"descr"} />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
          <div>
            <BarChart2 size={48} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-semibold mb-2">
              <I18nText textKey={"vizualization.title"} />
            </h2>
            <p>
              <I18nText textKey={"vizualization.descr"} />
            </p>
          </div>

          <div>
            <Cpu size={48} className="mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-semibold mb-2">
              <I18nText textKey={"testing.title"} />
            </h2>
            <p>
              <I18nText textKey={"testing.descr"} />
            </p>
          </div>

          <div>
            <Wrench size={48} className="mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-semibold mb-2">
              <I18nText textKey={"settings.title"} />
            </h2>
            <p>
              <I18nText textKey={"settings.descr"} />
            </p>
          </div>
        </div>

        <p className="text-lg text-center max-w-6xl mx-auto mt-13">
          <I18nText textKey={"help"} />
        </p>
      </div>
    </div>
  );
}
