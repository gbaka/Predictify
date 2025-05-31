import { Wrench, BarChart2, Cpu } from "lucide-react";


export default function Home() {
  return (
    <div className="mt-4 container mx-auto max-w-8xl p-6 px-8">
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Добро пожаловать в Predictify
        </h1>

        <p className="text-lg mb-11 text-center max-w-6xl mx-auto">
          Простой и удобный сервис для прогнозирования временных рядов и их визуализации. <br/>
          Predictify позволяет тестировать разные модели прогнозирования, 
          предоставляя интуитивно понятный интерфейс.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
         
          <div>
            <BarChart2 size={48} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-semibold mb-2">Визуализация данных</h2>
            <p>Визуализируйте результаты с помощью наглядных и интерактивных графиков.</p>
          </div>

          <div>
            <Cpu size={48} className="mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-semibold mb-2">Тестирование моделей</h2>
            <p>Проверяйте эффективность различных моделей и выбирайте лучшие.</p>
          </div>

           <div>
            <Wrench size={48} className="mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-semibold mb-2">Гибкие настройки</h2>
            <p>Настраивайте широкий набор параметров для моделей и графиков.</p>
          </div>
        </div>

          <p className="text-lg text-center max-w-6xl mx-auto mt-13">
          Для того, чтобы посмотреть примеры или попробовать самому &mdash; перейдите в раздел &laquo;Прогнозирование&raquo;.
        </p>
      </div>
    </div>
  );
}