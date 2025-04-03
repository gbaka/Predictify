import { useState, useEffect } from "react";
import ForecastTile from "./ForecastTile";
import FullscreenForecastTile from "./FullscreenForecastTile";



export default function ForecastTiles({ theme }) {
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  const [forecasts, setForecasts] = useState([
    { title: "Загрузка...", x: [], y: [] },
    { title: "Загрузка...", x: [], y: [] },
    { title: "Загрузка...", x: [], y: [] },
    { title: "Загрузка...", x: [], y: [] },
  ]);

  const arr = []
  for (let i = 0; i < 100; i++) {
    arr.push(i**3 - 3*i**2-i)
  }

  // Эмуляция запроса к бэку
  useEffect(() => {
    // Это место можно будет заменить на реальный запрос к API
    setTimeout(() => {
      setForecasts([
        { title: "Погода", x: arr, y: arr },
        { title: "Акции", x: ["Апр", "Май", "Июн",1,1,1,1,1,1,1], y: [5, 25, 30,1,1,1,2,2,2,2] },
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4">
      {forecasts.map((forecast, index) => (
        <ForecastTile
          key={index}
          data={forecast}
          onClick={() => handleTileClick(forecast)}
          isLoading={isLoading}
          theme={theme}
        />
      ))}

      {selectedForecast && (
        <FullscreenForecastTile
          data={selectedForecast}
          onClose={closeFullScreen}
          theme={theme}
        />
      )}

    </div>
  );
}
