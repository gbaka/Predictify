import { useState, useEffect } from "react";
import ForecastTile from "./ForecastTile";
// import FullScreenForecast from "./FullScreenForecast";


export default function ForecastTiles({ theme }) {
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  const [forecasts, setForecasts] = useState([
    { title: "Загрузка...", x: [], y: [] },
    { title: "Загрузка...", x: [], y: [] },
    { title: "Загрузка...", x: [], y: [] },
    { title: "Загрузка...", x: [], y: [] },
  ]);

  // Эмуляция запроса к бэку
  useEffect(() => {
    // Это место можно будет заменить на реальный запрос к API
    setTimeout(() => {
      setForecasts([
        { title: "Прогноз 1", x: ["Янв", "Фев", "Мар"], y: [10, 20, 15] },
        { title: "Прогноз 2", x: ["Апр", "Май", "Июн"], y: [5, 25, 30] },
        { title: "Прогноз 3", x: ["Июл", "Авг", "Сен"], y: [12, 18, 22] },
        { title: "Прогноз 4", x: ["Окт", "Ноя", "Дек"], y: [8, 15, 19] },
      ]);
      setIsLoading(false);
    }, 2000); // 2 секунды задержки
  }, []);

  const handleTileClick = (forecast) => {
    setSelectedForecast(forecast);
  };

  const closeFullScreen = () => {
    setSelectedForecast(null);
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-4">
      {forecasts.map((forecast, index) => (
        <ForecastTile
          key={index}
          data={forecast}
          onClick={() => handleTileClick(forecast)}
          isLoading={isLoading}
          theme={theme}
        />
      ))}

      {/* {selectedForecast && (
        <FullScreenForecast data={selectedForecast} onClose={closeFullScreen} />
      )} */}
    </div>
  );
}
