// src/pages/Forecasting.jsx
import BaseChart from "../components/charts/BaseChart";

export default function Forecasting() {
    const options = {
        title: { text: "Простой график №1" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] },
        yAxis: { type: "value" },
        series: [
            {
                name: "Значения 1",
                type: "line",
                data: [120, 200, 150, 190, 70, 110, 130],
                smooth: true,
                lineStyle: { width: 2 },
                itemStyle: { color: "#42A5F5" }
            },
            {
              name: "Значения 2",
              type: "line",
              data: [120, 20, 160, 80, 60, 110, 130],
              smooth: true,
              lineStyle: { width: 2 },
              itemStyle: { color: "#4245F5" }
            },
            {
              name: "Значения 3",
              type: "line",
              data: [120, 20, 1, 140, 10, 110, 190],
              smooth: true,
              lineStyle: { width: 2 },
              itemStyle: { color: "#2245F5" }
          },
          {
            name: "Значения 4",
            type: "line",
            data: [110, 20, 1, 10, 60, 110, 190],
            smooth: true,
            lineStyle: { width: 2 },
            itemStyle: { color: "#AA45F5" }
        }
      ]
    };

    return (
      <div className="container mx-auto p-6 px-8">
        <h1 className="text-3xl font-bold mb-4">Графики прогнозов</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
          perspiciatis nesciunt, sed inventore eligendi minima unde repellendus
          officiis ad dignissimos dolor quaerat veritatis, blanditiis pariatur
          fugit porro rerum. Esse, laudantium? <br /> <br />
        </p>
        <BaseChart options={options} />
        <p>
          <br />  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel impedit
          veniam deleniti qui debitis voluptatem, natus nisi esse facere quasi
          nobis! Nemo provident nesciunt ab adipisci laborum sint animi illo
          placeat sed dolorum, minus atque, a assumenda impedit nulla ipsum.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          eum aut et eius aspernatur. Commodi ipsum, cum molestiae dolorum unde
          iste impedit! Voluptatem, molestiae totam. Voluptas facilis iusto
          dolores, quaerat odit ratione nisi, saepe, dicta nulla doloremque
          repellendus ut culpa!
        </p>
      </div>
    );
}
