import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';


export default function Wiki() {
  return (
    <div className="container mx-auto p-6 px-8">
      <h1 className="text-3xl font-bold">Wiki</h1>
      <p className="mt-4 text-gray-600">Здесь будет информация о методах прогнозирования.</p>
      <p>Inline TeX <TeX>\int_0^\infty x^2 dx</TeX> </p>
      <p>Блок LaTeXa:</p>
      <TeX block>\int_0^\infty x^2 dx</TeX>,
      <p>Еще один, но побольше:</p>
      <TeX block math="\Huge \int_0^\infty \frac{1}{x^2} dx" />
    </div>
  );
}
