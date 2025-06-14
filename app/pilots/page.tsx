'use client';

import { useState } from 'react';
import { Search, User, Calendar, Users, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Pilot {
  name: string;
  birth_year: string;
  gender: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
}

interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
}

export default function PilotsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [starship, setStarship] = useState<Starship | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchStarshipPilots = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const starshipResponse = await fetch(
        `https://swapi.py4e.com/api/starships/?search=${searchTerm}`
      );
      const starshipData = await starshipResponse.json();

      if (starshipData.results.length === 0) {
        setPilots([]);
        setStarship(null);
        setLoading(false);
        return;
      }

      const foundStarship = starshipData.results[0];
      setStarship(foundStarship);

      const pilotPromises = foundStarship.pilots.map((pilotUrl: string) =>
        fetch(pilotUrl).then((res) => res.json())
      );
      const pilotsData = await Promise.all(pilotPromises);

      setPilots(pilotsData);

      // Add to search history
      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory((prev) => [searchTerm, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error searching pilots:', error);
      setPilots([]);
      setStarship(null);
    }
    setLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              Identificador de Pilotos
            </h1>
            <p className="text-slate-300">
              Sistema avanzado de reconocimiento de tripulaciones
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            Búsqueda de Nave Estelar
          </CardTitle>
          <CardDescription className="text-slate-300">
            Ingresa el nombre de una nave para identificar a su tripulación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ej: Millennium Falcon, X-wing, TIE Fighter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchStarshipPilots()}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-lg"
            />
            <Button
              onClick={searchStarshipPilots}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Escaneando...
                </div>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-600 border-slate-600 text-slate-300"
                    onClick={() => {
                      setSearchTerm(term);
                      searchStarshipPilots();
                    }}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Starship Info */}
      {starship && (
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-5 h-5" />
              Información de la Nave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-white">
                  {starship.name}
                </h3>
                <p className="text-slate-300">{starship.model}</p>
                <p className="text-sm text-slate-400">
                  Fabricante: {starship.manufacturer}
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Clase:</span>
                  <span className="text-white">{starship.starship_class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longitud:</span>
                  <span className="text-white">{starship.length}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tripulación:</span>
                  <span className="text-white">{starship.crew}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Velocidad máx:</span>
                  <span className="text-white">
                    {starship.max_atmosphering_speed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hiperimpulsor:</span>
                  <span className="text-white">
                    Clase {starship.hyperdrive_rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MGLT:</span>
                  <span className="text-white">{starship.MGLT}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pilots Results */}
      {pilots.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-400">
              Pilotos Identificados ({pilots.length})
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilots.map((pilot, index) => (
              <Card
                key={index}
                className="bg-slate-800/70 border-slate-600 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600">
                      <AvatarFallback className="text-slate-900 font-bold">
                        {getInitials(pilot.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {pilot.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Piloto Identificado
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-400">Nacimiento:</span>
                      </div>
                      <p className="text-white font-medium">
                        {pilot.birth_year}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-400">Género:</span>
                      </div>
                      <p className="text-white font-medium">{pilot.gender}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Altura:</span>
                        <p className="text-white">{pilot.height}cm</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Peso:</span>
                        <p className="text-white">{pilot.mass}kg</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Ojos:</span>
                        <p className="text-white">{pilot.eye_color}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Cabello:</span>
                        <p className="text-white">{pilot.hair_color}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchTerm && pilots.length === 0 && starship === null && (
        <Card className="bg-red-900/20 border-red-700/50">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">
              Nave No Encontrada
            </h3>
            <p className="text-slate-300">
              No se encontraron registros de la nave "{searchTerm}" en la base
              de datos del Imperio.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
