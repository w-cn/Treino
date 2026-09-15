const repository = 'https://github.com/JahelCuadrado/ExerciseGymGifsDB/tree/v1.1.0';
const cdn = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0';

export const CARDIO = [
  ['walking-on-incline-treadmill', 'Caminhada na esteira', 'Esteira', 'Registre o tempo e, se desejar, a distância. Ajuste velocidade e inclinação no aparelho.'],
  ['run', 'Corrida', 'Ao ar livre / pista', 'Registre o tempo e a distância da corrida. Use a observação para anotar o percurso.'],
  ['stationary-bike-walk', 'Bicicleta ergométrica', 'Bicicleta ergométrica', 'Registre o tempo e a intensidade ou resistência utilizada.'],
  ['walk-elliptical-cross-trainer', 'Elíptico', 'Elíptico', 'Registre o tempo e a resistência utilizada no aparelho.'],
  ['walking-on-stepmill', 'Escada ergométrica', 'Escada ergométrica', 'Registre o tempo e o nível de velocidade utilizado.'],
  ['jump-rope', 'Pular corda', 'Corda', 'Registre o tempo total. Use a observação para anotar os intervalos.']
].map(([slug, name, equipment, description]) => ({
  id: 'cardio-' + slug, name, muscle: 'Cardio', muscles: ['Cardio'], kind: 'cardio', equipment, description,
  gif: `${cdn}/cardio/${slug}.gif`, source: `${repository}/api/en/exercises/cardio/${slug}.json`,
  mediaSource: `${repository}/cardio/${slug}.gif`
}));
