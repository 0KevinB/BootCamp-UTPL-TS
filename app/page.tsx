'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, Film } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface Pilot {
  name: string;
  birth_year: string;
  gender: string;
}

interface Starship {
  name: string;
  pilots: string[];
}

interface IFilm {
  title: string;
  episode_id: number;
  characters: string[];
}

interface Character {
  name: string;
  species: string[];
}

interface Species {
  name: string;
}

interface Planet {
  name: string;
  population: string;
}

interface SpeciesCount {
  [key: string]: number;
}

export default function RebelDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState<IFilm[]>([]);
  const [selectedFilm, setSelectedFilm] = useState('');
  const [speciesCount, setSpeciesCount] = useState<SpeciesCount>({});
  const [mostPopulatedPlanet, setMostPopulatedPlanet] = useState<Planet | null>(
    null
  );
  const [loadingSpecies, setLoadingSpecies] = useState(false);

  // Fetch films on component mount
  useEffect(() => {
    fetchFilms();
    fetchMostPopulatedPlanet();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await fetch('https://swapi.py4e.com/api/films/');
      const data = await response.json();
      setFilms(data.results);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const fetchMostPopulatedPlanet = async () => {
    try {
      let allPlanets: Planet[] = [];
      let nextUrl = 'https://swapi.py4e.com/api/planets/';

      while (nextUrl) {
        const response = await fetch(nextUrl);
        const data = await response.json();
        allPlanets = [...allPlanets, ...data.results];
        nextUrl = data.next;
      }

      const planetsWithPopulation = allPlanets.filter(
        (planet) =>
          planet.population !== 'unknown' && !isNaN(Number(planet.population))
      );

      const mostPopulated = planetsWithPopulation.reduce((max, planet) =>
        Number(planet.population) > Number(max.population) ? planet : max
      );

      setMostPopulatedPlanet(mostPopulated);
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
  };

  const searchStarshipPilots = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // Search for starships
      const starshipResponse = await fetch(
        `https://swapi.py4e.com/api/starships/?search=${searchTerm}`
      );
      const starshipData = await starshipResponse.json();

      if (starshipData.results.length === 0) {
        setPilots([]);
        setLoading(false);
        return;
      }

      const starship = starshipData.results[0];
      const pilotPromises = starship.pilots.map((pilotUrl: string) =>
        fetch(pilotUrl).then((res) => res.json())
      );
      const pilotsData = await Promise.all(pilotPromises);

      setPilots(pilotsData);
    } catch (error) {
      console.error('Error searching pilots:', error);
      setPilots([]);
    }
    setLoading(false);
  };

  const fetchSpeciesByFilm = async (filmTitle: string) => {
    setLoadingSpecies(true);
    try {
      const film = films.find((f) => f.title === filmTitle);
      if (!film) return;

      // Fetch all characters in the film
      const characterPromises = film.characters.map((charUrl) =>
        fetch(charUrl).then((res) => res.json())
      );
      const characters = await Promise.all(characterPromises);

      // Count species
      const speciesUrls = new Set<string>();
      characters.forEach((char) => {
        if (char.species.length === 0) {
          speciesUrls.add('Human'); // Default to human if no species specified
        } else {
          char.species.forEach((speciesUrl: string) =>
            speciesUrls.add(speciesUrl)
          );
        }
      });

      // Fetch species names
      const speciesData: { [key: string]: number } = {};

      for (const speciesUrl of speciesUrls) {
        if (speciesUrl === 'Human') {
          const humanCount = characters.filter(
            (char) => char.species.length === 0
          ).length;
          speciesData['Human'] = humanCount;
        } else {
          const speciesResponse = await fetch(speciesUrl);
          const species = await speciesResponse.json();
          const count = characters.filter((char) =>
            char.species.includes(speciesUrl)
          ).length;
          speciesData[species.name] = count;
        }
      }

      setSpeciesCount(speciesData);
    } catch (error) {
      console.error('Error fetching species data:', error);
    }
    setLoadingSpecies(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-yellow-400/20 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">RA</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">
                Tablero de Inteligencia Rebelde
              </h1>
              <p className="text-slate-300 text-sm">
                Crucero Mon Calamari - Home One
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Pilot Search Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Search className="w-5 h-5" />
              Identificador de Pilotos
            </CardTitle>
            <CardDescription className="text-slate-300">
              Busca una nave estelar para identificar a sus pilotos conocidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ej: Millennium Falcon, X-wing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchStarshipPilots()}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button
                onClick={searchStarshipPilots}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 text-slate-900"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {pilots.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-yellow-400">
                  Pilotos Identificados:
                </h3>
                <div className="grid gap-2">
                  {pilots.map((pilot, index) => (
                    <div key={index} className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="font-medium">{pilot.name}</div>
                      <div className="text-sm text-slate-400">
                        Año de nacimiento: {pilot.birth_year} | Género:{' '}
                        {pilot.gender}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-slate-700">
              <Link
                href="/pilots"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
              >
                Ver análisis completo <Search className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Species Census Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Film className="w-5 h-5" />
              Censo de Especies por Película
            </CardTitle>
            <CardDescription className="text-slate-300">
              Selecciona una película para ver el recuento de especies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedFilm}
              onValueChange={(value) => {
                setSelectedFilm(value);
                fetchSpeciesByFilm(value);
              }}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Selecciona una película" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {films.map((film) => (
                  <SelectItem
                    key={film.episode_id}
                    value={film.title}
                    className="text-white"
                  >
                    Episodio {film.episode_id}: {film.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {loadingSpecies && (
              <div className="text-center py-4 text-slate-400">
                Analizando datos de especies...
              </div>
            )}

            {Object.keys(speciesCount).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-400">
                  Recuento de Especies:
                </h3>
                <div className="grid gap-2">
                  {Object.entries(speciesCount).map(([species, count]) => (
                    <div
                      key={species}
                      className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg"
                    >
                      <span className="font-medium">{species}</span>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-600 text-slate-900"
                      >
                        {count} {count === 1 ? 'personaje' : 'personajes'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-slate-700">
              <Link
                href="/species"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-2"
              >
                Ver análisis completo <Film className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Most Populated Planet Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Globe className="w-5 h-5" />
              Planeta Más Poblado
            </CardTitle>
            <CardDescription className="text-slate-300">
              Información estratégica sobre el planeta con mayor población
              registrada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostPopulatedPlanet ? (
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">
                      {mostPopulatedPlanet.name}
                    </h3>
                    <p className="text-slate-300">
                      Objetivo estratégico prioritario
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-400">
                      {Number(mostPopulatedPlanet.population).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">habitantes</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400">
                Analizando datos planetarios...
              </div>
            )}
            <div className="pt-4 border-t border-slate-700">
              <Link
                href="/planets"
                className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-2"
              >
                Ver inteligencia completa <Globe className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <Separator className="mb-4 bg-slate-700" />
          <p className="text-slate-400 text-sm">
            Que la Fuerza te acompañe, rebelde. La libertad de la galaxia
            depende de nuestra inteligencia.
          </p>
        </div>
      </div>
    </div>
  );
}
