'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  Mountain,
  Droplets,
  Wind,
  Thermometer,
  Crown,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
}

export default function PlanetsPage() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [mostPopulated, setMostPopulated] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlanets, setFilteredPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    fetchAllPlanets();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = planets.filter(
        (planet) =>
          planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          planet.climate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          planet.terrain.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlanets(filtered);
    } else {
      setFilteredPlanets(planets);
    }
  }, [searchTerm, planets]);

  const fetchAllPlanets = async () => {
    try {
      let allPlanets: Planet[] = [];
      let nextUrl = 'https://swapi.py4e.com/api/api/planets/';

      while (nextUrl) {
        const response = await fetch(nextUrl);
        const data = await response.json();
        allPlanets = [...allPlanets, ...data.results];
        nextUrl = data.next;
      }

      setPlanets(allPlanets);

      // Find most populated planet
      const planetsWithPopulation = allPlanets.filter(
        (planet) =>
          planet.population !== 'unknown' && !isNaN(Number(planet.population))
      );

      if (planetsWithPopulation.length > 0) {
        const mostPopulated = planetsWithPopulation.reduce((max, planet) =>
          Number(planet.population) > Number(max.population) ? planet : max
        );
        setMostPopulated(mostPopulated);
      }
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
    setLoading(false);
  };

  const getClimateIcon = (climate: string) => {
    if (climate.includes('arid') || climate.includes('desert'))
      return <Thermometer className="w-4 h-4 text-orange-400" />;
    if (climate.includes('temperate'))
      return <Wind className="w-4 h-4 text-green-400" />;
    if (climate.includes('tropical'))
      return <Droplets className="w-4 h-4 text-blue-400" />;
    if (climate.includes('frozen'))
      return <Mountain className="w-4 h-4 text-cyan-400" />;
    return <Globe className="w-4 h-4 text-gray-400" />;
  };

  const getClimateColor = (climate: string) => {
    if (climate.includes('arid') || climate.includes('desert'))
      return 'border-orange-500/50 bg-orange-900/20';
    if (climate.includes('temperate'))
      return 'border-green-500/50 bg-green-900/20';
    if (climate.includes('tropical'))
      return 'border-blue-500/50 bg-blue-900/20';
    if (climate.includes('frozen')) return 'border-cyan-500/50 bg-cyan-900/20';
    return 'border-slate-500/50 bg-slate-900/20';
  };

  const formatPopulation = (population: string) => {
    if (population === 'unknown') return 'Desconocida';
    const num = Number(population);
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPopulationLevel = (population: string) => {
    if (population === 'unknown') return 0;
    const num = Number(population);
    if (num >= 1000000000) return 100;
    if (num >= 100000000) return 80;
    if (num >= 10000000) return 60;
    if (num >= 1000000) return 40;
    if (num >= 100000) return 20;
    return 10;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-yellow-400 font-medium">
              Escaneando sistemas planetarios...
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Recopilando datos de inteligencia
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              Inteligencia Planetaria
            </h1>
            <p className="text-slate-300">
              Base de datos estratégica de mundos conocidos
            </p>
          </div>
        </div>
      </div>

      {/* Most Populated Planet Highlight */}
      {mostPopulated && (
        <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Crown className="w-6 h-6" />
              Objetivo Estratégico Principal
            </CardTitle>
            <CardDescription className="text-slate-300">
              Planeta con mayor concentración poblacional identificada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {mostPopulated.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <span className="text-2xl font-bold text-red-400">
                      {formatPopulation(mostPopulated.population)} habitantes
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Clima:</span>
                    <p className="text-white font-medium flex items-center gap-2">
                      {getClimateIcon(mostPopulated.climate)}
                      {mostPopulated.climate}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Terreno:</span>
                    <p className="text-white font-medium">
                      {mostPopulated.terrain}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Gravedad:</span>
                    <p className="text-white font-medium">
                      {mostPopulated.gravity}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Agua superficial:</span>
                    <p className="text-white font-medium">
                      {mostPopulated.surface_water}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-slate-400 text-sm">
                    Nivel de amenaza poblacional:
                  </span>
                  <Progress value={100} className="h-3 bg-slate-700 mt-2" />
                  <p className="text-red-400 text-sm mt-1">
                    Máxima prioridad estratégica
                  </p>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">
                    Datos Orbitales
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Rotación:</span>
                      <p className="text-white">
                        {mostPopulated.rotation_period}h
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Órbita:</span>
                      <p className="text-white">
                        {mostPopulated.orbital_period} días
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Diámetro:</span>
                      <p className="text-white">{mostPopulated.diameter} km</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Residentes:</span>
                      <p className="text-white">
                        {mostPopulated.residents.length} conocidos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              Búsqueda Planetaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Buscar por nombre, clima o terreno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{planets.length}</p>
              <p className="text-slate-400 text-sm">Mundos Catalogados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {planets.filter((p) => p.population !== 'unknown').length}
              </p>
              <p className="text-slate-400 text-sm">Con Datos Poblacionales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlanets.map((planet, index) => (
          <Card
            key={index}
            className={`${getClimateColor(
              planet.climate
            )} border hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  {planet.name}
                </CardTitle>
                {getClimateIcon(planet.climate)}
              </div>
              <CardDescription className="text-slate-300">
                {planet.climate} • {planet.terrain}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Población:</span>
                  <Badge
                    variant={
                      planet.population === 'unknown' ? 'outline' : 'secondary'
                    }
                    className={
                      planet.population === 'unknown'
                        ? 'border-slate-600'
                        : 'bg-slate-700'
                    }
                  >
                    {formatPopulation(planet.population)}
                  </Badge>
                </div>

                {planet.population !== 'unknown' && (
                  <Progress
                    value={getPopulationLevel(planet.population)}
                    className="h-2 bg-slate-700"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Gravedad:</span>
                  <p className="text-white">{planet.gravity}</p>
                </div>
                <div>
                  <span className="text-slate-400">Agua:</span>
                  <p className="text-white">{planet.surface_water}%</p>
                </div>
                <div>
                  <span className="text-slate-400">Rotación:</span>
                  <p className="text-white">{planet.rotation_period}h</p>
                </div>
                <div>
                  <span className="text-slate-400">Órbita:</span>
                  <p className="text-white">{planet.orbital_period}d</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    {planet.residents.length} residentes conocidos
                  </span>
                  <span className="text-slate-400">
                    {planet.films.length} apariciones
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlanets.length === 0 && searchTerm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-8">
            <Globe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">
              No se encontraron planetas
            </h3>
            <p className="text-slate-500">
              No hay mundos que coincidan con "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
