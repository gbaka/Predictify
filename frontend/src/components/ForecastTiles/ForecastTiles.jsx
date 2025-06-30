import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios"

import ForecastTile from "./ForecastTile";
import FullscreenForecastTile from "./FullscreenForecastTile";
import { API_CONFIG } from "../../api/apiConfig";


const I18nNamespace = "common";


/**
 * Компонент, отображающий сетку плиток с краткосрочными прогнозами.
 * Получает данные с сервера, обрабатывает и визуализирует их в виде плиток с графиками.
 * Поддерживает кликабельность плиток для отображения полной информации в полноэкранном режиме.
 * 
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {"dark"|"light"} props.theme - Тема оформления (тёмная или светлая).
 * @returns {JSX.Element} Сетка плиток с прогнозами.
 */
export default function ForecastTiles({ theme }) {
  const { t } = useTranslation(I18nNamespace);
  const [selectedData, setSelectedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({});
  const [error, setError] = useState(null);

  // Базовый шаблон для mappingTable с описанием характеристик парсеров
  const baseMappingTable = {
    temperature_forecast: {
      title: t("forecasting-tiles.temp"),
      parserInfo: {
        status: "online",
        source: "Open Meteo API",
        updateInterval: `15 ${t("forecasting-tiles.min")}`,
        model: "ARIMA(5,0,2)",
        lastUpdate: null,
        dataPoints: 0,
        details: t("forecasting-tiles.temp-details")
      } 
    },
    relative_humidity_forecast: {
      title: t("forecasting-tiles.humidity"),
      parserInfo: {
        status: "online",
        source: "Open Meteo API",
        updateInterval: `15 ${t("forecasting-tiles.min")}`,
        model: "ARIMA(5,0,2)",
        lastUpdate: null,
        dataPoints: 0,
        details: t("forecasting-tiles.humidity-details")
      } 
    },
    wind_speed_forecast: {
      title: t("forecasting-tiles.wind"),
      parserInfo: {
        status: "online",
        source: "Open Meteo API",
        updateInterval: `15 ${t("forecasting-tiles.min")}`,
        model: "ARIMA(5,0,2)",
        lastUpdate: null,
        dataPoints: 0,
        details: t("forecasting-tiles.wind-details")
      } 
    },
    precipitation_forecast: {
      title: t("forecasting-tiles.precipitation"),
      parserInfo: {
        status: "online",
        source: "Open Meteo API",
        updateInterval: `15 ${t("forecasting-tiles.min")}`,
        model: "ARIMA(5,0,2)",
        lastUpdate: null,
        dataPoints: 0,
        details: t("forecasting-tiles.precipitation-details")
      } 
    },
  };

  // Модифицируем исходные данные для красивого отображения на графике
  // (добавляем фикивные прогноз и доверительный интвервал в начало not-null серии)
  const patchTransitionNulls = (originalData) => {
    if (!originalData?.prediction || !originalData?.endog) {
      return originalData;
    }
    // Создаем глубокую копию данных
    const data = {
      ...originalData,
      prediction: [...originalData.prediction],
      confidence_intervals: originalData.confidence_intervals 
        ? originalData.confidence_intervals.map(interval => interval ? [...interval] : null)
        : null,
      absolute_error: originalData.absolute_error
      ? originalData.absolute_error.map(val => val !== null ? val.toFixed(3) : null)
      : null

    };
    // Модифицируем копию
    for (let i = 0; i < data.prediction.length - 1; i++) {
      if (data.prediction[i] === null && data.prediction[i + 1] !== null) {
        if (originalData.endog[i] !== undefined) {
          data.prediction[i] = originalData.endog[i];
          data.absolute_error[i] = 0
          if (data.confidence_intervals?.[i]) {
            data.confidence_intervals[i] = [originalData.endog[i], originalData.endog[i]];
          }
        }
      }
    }
    return data;
  }

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
        API_CONFIG.FORECAST_FROM_PARSERS_ENDPOINT
      );
      setApiData(response.data);
      setIsLoading(false);
      setError(null);
      console.log("POOLING FROM DB", response.dara, response)
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      
      // Обновляем статусы при ошибке
      Object.keys(mappingTable).forEach(tableName => {
        mappingTable[tableName].parserInfo.status = "offline";
      });
    }
  };

  // Периодический пуллинг (5*60*1000 = 5 мин)
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
        </div>
      ) : (
        Object.keys(mappingTable).map((tableName) => {
          const tileData = apiData[tableName] || null;
          
          return (
            <ForecastTile
              key={tableName}
              title={mappingTable[tableName].title}
              data={patchTransitionNulls(tileData)}
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
          data={patchTransitionNulls(selectedData)}
          onClose={closeFullScreen}
          theme={theme}
        />
      )}
    </div>
  );
}