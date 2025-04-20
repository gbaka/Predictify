import { useState, useEffect } from "react";
import axios from "axios"

import ForecastTile from "./ForecastTile";
import FullscreenForecastTile from "./FullscreenForecastTile";
import { API_CONFIG } from "../../api/apiConfig";


export default function ForecastTiles({ theme }) {
  const [selectedData, setSelectedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({});
  const [error, setError] = useState(null);

  // Базовый шаблон для mappingTable с описанием характеристик парсеров
  const baseMappingTable = {
    weather_forecast: {
      title: "Погода",
      parserInfo: {
        status: "online",
        source: "Open Meteo API",
        updateInterval: "15 мин",
        model: "ARIMA(1,0,0)",
        lastUpdate: null,
        dataPoints: 0,
        details: "Температура воздуха в точке 55.7558 37.6176 (Над УЛК)"
      } 
    },
    test_forecast: {
      title: "Тест",
      parserInfo: {
        status: "online",
        source: "Test API",
        updateInterval: "30 мин",
        model: "ARIMA(1,1,0)",
        lastUpdate: null,
        dataPoints: 0,
        details: "Тест тест тест"
      } 
    }
  };

  // Динамически формируемый mappingTable на основе apiData
  const getMappingTable = () => {
    const updatedMapping = {...baseMappingTable};
    
    Object.keys(apiData).forEach(tableName => {
      if (updatedMapping[tableName]) {
        updatedMapping[tableName].parserInfo = {
          ...updatedMapping[tableName].parserInfo,
          lastUpdate: apiData[tableName]?.last_update || null,
          dataPoints: apiData[tableName]?.full_dates?.length || 0,
          // status: apiData[tableName] ? "online" : "offline"
        };
      } else {
        // Автоматическое добавление новых таблиц
        updatedMapping[tableName] = {
          title: tableName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          parserInfo: {
            status: "online",
            source: "Unknown API",
            updateInterval: "N/A",
            lastUpdate: apiData[tableName]?.last_update || null,
            dataPoints: apiData[tableName]?.full_dates?.length || 0
          }
        };
      }
    });
    
    return updatedMapping;
  };

  // Текущее состояние mappingTable
  const mappingTable = getMappingTable();

  const fetchForecasts = async () => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/${API_CONFIG.FORECAST_FROM_PARSERS_ENDPOINT}`
      );
      setApiData(response.data);
      setIsLoading(false);
      setError(null);
      console.log("Pooling")
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      
      // Обновляем статусы при ошибке
      Object.keys(mappingTable).forEach(tableName => {
        mappingTable[tableName].parserInfo.status = "offline";
      });
    }
  };

  // Периодический пуллинг
  useEffect(() => {
    fetchForecasts();
    const interval = setInterval(fetchForecasts, 5*60*1000);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = (tableName) => {
    if (!isLoading && apiData[tableName]) {
      setSelectedData({
        ...apiData[tableName],
        title: mappingTable[tableName]?.title || tableName,
        parserInfo: mappingTable[tableName]?.parserInfo
      });
    }
  };

  const closeFullScreen = () => setSelectedData(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4">
      {error ? (
        <div className="col-span-2 text-center text-red-500">
          Ошибка: {error}
          <button
            onClick={fetchForecasts}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Повторить
          </button>
        </div>
      ) : (
        Object.keys(mappingTable).map((tableName) => {
          const tileData = apiData[tableName] || null;
          
          return (
            <ForecastTile
              key={tableName}
              title={mappingTable[tableName].title}
              data={tileData}
              isLoading={isLoading}
              isClickable={!isLoading && tileData !== null}
              onClick={() => handleTileClick(tableName)}
              theme={theme}
            />
          );
        })
      )}

      {selectedData && (
        <FullscreenForecastTile
          data={selectedData}
          onClose={closeFullScreen}
          theme={theme}
        />
      )}
    </div>
  );
}