import { useState } from "react";
import axios from "axios";


export default function Home() {
  const [data, setData] = useState(null);
  const [param, setParam] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/test", {
        params: { query: param }, // передаем параметр "query"
      });
      setData(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных", error);
    }
  };

  return (
    <div className="mt-3 container mx-auto p-6 px-8">
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
        <h1 className="text-3xl font-bold text-center">Главная</h1>
        <p className="mt-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit...
        </p>
        <div className="mt-6 text-center">
          <input
            type="text"
            value={param}
            onChange={(e) => setParam(e.target.value)}
            placeholder="Введите параметр"
            className="border px-3 py-2 rounded mr-2"
          />
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Загрузить данные
          </button>
        </div>
        {data && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-semibold">Полученные данные:</h2>
            <pre className="mt-2 text-sm text-gray-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
