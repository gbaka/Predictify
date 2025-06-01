export default function Privacy() {
  return (
    <div className="container mt-3 mx-auto p-6 px-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-center">Политика конфиденциальности</h1>
      <p className="mt-4 text-lg text-center">
        Мы уважаем вашу конфиденциальность и стремимся быть максимально прозрачными в работе с данными.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">1. Какие данные мы собираем</h2>
        <p className="mt-4">
          Мы можем автоматически собирать минимальную техническую информацию (например, тип браузера, продолжительность сессии) для улучшения работы сервиса.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">2. Что мы не делаем</h2>
        <p className="mt-4">
          Мы не сохраняем загруженные вами файлы и не передаём ваши данные третьим лицам.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">3. Безопасность</h2>
        <p className="mt-4">
          Мы используем технические меры защиты, чтобы обеспечить безопасность при передаче и обработке данных.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">4. Изменения</h2>
        <p className="mt-4">
          При обновлении политики все изменения будут опубликованы на этой странице.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">5. Контакты</h2>
        <p className="mt-4">
          Если у вас есть вопросы, напишите нам:{" "}
          <a href="mailto:project.predictify@proton.me">
            project.predictify@proton.me
          </a>
        </p>
      </section>
    </div>
  );
}
