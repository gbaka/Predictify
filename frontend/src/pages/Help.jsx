export default function Help() {
  return (
    <div className="container mt-3 mx-auto p-6 px-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-center">Помощь</h1>
      <p className="mt-4 text-lg text-center">
        Здесь вы найдете краткую инструкцию по загрузке данных и использованию сервиса прогнозирования.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">1. Поддерживаемые форматы</h2>
        <p className="mt-4">
          Вы можете загружать файлы в формате <strong>CSV</strong> или <strong>Excel (.xlsx/.xls)</strong>. Файл должен иметь размер до <strong>10 МБ</strong>.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">2. Требования к структуре данных</h2>
        <p className="mt-4">
          Для построения прогноза необходимо, чтобы данные содержали хотя бы один числовой столбец — <strong>endog</strong> (значения временного ряда).  
          Для разметки данных по времени в файле может находится столбец с датами — <strong>date</strong>, но его наличие необязательно.
          Строка заголовков (названия столбцов) тажке необязательно должна присутствовать в файле.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">3. Как загрузить данные</h2>
        <p className="mt-4">
          Для загрузки данных, перейдите на вкладку <strong>&laquo;Попробовать&raquo;</strong> раздела <strong>&laquo;Прогнозирование&raquo;</strong>, далее перетащите нужный файл в Drag&apos;n&apos;drop поле (или кликните по нему и выберите файл в Проводнике).
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">4. Контакты</h2>
        <p className="mt-4">
          Если вы столкнулись с проблемой или у вас есть вопрос, напишите нам на{" "}
          <a href="mailto:project.predictify@proton.me">
            project.predictify@proton.me
          </a>. Мы поможем вам в кратчайшие сроки.
        </p>
      </section>
    </div>
  );
}
