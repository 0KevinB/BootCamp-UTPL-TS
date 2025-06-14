'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FiUsers, FiFilm, FiGlobe } from 'react-icons/fi';

export default function RebelLanding() {
  return (
    <div className="min-h-screen bg-black text-white px-12 py-16 space-y-28">
      {/* Sección 1 */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="flex items-center gap-3 text-4xl font-bold text-yellow-400">
          <FiUsers className="text-yellow-400" size={32} />
          Identificador de Pilotos
        </h2>
        <p className="text-white text-lg leading-relaxed">
          Descubre quiénes han piloteado una nave estelar específica. Escribe el nombre de una nave conocida y accede al registro completo de sus pilotos.
        </p>
        <Link href="/pilots" className="inline-block">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-[0_0_8px_rgba(253,224,71,0.7)] transition duration-300">
            Ir a la sección
          </Button>
        </Link>
        <hr className="border-yellow-400/40 mt-10" />
      </section>

      {/* Sección 2 */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="flex items-center gap-3 text-4xl font-bold text-yellow-400">
          <FiFilm className="text-yellow-400" size={32} />
          Censo de Especies por Película
        </h2>
        <p className="text-white text-lg leading-relaxed">
          Selecciona una película y obtén un resumen detallado del número de personajes de cada especie que aparecen, incluyendo humanos, wookiees, droides y más.
        </p>
        <Link href="/species" className="inline-block">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-[0_0_8px_rgba(253,224,71,0.7)] transition duration-300">
            Ir a la sección
          </Button>
        </Link>
        <hr className="border-yellow-400/40 mt-10" />
      </section>

      {/* Sección 3 */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="flex items-center gap-3 text-4xl font-bold text-yellow-400">
          <FiGlobe className="text-yellow-400" size={32} />
          Planeta Más Poblado
        </h2>
        <p className="text-white text-lg leading-relaxed">
          Consulta información estratégica sobre el planeta con la mayor población registrada en la galaxia, ignorando aquellos con población desconocida.
        </p>
        <Link href="/planets" className="inline-block">
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-[0_0_8px_rgba(253,224,71,0.7)] transition duration-300">
            Ir a la sección
          </Button>
        </Link>
        <hr className="border-yellow-400/40 mt-10" />
      </section>

      {/* Footer */}
      <footer className="text-center pt-12 pb-6 border-t border-yellow-400/30 max-w-4xl mx-auto">
        <p className="text-yellow-400 text-lg">
          Que la Fuerza te acompañe, rebelde. La libertad de la galaxia depende de nuestra inteligencia.
        </p>
      </footer>
    </div>
  );
}
