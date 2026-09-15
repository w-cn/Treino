export const RECOMMENDATIONS = [
  {
    id: 'massa',
    label: 'Ganhar massa',
    icon: '↗',
    summary: 'Mais volume de musculacao com progressao gradual e recuperacao suficiente.',
    target: 'Objetivo principal: aumentar massa muscular',
    prescription: [
      ['Frequencia', '2x por semana por grupo muscular quando couber na rotina'],
      ['Volume', 'Comece com 8–12 series por grupo/semana; avance se estiver recuperando bem'],
      ['Repeticoes', '6–12 na maior parte; isoladores podem usar 10–20'],
      ['Esforco', 'Termine a maioria das series com 1–3 repeticoes na reserva'],
      ['Cardio', '2–3 sessoes leves de 20–30 min, sem atrapalhar pernas e recuperacao']
    ],
    week: ['Seg: superior', 'Ter: inferior', 'Qui: superior', 'Sex: inferior'],
    workouts: [
      { day: 'Segunda — Superior A', focus: 'Peito, costas, ombros e braços', exercises: [['Supino reto', '3 x 6–10'], ['Remada baixa', '3 x 8–12'], ['Desenvolvimento com halteres', '3 x 8–12'], ['Rosca martelo', '2 x 10–15'], ['Tríceps corda', '2 x 10–15']] },
      { day: 'Terça — Inferior A', focus: 'Quadríceps, posteriores e glúteos', exercises: [['Agachamento livre', '3 x 6–10'], ['Stiff', '3 x 8–12'], ['Leg press', '3 x 10–15'], ['Mesa flexora', '2 x 10–15'], ['Elevação de panturrilhas em pé na máquina', '3 x 10–15']] },
      { day: 'Quinta — Superior B', focus: 'Costas, peito, deltoides e braços', exercises: [['Pulley costas / puxada alta', '3 x 8–12'], ['Supino inclinado', '3 x 8–12'], ['Remada serrote', '3 x 8–12 por lado'], ['Elevação lateral com halteres', '3 x 12–20'], ['Rosca direta com barra reta ou W', '2 x 8–12']] },
      { day: 'Sexta — Inferior B', focus: 'Glúteos, posteriores e quadríceps', exercises: [['Elevação pélvica com barra', '3 x 8–12'], ['Agachamento búlgaro', '3 x 8–12 por lado'], ['Levantamento terra romeno', '3 x 8–12'], ['Cadeira extensora', '2 x 12–15'], ['Elevação de panturrilhas sentado na máquina', '3 x 10–15']] }
    ],
    progression: 'Quando atingir o topo da faixa de reps em todas as series com tecnica firme, aumente 2–5% da carga.',
    reference: 'Schoenfeld, Ogborn e Krieger (2017), revisao dose–resposta do volume e hipertrofia.',
    link: 'https://doi.org/10.1080/02640414.2016.1210197'
  },
  {
    id: 'forca',
    label: 'Forca',
    icon: '◆',
    summary: 'Prioriza movimentos compostos, tecnica consistente e descansos mais longos.',
    target: 'Objetivo principal: levantar mais carga com controle',
    prescription: [
      ['Frequencia', 'Pratique cada movimento principal 2–3x por semana'],
      ['Volume', '3–6 series de trabalho por movimento principal'],
      ['Repeticoes', '2–6 nos principais; 6–12 nos acessorios'],
      ['Esforco', 'Mantenha 1–3 repeticoes na reserva; evite falha frequente'],
      ['Descanso', '2–4 min nos compostos e 1–2 min nos acessorios']
    ],
    week: ['Seg: agachamento + pernas', 'Ter: supino + superior', 'Qui: levantamento + posterior', 'Sex: desenvolvimento + costas'],
    workouts: [
      { day: 'Segunda — Agachamento', focus: 'Pernas e core', exercises: [['Agachamento livre', '4 x 3–5'], ['Leg press', '3 x 5–8'], ['Mesa flexora', '3 x 6–10'], ['Prancha abdominal', '3 x 30–45 s']] },
      { day: 'Terça — Supino', focus: 'Peito, ombros e tríceps', exercises: [['Supino reto', '4 x 3–5'], ['Desenvolvimento com barra', '3 x 4–6'], ['Supino fechado', '3 x 6–8'], ['Tríceps corda', '2 x 8–12']] },
      { day: 'Quinta — Terra', focus: 'Posteriores, glúteos e costas', exercises: [['Levantamento terra romeno', '4 x 3–5'], ['Remada curvada', '3 x 5–8'], ['Pulley costas / puxada alta', '3 x 6–10'], ['Elevação pélvica com barra', '3 x 6–10']] },
      { day: 'Sexta — Superior', focus: 'Ombros e costas', exercises: [['Desenvolvimento com halteres', '4 x 4–6'], ['Barra-fixa', '4 x 3–8'], ['Remada baixa', '3 x 6–10'], ['Rosca direta com barra reta ou W', '2 x 8–12']] }
    ],
    progression: 'Use pequenos aumentos de carga. Se a tecnica piorar ou a velocidade cair muito, repita a carga na proxima sessao.',
    reference: 'ACSM (2009), Progression Models in Resistance Training for Healthy Adults.',
    link: 'https://doi.org/10.1249/MSS.0b013e3181915670'
  },
  {
    id: 'gordura',
    label: 'Reduzir gordura',
    icon: '−',
    summary: 'Preserva massa magra com musculacao, atividade diaria e deficit calorico moderado.',
    target: 'Objetivo principal: reduzir gordura mantendo desempenho',
    prescription: [
      ['Musculacao', '2–4 sessoes por semana; mantenha cargas e tecnica'],
      ['Volume', 'Use volume sustentavel; nao transforme toda sessao em circuito exaustivo'],
      ['Cardio', '150–300 min/semana moderado ou 75–150 min vigoroso, conforme tolerancia'],
      ['Atividade', 'Aumente passos e movimento diario antes de adicionar excesso de HIIT'],
      ['Ritmo', 'Busque queda gradual de peso; ajuste comida e atividade pela media semanal']
    ],
    week: ['Seg: corpo inteiro + caminhada', 'Qua: corpo inteiro', 'Sex: corpo inteiro + caminhada', 'Sab: cardio leve opcional'],
    workouts: [
      { day: 'Segunda — Corpo inteiro A', focus: 'Musculação + caminhada leve', exercises: [['Agachamento goblet', '3 x 8–12'], ['Supino máquina', '3 x 8–12'], ['Remada baixa', '3 x 8–12'], ['Elevação pélvica', '2 x 10–15'], ['Caminhada na esteira', '20–30 min']] },
      { day: 'Quarta — Corpo inteiro B', focus: 'Musculação moderada', exercises: [['Leg press', '3 x 10–15'], ['Supino inclinado', '3 x 8–12'], ['Pulley costas / puxada alta', '3 x 8–12'], ['Levantamento terra romeno', '2 x 8–12'], ['Prancha abdominal', '3 x 30–45 s']] },
      { day: 'Sexta — Corpo inteiro A', focus: 'Musculação + caminhada leve', exercises: [['Agachamento goblet', '3 x 8–12'], ['Supino máquina', '3 x 8–12'], ['Remada baixa', '3 x 8–12'], ['Cadeira extensora', '2 x 12–15'], ['Caminhada na esteira', '20–30 min']] }
    ],
    progression: 'Mantenha a performance como indicador. Se cargas, sono e humor cairem por semanas, reduza o deficit ou o volume.',
    reference: 'WHO (2020), Guidelines on physical activity and sedentary behaviour.',
    link: 'https://www.who.int/publications/i/item/9789240015128'
  },
  {
    id: 'hibrido',
    label: 'Treino hibrido',
    icon: '↔',
    summary: 'Combina forca, massa muscular e condicionamento sem deixar uma qualidade dominar as outras.',
    target: 'Objetivo principal: ser forte, resistente e versatil',
    prescription: [
      ['Forca', '2 sessoes com 1–2 movimentos principais em 3–6 reps'],
      ['Hipertrofia', '2 sessoes com acessorios em 6–15 reps'],
      ['Aerobico', '2 sessoes zona moderada de 25–40 min'],
      ['Intensidade', 'Separe cardio intenso e pernas pesadas por varias horas ou dias'],
      ['Recuperacao', 'Reserve pelo menos 1 dia realmente leve por semana']
    ],
    week: ['Seg: forca inferior', 'Ter: aerobico leve', 'Qua: forca superior', 'Qui: descanso', 'Sex: hipertrofia corpo inteiro', 'Sab: cardio ou esporte'],
    workouts: [
      { day: 'Segunda — Força inferior', focus: 'Pernas e glúteos', exercises: [['Agachamento livre', '4 x 3–5'], ['Levantamento terra romeno', '3 x 5–8'], ['Elevação pélvica com barra', '3 x 6–10']] },
      { day: 'Terça — Aeróbico leve', focus: 'Condicionamento', exercises: [['Caminhada na esteira', '25–40 min']] },
      { day: 'Quarta — Força superior', focus: 'Peito e costas', exercises: [['Supino reto', '4 x 3–5'], ['Remada curvada', '4 x 5–8'], ['Desenvolvimento com halteres', '3 x 6–10'], ['Barra-fixa', '3 x 4–8']] },
      { day: 'Sexta — Hipertrofia corpo inteiro', focus: 'Volume moderado', exercises: [['Leg press', '3 x 10–15'], ['Supino inclinado', '3 x 8–12'], ['Remada baixa', '3 x 8–12'], ['Cadeira extensora', '2 x 12–15'], ['Tríceps corda', '2 x 10–15']] }
    ],
    progression: 'Alterne semanas de maior carga e semanas de volume moderado. Registre carga, reps, distancia e percepcao de esforco.',
    reference: 'Fyfe, Bishop e Zacharogiannis (2014), revisao sobre treinamento concorrente.',
    link: 'https://doi.org/10.1007/s40279-014-0162-9'
  },
  {
    id: 'inicio',
    label: 'Iniciante ou retorno',
    icon: '○',
    summary: 'Constroi tecnica, consistencia e tolerancia ao treino antes de buscar complexidade.',
    target: 'Objetivo principal: criar uma base segura e sustentavel',
    prescription: [
      ['Frequencia', '2–3 sessoes de corpo inteiro por semana'],
      ['Volume', '1–3 series por exercicio, com 6–10 exercicios simples'],
      ['Repeticoes', '8–15, parando antes da tecnica se desfazer'],
      ['Esforco', 'Deixe 2–4 repeticoes na reserva nas primeiras semanas'],
      ['Cardio', 'Caminhe ou pedale 20–30 min em dias alternados, se tolerado']
    ],
    week: ['Seg: Corpo inteiro A', 'Qua: Corpo inteiro B', 'Sex: Corpo inteiro A', 'Semana seguinte: B / A / B'],
    workouts: [
      { day: 'Segunda — Corpo inteiro A', focus: 'Pernas, peito e costas', exercises: [['Agachamento goblet', '2 x 8–12'], ['Supino máquina', '2 x 8–12'], ['Remada baixa', '2 x 8–12'], ['Elevação pélvica', '2 x 10–15'], ['Prancha abdominal', '2 x 20–40 s']] },
      { day: 'Quarta — Corpo inteiro B', focus: 'Pernas, ombros e costas', exercises: [['Leg press', '2 x 8–12'], ['Desenvolvimento com halteres', '2 x 8–12'], ['Pulley costas / puxada alta', '2 x 8–12'], ['Cadeira extensora', '2 x 10–15'], ['Tríceps corda', '2 x 10–15']] },
      { day: 'Sexta — Corpo inteiro A', focus: 'Repita A e pratique a técnica', exercises: [['Agachamento goblet', '2 x 8–12'], ['Supino máquina', '2 x 8–12'], ['Remada baixa', '2 x 8–12'], ['Elevação pélvica', '2 x 10–15'], ['Prancha abdominal', '2 x 20–40 s']] }
    ],
    progression: 'Adicione poucas repeticoes ou uma pequena carga por vez. A regularidade vale mais do que trocar de programa toda semana.',
    reference: 'ACSM (2009), modelos de progressao para adultos saudaveis.',
    link: 'https://doi.org/10.1249/MSS.0b013e3181915670'
  }
];