'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Film, Users, BarChart3, TrendingUp, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface IFilm {
  title: string;
  episode_id: number;
  characters: string[];
  director: string;
  producer: string;
  release_date: string;
}

// Interfaz para almacenar los personajes junto con su especie
interface SpeciesCharacterData {
  name: string;
  characters: { name: string }[];
}

interface SpeciesCount {
  [key: string]: SpeciesCharacterData;
}

interface SpeciesData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  characters: { name: string }[];
}

// Nuevo: Componente para el Modal de Personajes
const CharacterModal = ({
  isOpen,
  onClose,
  species,
}: {
  isOpen: boolean;
  onClose: () => void;
  species: SpeciesData | null;
}) => {
  if (!isOpen || !species) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: species.color }}
            />
            Personajes de la especie: {species.name}
          </CardTitle>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {species.characters.map((char) => (
              <li
                key={char.name}
                className="text-white bg-slate-700/50 p-3 rounded-md"
              >
                {char.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
    </div>
  );
};

const speciesColors = [
  '#fbbf24',
  '#f59e0b',
  '#d97706',
  '#92400e',
  '#3b82f6',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
  '#10b981',
  '#059669',
  '#047857',
  '#065f46',
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#8b5cf6',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
];

export default function SpeciesPage() {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [selectedFilm, setSelectedFilm] = useState('');
  const [speciesData, setSpeciesData] = useState<SpeciesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCharacters, setTotalCharacters] = useState(0);

  // Nuevo: Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesData | null>(
    null
  );

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await fetch('https://swapi.py4e.com/api/films/');
      const data = await response.json();
      const sortedFilms = data.results.sort(
        (a: IFilm, b: IFilm) => a.episode_id - b.episode_id
      );
      setFilms(sortedFilms);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const fetchSpeciesByFilm = async (filmTitle: string) => {
    setLoading(true);
    try {
      const film = films.find((f) => f.title === filmTitle);
      if (!film) return;

      const characterPromises = film.characters.map((charUrl) =>
        fetch(charUrl).then((res) => res.json())
      );
      const characters = await Promise.all(characterPromises);

      const speciesCount: SpeciesCount = {};

      for (const char of characters) {
        if (char.species.length === 0) {
          if (!speciesCount['Human']) {
            speciesCount['Human'] = { name: 'Human', characters: [] };
          }
          speciesCount['Human'].characters.push({ name: char.name });
        } else {
          for (const speciesUrl of char.species) {
            const speciesResponse = await fetch(speciesUrl);
            const species = await speciesResponse.json();
            if (!speciesCount[species.name]) {
              speciesCount[species.name] = {
                name: species.name,
                characters: [],
              };
            }
            speciesCount[species.name].characters.push({ name: char.name });
          }
        }
      }

      const total = characters.length;
      setTotalCharacters(total);

      const speciesArray = Object.values(speciesCount)
        .map(({ name, characters: speciesChars }, index) => ({
          name,
          count: speciesChars.length,
          percentage: (speciesChars.length / total) * 100,
          color: speciesColors[index % speciesColors.length],
          characters: speciesChars,
        }))
        .sort((a, b) => b.count - a.count);

      setSpeciesData(speciesArray);
    } catch (error) {
      console.error('Error fetching species data:', error);
    }
    setLoading(false);
  };

  const selectedFilmData = films.find((f) => f.title === selectedFilm);

  // Nuevo: Funciones para manejar el modal
  const openModalWithSpecies = (species: SpeciesData) => {
    setSelectedSpecies(species);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpecies(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          {/* Cambio de color: de purple a blue */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              Censo de Especies
            </h1>
            <p className="text-slate-300">
              Análisis demográfico por episodio galáctico
            </p>
          </div>
        </div>
      </div>

      {/* Film Selection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Film className="w-5 h-5" />
            Selección de Episodio
          </CardTitle>
          <CardDescription className="text-slate-300">
            Elige un episodio para analizar la distribución de especies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedFilm}
            onValueChange={(value) => {
              setSelectedFilm(value);
              fetchSpeciesByFilm(value);
            }}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-12">
              <SelectValue placeholder="Selecciona un episodio para analizar" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {films.map((film) => (
                <SelectItem
                  key={film.episode_id}
                  value={film.title}
                  className="text-white"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="border-yellow-400 text-yellow-400"
                    >
                      EP {film.episode_id}
                    </Badge>
                    <span>{film.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Film Info */}
      {selectedFilmData && (
        <Card className="bg-slate-800/50 border-slate-700">
          {' '}
          <CardHeader>
            <CardTitle className="text-yellow-400">
              Episodio {selectedFilmData.episode_id}: {selectedFilmData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Director:</span>
                <p className="text-white font-medium">
                  {selectedFilmData.director}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Productor:</span>
                <p className="text-white font-medium">
                  {selectedFilmData.producer}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Fecha de estreno:</span>
                <p className="text-white font-medium">
                  {selectedFilmData.release_date}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-yellow-400 font-medium">
              Analizando datos demográficos...
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Procesando información de especies
            </p>
          </CardContent>
        </Card>
      )}

      {/* Species Analysis */}
      {speciesData.length > 0 && !loading && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {totalCharacters}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Total de Personajes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {speciesData.length}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Especies Diferentes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  {/* Cambio de color: de purple a yellow */}
                  <BarChart3 className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {speciesData[0]?.name}
                    </p>
                    <p className="text-slate-400 text-sm">Especie Dominante</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Species Breakdown */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">
                Distribución de Especies
              </CardTitle>
              <CardDescription className="text-slate-300">
                Haz clic en una especie para ver la lista de personajes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {speciesData.map((species) => (
                // Nuevo: onClick para abrir el modal
                <div
                  key={species.name}
                  className="space-y-2 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
                  onClick={() => openModalWithSpecies(species)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: species.color }}
                      />
                      <span className="font-medium text-white">
                        {species.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className="bg-slate-700 text-white"
                      >
                        {species.count}{' '}
                        {species.count === 1 ? 'personaje' : 'personajes'}
                      </Badge>
                      <span className="text-slate-400 text-sm w-12 text-right">
                        {species.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={species.percentage}
                    className="h-2 bg-slate-700"
                    style={
                      {
                        '--progress-background': species.color,
                      } as React.CSSProperties
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Visual Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">
                Representación Visual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {speciesData.map((species) => (
                  <div
                    key={species.name}
                    className="flex flex-col items-center p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    style={{
                      minWidth: `${Math.max(species.percentage * 2, 80)}px`,
                    }}
                    onClick={() => openModalWithSpecies(species)}
                  >
                    <div
                      className="w-12 h-12 rounded-full mb-2 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: species.color }}
                    >
                      {species.count}
                    </div>
                    <p className="text-xs text-center text-slate-300 font-medium">
                      {species.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {species.percentage.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nuevo: Renderizar el modal */}
      <CharacterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        species={selectedSpecies}
      />
    </div>
  );
}
