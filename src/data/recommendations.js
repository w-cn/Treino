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
    week: ['Seg: corpo inteiro A', 'Qua: corpo inteiro B', 'Sex: corpo inteiro A', 'Semana seguinte: B / A / B'],
    progression: 'Adicione poucas repeticoes ou uma pequena carga por vez. A regularidade vale mais do que trocar de programa toda semana.',
    reference: 'ACSM (2009), modelos de progressao para adultos saudaveis.',
    link: 'https://doi.org/10.1249/MSS.0b013e3181915670'
  }
];