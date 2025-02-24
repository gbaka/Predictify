import { useEffect, useRef } from 'react';


export default function Wiki() {
  const navRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (navRef.current && bgRef.current) {
        const navWidth = navRef.current.offsetWidth;
        bgRef.current.style.width = `${navWidth}px`;
      }
    };

    // Обновляем ширину при загрузке и изменении размера окна
    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Очистка
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div className="flex">
      {/* Фоновая панель (fixed, занимает всю высоту, с тенью) */}
      <div
        ref={bgRef}
        className="fixed left-0 top-0 h-full bg-gray-150 dark:bg-gray-900 shadow-sm z-0"
      />

      {/* Навигационная панель (sticky) */}
      <nav
        ref={navRef}
        className="sticky left-0 top-20 w-64 md:w-56 lg:w-72 h-full bg-gray-150 dark:bg-gray-900 p-4 z-10"
      >
        <ul className="space-y-2 w-full">
          <li className="w-full border-b border-gray-300 dark:border-gray-700 pb-2">
            <a href="#section1" className="block p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
              Раздел 1
            </a>
          </li>
          <li className="w-full border-b border-gray-300 dark:border-gray-700 pb-2">
            <a href="#section2" className="block p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
              Раздел 2
            </a>
          </li>
          <li className="w-full">
            <a href="#section3" className="block p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
              Раздел 3
            </a>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto p-6 px-8">
      <h1 className="text-3xl font-bold">Главная</h1>
      <p className="mt-4 text-gray-600">
        Здесь будет что-то.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat qui,
        quam maxime fugit dolores quibusdam a illum sint sunt porro delectus
        consectetur, labore soluta doloremque omnis! Saepe similique aliquid est
        ab neque voluptatum necessitatibus voluptatem deleniti provident atque
        adipisci officiis reiciendis quos dignissimos pariatur nemo vel sunt
        dolorum sapiente delectus eius unde, velit inventore ipsum! Id animi
        sunt voluptatem ratione corporis eaque, nobis vitae totam aspernatur
        quibusdam quo magni commodi! Commodi placeat repellendus illum incidunt
        obcaecati atque nam eum deserunt, suscipit optio eligendi accusamus
        possimus, odio neque ex quod, est adipisci animi vitae. Quisquam
        expedita commodi porro sit eum. Necessitatibus?
      </p>
    </div>

      {/* <section id="section1">
          <h2 className="text-xl font-bold">Раздел 1</h2>
          <p>Содержимое раздела 1...</p>
    </section> */}

      {/* Контейнер для основного контента */}
      {/* <main className="ml-64 md:ml-56 lg:ml-72 p-8 pl-4 text-left">
        <section id="section1">
          <h2 className="text-xl font-bold">Раздел 1</h2>
          <p>Содержимое раздела 1...</p>
        </section>
        <section id="section2" className="mt-10">
          <h2 className="text-xl font-bold">Раздел 2</h2>
          <p>Содержимое раздела 2...</p>
        </section>
        <section id="section3" className="mt-10">
          <h2 className="text-xl font-bold">Раздел 3</h2>
          <p>Содержимое раздела 3...</p>
        </section>
      </main> */}
    </div>
  );
}