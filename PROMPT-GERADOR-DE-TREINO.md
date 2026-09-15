# Prompt para gerar treino importavel

Copie todo este documento e envie ao ChatGPT. Depois, preencha a secao `MINHAS PREFERENCIAS` antes de enviar.

## Instrucoes para o ChatGPT

Voce e um planejador de treinos. Monte um treino baseado nas preferencias preenchidas abaixo, usando exclusivamente os musculos e os IDs de exercicios deste documento.

Regras obrigatorias:

1. Gere somente um JSON valido. Nao escreva explicacoes antes ou depois do JSON.
2. Use exatamente os dias `Segunda`, `Terca`, `Quarta`, `Quinta`, `Sexta`, `Sabado` e `Domingo`.
3. Use somente os IDs listados neste documento. Nunca invente ou altere um ID.
4. O campo `muscle` deve corresponder ao grupo muscular do exercicio.
5. Use `done: false` em todos os exercicios.
6. Use `weight`, `actualReps` e `note` como strings vazias.
7. O campo `sets` deve ser uma string numerica, por exemplo `3`.
8. O campo `targetReps` deve ser uma string, por exemplo `8-12`.
9. O campo `rest` deve ser uma string com o descanso em segundos, por exemplo `90`.
10. Preencha somente os dias solicitados. Os demais dias devem ficar com `muscles: []` e `exercises: []`.
11. Nao inclua GIFs, fontes, descricoes, equipamentos ou historico no JSON.
12. Nao repita o mesmo exercicio dentro do mesmo dia.
13. Antes de responder, confira se todos os IDs usados existem neste documento.
14. Considere nivel, objetivo, tempo, restricoes e preferencias informados.
15. Diferencie exercicios principais de alternativas na sua analise, mas no JSON inclua apenas os exercicios que realmente devem ficar na ficha.
16. Nao coloque oito exercicios obrigatoriamente no mesmo dia. Use volume coerente com objetivo, nivel e tempo disponivel.

## Minhas preferencias

Preencha os campos abaixo:

```text
OBJETIVO:
Ex.: hipertrofia, ganhar massa, forca, reduzir gordura, treino hibrido ou condicionamento.

NIVEL:
Ex.: iniciante, retorno, intermediario ou avancado.

DIAS DISPONIVEIS:
Ex.: Segunda, Terca, Quinta e Sexta.

DURACAO DE CADA TREINO:
Ex.: 60 minutos.

IDADE E SEXO, SE QUISER INFORMAR:

ALTURA E PESO, SE QUISER INFORMAR:

RESTRICOES OU DORES:
Ex.: evitar agachamento, dor no ombro, sem impacto, nenhuma.

EQUIPAMENTOS DISPONIVEIS:
Ex.: academia completa, halteres, barra, maquinas, casa.

PREFERENCIAS:
Ex.: mais maquinas, mais pesos livres, incluir cardio, treinos curtos.

EXERCICIOS OBRIGATORIOS:
Ex.: Supino reto, Remada baixa.

EXERCICIOS A EVITAR:
Ex.: Levantamento terra, nenhum.

OBSERVACOES:

MINHA SOLICITACAO:
Monte minha ficha de treino e gere somente o JSON de importacao.
```

## Musculos permitidos

Use somente estes valores no campo `muscles` e no campo `muscle`:

```text
Biceps
Triceps
Peito
Deltoides
Costas
Abdomen
Pernas
Panturrilhas
Trapezio
Antebraco
Gluteos
Cardio
```

Na aplicacao, os nomes aparecem com acentos. Se o JSON for rejeitado por causa de acentos, use exatamente os nomes exibidos na aplicacao: `Bíceps`, `Tríceps`, `Abdômen`, `Trapézio`, `Antebraço` e `Glúteos`.

## Catalogo de exercicios e IDs

Use o ID da esquerda exatamente como esta escrito.

### Biceps

```text
i-ceps-osca-direta-com-barra-reta-o = Rosca direta com barra reta ou W
i-ceps-osca-simlta-nea = Rosca simultânea
i-ceps-osca-direta-na-polia = Rosca direta na polia
i-ceps-osca-concentrada = Rosca concentrada
i-ceps-osca-inclinada = Rosca inclinada
i-ceps-osca-spider = Rosca spider
i-ceps-osca-alternada = Rosca alternada
i-ceps-hin-p = Chin up
i-ceps-osca-cott = Rosca Scott
i-ceps-osca-martelo = Rosca martelo
i-ceps-osca-arrastada-drag-crl = Rosca arrastada (drag curl)
i-ceps-osca-ottman = Rosca Zottman
```

### Triceps

```text
ri-ceps-ri-ceps-corda = Tríceps corda
ri-ceps-ri-ceps-rance-s = Tríceps francês
ri-ceps-ri-ceps-com-barra-reta-o = Tríceps com barra reta ou W
ri-ceps-pino-echado = Supino fechado
ri-ceps-ri-ceps-invertido = Tríceps invertido
ri-ceps-aralelas = Paralelas
ri-ceps-lexa-o-diamante = Flexão diamante
ri-ceps-ri-ceps-banco = Tríceps banco
ri-ceps-ri-ceps-coice = Tríceps coice
ri-ceps-osca-testa = Rosca testa
```

### Peito

```text
eito-pino-inclinado = Supino inclinado
eito-pino-reto = Supino reto
eito-pino-declinado-canadense = Supino declinado (canadense)
eito-rciixo = Crucifixo
eito-rossover = Crossover
eito-pino-ma-qina = Supino máquina
eito-oador-eck-deck = Voador/Peck deck
eito-aralelas-para-peito = Paralelas para peito
```

### Deltoides

```text
eltoides-esenvolvimento-com-barra = Desenvolvimento com barra
eltoides-esenvolvimento-com-halteres = Desenvolvimento com halteres
eltoides-esenvolvimento-rnold = Desenvolvimento Arnold
eltoides-levac-a-o-lateral-com-halteres = Elevação lateral com halteres
eltoides-levac-a-o-lateral-na-polia = Elevação lateral na polia
eltoides-levac-a-o-rontal-com-halteres = Elevação frontal com halteres
eltoides-levac-a-o-rontal-com-barra = Elevação frontal com barra
eltoides-rciixo-inverso = Crucifixo inverso
eltoides-ace-pll = Face pull
eltoides-emada-alta-com-barra = Remada alta com barra
eltoides-emada-alta-com-halteres = Remada alta com halteres
```

### Costas

```text
ostas-arra-ixa = Barra-fixa
ostas-lley-costas-pxada-alta = Pulley costas / puxada alta
ostas-emada-crvada = Remada curvada
ostas-emada-serrote = Remada serrote
ostas-lldown = Pulldown
ostas-emada-baixa = Remada baixa
ostas-emada-cavalinho = Remada cavalinho
ostas-arra-ixa-spinada = Barra fixa supinada
ostas-ncolhimento = Encolhimento
ostas-oador-invertido = Voador invertido
ostas-emada-na-ma-qina-articlada = Remada na máquina (articulada)
```

### Abdomen

```text
bdo-men-bdominal-reto-tradicional = Abdominal reto (tradicional)
bdo-men-bdominal-na-polia = Abdominal na polia
bdo-men-bdominal-inra-nas-paralelas = Abdominal infra nas paralelas
bdo-men-rancha-abdominal = Prancha abdominal
bdo-men-bdominal-na-ma-qina = Abdominal na máquina
bdo-men-bdominal-tesora = Abdominal tesoura
bdo-men-bdominal-remador = Abdominal remador
bdo-men-bdominal-inra-solo-abdominal-inverso = Abdominal infra solo (abdominal inverso)
bdo-men-bdominal-crzado = Abdominal cruzado
bdo-men-oda-abdominal = Roda abdominal
bdo-men-bdominal-declinado = Abdominal declinado
bdo-men-bdominal-lateral = Abdominal lateral
bdo-men-bdominal-invertido = Abdominal invertido
```

### Pernas

```text
ernas-gachamento-livre = Agachamento livre
ernas-gachamento-rontal = Agachamento frontal
ernas-gachamento-b-lgaro = Agachamento búlgaro
ernas-eg-press = Leg press
ernas-gachamento-hack = Agachamento hack
ernas-ti = Stiff
ernas-evantamento-terra-romeno = Levantamento terra romeno
ernas-gachamento-goblet = Agachamento goblet
ernas-ndo = Afundo
ernas-levac-a-o-pe-lvica-com-barra = Elevação pélvica com barra
ernas-adeira-extensora = Cadeira extensora
ernas-esa-lexora = Mesa flexora
ernas-evantamento-terra-smo = Levantamento terra sumô
ernas-lexa-o-no-rdica = Flexão nórdica
ernas-ood-morning = Good morning
ernas-gachamento-smo = Agachamento sumô
```

### Panturrilhas

```text
antrrilhas-levac-a-o-de-pantrrilhas-em-pe-na-ma-qina = Elevação de panturrilhas em pé na máquina
antrrilhas-levac-a-o-de-pantrrilhas-no-leg-press = Elevação de panturrilhas no leg press
antrrilhas-levac-a-o-de-pantrrilhas-em-pe-com-peso-do-corpo = Elevação de panturrilhas em pé com peso do corpo
antrrilhas-levac-a-o-de-pantrrilhas-com-barra-livre = Elevação de panturrilhas com barra livre
antrrilhas-levac-a-o-de-pantrrilhas-sentado-na-ma-qina = Elevação de panturrilhas sentado na máquina
antrrilhas-levac-a-o-de-pantrrilhas-sentado-com-halteres = Elevação de panturrilhas sentado com halteres
```

### Trapezio

```text
rape-zio-ncolhimento-por-tra-s-do-corpo = Encolhimento por trás do corpo
rape-zio-emada-alta = Remada alta
rape-zio-evantamento-terra = Levantamento terra
rape-zio-levac-a-o-rontal-em = Elevação frontal em Y
rape-zio-epressa-o-escaplar-na-polia-alta = Depressão escapular na polia alta
```

### Antebraco

```text
ntebrac-o-osca-pnho = Rosca punho
ntebrac-o-osca-pnho-invertida = Rosca punho invertida
ntebrac-o-spensa-o-na-barra-dead-hang = Suspensão na barra (dead hang)
ntebrac-o-osca-inversa = Rosca inversa
ntebrac-o-olo-de-pnho = Rolo de punho
```

### Gluteos

```text
l-teos-assada = Passada
l-teos-levac-a-o-pe-lvica = Elevação pélvica
l-teos-xtensa-o-do-qadril-na-polia = Extensão do quadril na polia
```

### Cardio

```text
cardio-walking-on-incline-treadmill = Caminhada na esteira
cardio-run = Corrida
cardio-stationary-bike-walk = Bicicleta ergométrica
cardio-walk-elliptical-cross-trainer = Elíptico
cardio-walking-on-stepmill = Escada ergométrica
cardio-jump-rope = Pular corda
```

## Formato obrigatorio da resposta

A resposta deve ser somente um JSON neste formato:

```json
{
  "version": 1,
  "days": {
    "Segunda": {
      "muscles": ["Peito", "Tríceps"],
      "exercises": [
        {
          "id": "eito-pino-reto",
          "muscle": "Peito",
          "done": false,
          "sets": "3",
          "targetReps": "8-12",
          "weight": "",
          "actualReps": "",
          "rest": "90",
          "note": ""
        }
      ]
    },
    "Terça": { "muscles": [], "exercises": [] },
    "Quarta": { "muscles": [], "exercises": [] },
    "Quinta": { "muscles": [], "exercises": [] },
    "Sexta": { "muscles": [], "exercises": [] },
    "Sábado": { "muscles": [], "exercises": [] },
    "Domingo": { "muscles": [], "exercises": [] }
  },
  "history": []
}
```

## Conferencia antes da importacao

Antes de importar, confira:

- A resposta tem somente JSON, sem tres crases ou texto extra.
- Todos os sete dias existem.
- Cada ID existe neste documento.
- Cada `muscle` corresponde ao grupo do exercicio.
- `done` esta como `false`.
- `history` esta vazio.
- O arquivo foi salvo com extensao `.json`.

Na aplicacao, use **Importar backup** e selecione o arquivo JSON gerado.
