export default function Help() {
    return (
      <div className="container mx-auto p-6 px-8">
        <h1 className="text-4xl font-bold">Помощь</h1>
        <p className="mt-4 text-lg">
          Добро пожаловать в раздел помощи! Здесь вы найдете ответы на часто задаваемые вопросы и инструкции по использованию
          нашего сервиса.
        </p>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">1. Как зарегистрироваться?</h2>
          <p className="mt-4">
            Для регистрации на нашем сервисе просто нажмите на кнопку &quot;Зарегистрироваться&quot; на главной странице, введите свои
            данные и следуйте инструкциям на экране.
          </p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">2. Как загрузить данные?</h2>
          <p className="mt-4">
            Чтобы загрузить данные, перейдите на страницу &quot;Загрузка данных&quot;, выберите файл и нажмите кнопку &quot;Загрузить&quot;.
            Убедитесь, что файл соответствует формату, указанному в инструкциях на странице.
          </p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">3. Как настроить уведомления?</h2>
          <p className="mt-4">
            Уведомления можно настроить в разделе &quot;Настройки&quot;. Перейдите в этот раздел и включите необходимые уведомления для
            получения актуальной информации.
          </p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">4. Как получить помощь?</h2>
          <p className="mt-4">
            Если у вас возникли вопросы, вы можете обратиться в нашу службу поддержки, написав нам на адрес:
            <a href="mailto:support@example.com">support@example.com</a>. Мы ответим на ваш запрос в кратчайшие сроки.
          </p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">5. Часто задаваемые вопросы</h2>
          <p className="mt-4">
            Здесь вы найдете ответы на самые распространенные вопросы. Если ваш вопрос не был освещен в этом разделе,
            пожалуйста, свяжитесь с нами напрямую.
          </p>
        </section>
  
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">6. Обратная связь</h2>
          <p className="mt-4">
            Мы всегда рады услышать ваше мнение о нашем сервисе. Оставьте свои отзывы или предложения, отправив сообщение
            на адрес: <a href="mailto:feedback@example.com">feedback@example.com</a>.
          </p>
        </section>
      </div>
    );
  }
  