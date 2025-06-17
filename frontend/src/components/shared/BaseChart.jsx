import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const I18nNamespace = "common";

export default function BaseChart({ options, isLoading, theme,  bordered }) {
    const { t } = useTranslation(I18nNamespace);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
  
    useEffect(() => {
      if (!chartRef.current) return;
      const isDarkMode = theme === "dark";
  
      chartInstanceRef.current = echarts.init(chartRef.current, isDarkMode ? "dark" : null);
      const defaultFontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
      const textColor = isDarkMode ? "#fafafa" : "#333";
      const axisColor = isDarkMode ? "#888" : "#ccc";
      const legendColor = isDarkMode ? "#fff" : "#333";
  
      const updatedOptions = {
        ...options,

        // НЕ НАСТРАЕВЫЕМЫЕ ИЗВНЕ ПАРАМЕТРЫ ГРАФИКА 
        backgroundColor: "transparent",
        textStyle: { fontFamily: defaultFontFamily, color: textColor },
  
         // ПАРАМЕТРЫ ГРАФИКА С ДЕФОЛТНЫМИ ЗНАЧЕНИЯМИ
        grid: options.grid ?? {
          left: "7%",
          right: "7%",
        },

        dataZoom: options.dataZoom ?? [
          {
            type: "slider",
            start: 0,
            end: 100,
            left: "10%",
            right: "10.5%",
  
            borderColor: `${
              isDarkMode ? "rgba(54, 65, 83, 1)" : "rgb(228, 226, 226)"
            } `,
            fillerColor: `${
              isDarkMode ? "rgba(29, 36, 46, 0.13)" : "rgba(213, 213, 213, 0.13)"
            }`,
  
            dataBackground: {
              lineStyle: {
                color: `${
                  isDarkMode
                    ? "rgba(160, 160, 160, 0.2)"
                    : "rgba(232, 232, 232, 0.2)"
                }`,
              },
              areaStyle: {
                color: `${
                  isDarkMode ? "rgba(54, 65, 83, 1)" : "rgb(188, 188, 188)"
                }`,
              },
            },
  
            selectedDataBackground: {
              lineStyle: {
                color: `${
                  isDarkMode ? "rgba(54, 65, 83, 1)" : "rgba(224, 224, 237, 0.95)"
                }`,
                width: 2,
              },
              areaStyle: {
                color: `${
                  isDarkMode ? "rgba(54, 65, 83, 1)" : "rgba(212, 215, 243, 0.92)"
                }`, 
              },
            },
  
            emphasis: {
              moveHandleStyle: {
                color: "rgb(53, 130, 255)",
              },
            },
  
            handleStyle: {
              color: `${
                isDarkMode ? "rgba(54, 65, 83, 1)" : "rgb(255, 255, 255)"
              }`,
              fillerColor: "red",
            },
          },
  
          { type: "inside" }, 
        ],

        // ДОНАСТРАЕВЫЕМЫЕ ИЗВНЕ ПАРАМЕТРЫ ГРАФИКА
        title: options.title
        ? {
            ...options.title,
            left: "center",
            textStyle: {
              ...options.title.textStyle,
              fontFamily: defaultFontFamily,
              color: textColor,
            },
          }
        : {},

        xAxis: options.xAxis
        ? {
            ...options.xAxis,
            axisLabel: {
                ...options.xAxis.axisLabel,
                fontFamily: defaultFontFamily,
                color: textColor,
            },
            axisLine: { 
              ...options.xAxis.axisLine,
              lineStyle: { color: axisColor } 
            },
            }
        : {},

        yAxis: options.yAxis
        ? {
            ...options.yAxis,
            axisLabel: {
                ...options.yAxis.axisLabel,
                fontFamily: defaultFontFamily,
                color: textColor,
            },
            axisLine: { lineStyle: { color: axisColor } },
            }
        : {},

        legend: {
            ...options.legend,
            textStyle: { color: legendColor, fontFamily: defaultFontFamily },
            type: "scroll",
            orient: "horizontal",
            top: options.legend?.top || 28
          
        },

        tooltip: {
          ...options.tooltip,
          trigger: "axis",
          backgroundColor: `${isDarkMode ? "rgba(23,33,49,0.8)" : "rgba(249,250,251,0.8)"}`,
          borderColor: `${isDarkMode ? "#4B5563" : "#D1D5DB"}`,
          textStyle: {
            color: `${isDarkMode ? "#F9FAFB" : "#3F3F46"}`
          },   
        },

        toolbox: {
          ...options.toolbox,
          feature: {
            saveAsImage: {
              show: true,
              title: t("forecast-panel.save-as-png"),
              iconStyle: {
                borderColor: `${isDarkMode ? "rgb(72, 86, 108)" : "rgb(150, 150, 150)"}`, 
              },
              emphasis: {
                iconStyle: {
                  borderColor: `${isDarkMode ? "rgb(115, 134, 161)" : "rgb(111, 111, 111)"}`, 
                }
              }
            },
            restore: {
              show: true,
              title: t("forecast-panel.reset-scale"),
              iconStyle: {
                borderColor:  `${isDarkMode ? "rgb(72, 86, 108)" : "rgb(150, 150, 150)"}`,    
              },
              emphasis: {
                iconStyle: {
                  borderColor:  `${isDarkMode ? "rgb(115, 134, 161)" : "rgb(111, 111, 111)"}`, 
                }
              }
            }
          }
        }  
      };
  
      // Загрузка при отправке данных
      if (isLoading) {
        chartInstanceRef.current.showLoading('default', {
          text: t("forecast-panel.loading"),
          fontFamily: defaultFontFamily,
          fontSize: 16,
          textColor: `${theme === "dark" ? "#FFF" : "#000"}`,
          spinnerRadius: 16,
          color: '#409EFF',
          maskColor: 'rgba(0, 0, 0, 0)',
        });
      } else {
        chartInstanceRef.current.hideLoading();
        chartInstanceRef.current.setOption(updatedOptions);
      }
  
      // Используем ResizeObserver для автоматического изменения размера графика
      const resizeObserver = new ResizeObserver(() => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resize();
        }
      });
  
      resizeObserver.observe(chartRef.current);
  
      return () => {
        resizeObserver.disconnect();
        chartInstanceRef.current.dispose();
      };
    }, [options, theme]);
  
    return (
      <div
        className={`rounded-lg border transition-all ${
          bordered
          ? theme === "dark"
            ? "border border-gray-700"
            : "border border-gray-300"
          : "border-none"
        } h-full w-full`}
      >
        <div ref={chartRef} className="flex w-full h-full mt-3 pb-2" />
      </div>
    );
  }
  