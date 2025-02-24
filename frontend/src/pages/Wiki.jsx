// import 'katex/dist/katex.min.css';
// import TeX from '@matejmazur/react-katex';


// export default function Wiki() {
//   return (
//     <div className="container mx-auto p-6 px-8">
//       <h1 className="text-3xl font-bold">Wiki</h1>
//       <p className="mt-4 text-gray-600">Здесь будет информация о методах прогнозирования.</p>
//       <p>Inline TeX <TeX>\int_0^\infty x^2 dx</TeX> </p>
//       <p>Блок LaTeXa:</p>
//       <TeX block>\int_0^\infty x^2 dx</TeX>,
//       <p>Еще один, но побольше:</p>
//       <TeX block math="\Huge \int_0^\infty \frac{1}{x^2} dx" />
//     </div>
//   );
// }


// src/pages/Wiki.jsx
// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import TeX from "@matejmazur/react-katex";


export default function Wiki() {
  return (
      <div className="flex">
         {/* Фоновая панель (fixed, занимает всю высоту, с тенью) */}
          <div className="fixed left-0 top-16 w-64 h-full bg-gray-100 bg-gray-850 p-4 z-0" />
              
          {/* Навигационная панель */}
          <nav className="sticky left-0 top-16 w-64 h-full bg-gray-100 bg-gray-850 p-4 z-0">
              <ul className="space-y-2">
                  <li><a href="#section1" className="block p-2 hover:bg-gray-700 dark:hover:bg-gray-800">Раздел 1</a></li>
                  <li><a href="#section2" className="block p-2 hover:bg-gray-700 dark:hover:bg-gray-800">Раздел 2</a></li>
                  <li><a href="#section3" className="block p-2 hover:bg-gray-700 dark:hover:bg-gray-800">Раздел 3</a></li>
              </ul>
          </nav>

          {/* Контейнер для основного контента */}
          <main className="ml-64 p-6 flex-1">
              <section id="section1">
                  <h2 className="text-xl font-bold">Раздел 1</h2>
                  <p>Содержимое раздела 1...</p>
              </section>
              <section id="section2" className="mt-10">
                  <h2 className="text-xl font-bold">Раздел 2</h2>
                  <p>Содержимое раздела 2...</p>
              </section>
              <section id="section3" className="mt-10">
                  <h2 className="text-xl font-bold">Раздел 3</h2>
                  <p>Содержимое раздела 3...</p>
              </section>
              <section id="section3" className="mt-10">
                  <h2 className="text-xl font-bold">Раздел 3</h2>
                  <p>Содержимое раздела 3...</p>
              </section>
              <section id="section3" className="mt-10">
                  <h2 className="text-xl font-bold">Раздел 3</h2>
                  <p>Содержимое раздела 3...</p>
              </section>
              <section id="section3" className="mt-10">
                  <h2 className="text-xl font-bold">Раздел 3</h2>
                  <p>Содержимое раздела 3...</p>
              </section>
              <section id="section3" className="mt-10">
                  <h2 className="text-xl font-bold">Раздел 3</h2>
                  <p>Содержимое раздела 3...</p>
              </section>
          </main>
      </div>
  );
}
