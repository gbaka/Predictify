import { useEffect, useRef } from 'react';
import { useTheme } from "../context/ThemeContext";
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';


export default function Wiki() {
  const navRef = useRef(null);
  const bgRef = useRef(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const updateWidth = () => {
      if (navRef.current && bgRef.current) {
        const navWidth = navRef.current.offsetWidth;
        bgRef.current.style.width = `${navWidth}px`;
      }
    };

    // Обновляем ширину при загрузке и изменении размера окна
    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Очистка
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div className="flex">
      {/* Фоновая панель (fixed, занимает всю высоту, с тенью) */}
      <div
        ref={bgRef}
        className={`fixed hidden md:block left-0 top-0 h-full shadow-sm z-0 ${theme === "dark" ? "bg-gray-850 text-white" : "bg-gray-150 text-gray-800" } `}
      />

      {/* Навигационная панель (sticky) */}
      <nav
        ref={navRef}
        className={`sticky hidden md:block left-0 top-20 w-64 md:w-56 lg:w-72 h-full p-4 z-10 ${theme === "dark" ? "bg-gray-850 text-white" : "bg-gray-150 text-gray-800"   } `}
      >
        <ul className="space-y-2 w-full">
          <li className={`w-full border-b pb-2 ${ isDarkMode ? "border-gray-700" : "border-gray-300" } `}>
            <a
              href="#section1"
              className={`block p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"} `}
            >
              Раздел 1
            </a>
          </li>
          <li className={`w-full border-b pb-2 ${ isDarkMode ? "border-gray-700" : "border-gray-300" } `}>
            <a
              href="#section2"
              className={`block p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"} `}
            >
              Раздел 2
            </a>
          </li>
          <li className={`w-full border-b pb-2 ${ isDarkMode ? "border-gray-700" : "border-gray-300" } `}>
            <a
              href="#section3"
              className={`block p-2 rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"} `}
            >
              Раздел 3
            </a>
          </li>
        </ul>
      </nav>


      {/* <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">  */}
      <div className="container mt-3 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 p-6 px-8">
        <h1 id="main" className="text-3xl font-bold text-center">
          Вики
        </h1>
        <p className='mt-4'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat qui,
          quam maxime fugit dolores quibusdam a illum sint sunt porro delectus
          consectetur, labore soluta doloremque omnis! Saepe similique aliquid
          est ab neque voluptatum necessitatibus voluptatem deleniti provident
          atque adipisci officiis reiciendis quos dignissimos pariatur nemo vel
          sunt dolorum sapiente delectus eius unde, velit inventore ipsum! Id
          animi sunt voluptatem ratione corporis eaque, nobis vitae totam
          aspernatur quibusdam quo magni commodi! Commodi placeat repellendus
          illum incidunt obcaecati atque nam eum deserunt, suscipit optio
          eligendi accusamus possimus, odio neque ex quod, est adipisci animi
          vitae. Quisquam expedita commodi porro sit eum. Necessitatibus?
        </p>
        <section id="section1">
          <h2 className="text-xl font-bold">Раздел 1</h2>
          <p>Содержимое раздела 1...</p>
          <TeX className="overflow-x-auto" math="\pi = \sum_{k=0}^\infty \frac{1}{16^k} \left( \frac{4}{8k+1} - \frac{2}{8k+4} - \frac{1}{8k+5} - \frac{1}{8k+6} \right)" block />
        </section>
        <section id="section2" className="mt-10">
          <h2 className="text-xl font-bold">Раздел 2</h2>
          <p>Содержимое раздела 2...</p>
          <TeX className="overflow-x-auto" math="\rho \left( \frac{\partial \mathbf{v}}{\partial t} + \mathbf{v} \cdot \nabla \mathbf{v} \right) = -\nabla p + \mu \nabla^2 \mathbf{v} + \mathbf{f}" block />
        </section>
        <section id="section3" className="mt-10">
          <h2 className="text-xl font-bold">Раздел 3</h2>
          <p>
            Содержимое раздела 3... Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Saepe commodi eligendi neque dolorem temporibus
            sunt cum similique maiores est iusto tempora magni, corporis ullam
            unde corrupti? Blanditiis, pariatur ratione. Assumenda omnis
            architecto cupiditate eligendi expedita, earum pariatur? Accusamus
            molestiae reprehenderit adipisci ducimus ipsam aut. Quae hic nihil
            quod doloremque nam est ea, eligendi dicta consectetur sequi
            repudiandae voluptates recusandae quibusdam animi unde vero odio ex
            fugiat iure rem, atque perferendis iste? Recusandae a sequi delectus
            debitis possimus maiores obcaecati error non quae hic eligendi unde,
            quisquam nulla quod aut commodi voluptates nihil, illum aspernatur
            corrupti explicabo perferendis. Fugiat, saepe quo! <TeX math="\int_0^\infty x^2 dx"/>    
          </p>
        </section>
        <TeX className="overflow-x-auto" math="\int_0^\infty x^2 dx" block />
      </div>
    </div>
  );
}