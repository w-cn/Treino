# Meu Treino

Aplicativo de ficha de musculação em português, com catálogo de exercícios baseado no [Hipertrofia.org](https://www.hipertrofia.org/blog/). HTML, CSS e JavaScript com módulos nativos, sem dependências de produção.

## Desenvolvimento

Requer Node.js 22 ou superior. Não precisa executar `npm install`.

```sh
npm run dev
```

Abra http://localhost:3000 no navegador. Use sempre o mesmo endereço, porta e perfil para acessar a mesma ficha. O servidor serve apenas arquivos estáticos; os dados do treino não são enviados a ele.

```sh
npm run check       # Verificação de sintaxe
npm test            # Catálogo, validação, migração e servidor
npm run build       # Gera o site estático em dist/
npm run media:audit  # Verifica URLs de imagens e grava media-audit.json
```

## Estrutura

```text
index.html              Estrutura da interface
src/
  app.js                Montagem da ficha e eventos da interface
  data/catalog.js       Catálogo, IDs e fontes dos exercícios
  data/media-overrides.js Demonstrações adicionais e suas fontes
  data/cardio.js         Atividades de cardio e demonstrações
  data/workout.js        Reservas, substituição e criação de exercícios
  data/state.js         Formato, validação e migração da ficha
  services/storage.js   IndexedDB e cópia de recuperação em localStorage
  services/media.js     Tratamento de imagens indisponíveis
  styles/main.css       Estilos e adaptações para celular
public/                 Recursos estáticos locais
server/dev.mjs          Servidor local de arquivos para desenvolvimento
scripts/                Verificação, build e auditoria das imagens
tests/                  Testes automatizados
meu_treino_v5.html       Arquivo original preservado
```

## Dados no navegador

- Ficha e histórico são gravados no IndexedDB `meu-treino`, store `workout`, registro `current`.
- Uma cópia em localStorage permite recuperar alterações caso a aba feche antes de concluir a gravação no IndexedDB.
- O salvamento é automático. O indicador no cabeçalho informa sucesso ou falha.
- A chave antiga `meuTreino.v5.state` é migrada automaticamente quando disponível no mesmo endereço e perfil do navegador. Os IDs antigos foram mantidos para compatibilidade.
- Os botões **Exportar backup** e **Importar backup** transferem a ficha e o histórico em JSON. Um backup inválido é rejeitado antes de substituir a ficha.
- Dados de uma página aberta como `file://` não ficam automaticamente disponíveis em `http://localhost:3000`. Também não há sincronização entre aparelhos ou navegadores.
- Limpar os dados do site remove a ficha. Exporte backups para mantê-la fora do navegador. O armazenamento da ficha não depende do cache de imagens.

## Uso

1. Em **Meu Treino**, abra um dia, marque os músculos e adicione exercícios.
2. Em **Minha Ficha**, edite séries, repetições, carga, descanso e observações.
3. **Concluído** registra o exercício no histórico e o mostra no final da lista. **Desfazer** remove o registro dessa conclusão.
4. **Nova sessão** reabre os exercícios do dia e preserva cargas e histórico.
5. A biblioteca permite pesquisar sem acentos e adicionar exercícios diretamente a um dia.
6. **Exercícios reservas** mostra até 3 alternativas de cada grupo escolhido, sem repetir os exercícios que já estão na ficha. Ao tocar em **Substituir**, escolha qual exercício pendente do mesmo grupo trocar. A quantidade e a posição na ficha são mantidas, assim como séries, repetições e descanso; a carga e as observações são limpas. O histórico anterior permanece salvo. Quando o catálogo daquele grupo está esgotado, a tela informa isso.
7. **Cardio** pode ser escolhido no montador ou na biblioteca. Inclui caminhada na esteira, corrida, bicicleta, elíptico, escada e corda. Preencha o tempo em minutos para habilitar o cronômetro; distância e intensidade são opcionais. As informações são salvas no histórico. Reservas de cardio mantêm o tempo planejado na troca.

A ficha de musculação usa apenas **Reps alvo**. O campo **Reps feitas** foi removido da tela; dados antigos continuam preservados nos backups. Os cartões de reserva respeitam a proporção natural da imagem, sem faixas laterais adicionadas pelo layout.

O cronômetro continua correto ao trocar de aba interna ou deixar o navegador em segundo plano; reinicia ao recarregar a página. A ficha e o histórico permanecem salvos.

## Imagens e fontes

Os 106 exercícios têm GIFs. Foram preenchidas 54 demonstrações ausentes, sendo 53 encontradas nas seções correspondentes dos artigos do Hipertrofia e uma prancha no [FitnessProgramer](https://fitnessprogramer.com/exercise/plank/). Dois links que retornavam 404 foram corrigidos: supino fechado e supino inclinado. A remada articulada usa o [GIF indicado pelo usuário no Tenor](https://tenor.com/view/remada-pronada-maquina-gif-9141890660636150767), com pegada pronada e apoio para o peito. Os seis cardios usam o repositório [ExerciseGymGifsDB](https://github.com/JahelCuadrado/ExerciseGymGifsDB/tree/v1.1.0), fixado na versão v1.1.0.

As imagens são carregadas das fontes externas e precisam de conexão. As novas demonstrações têm link de origem; variações como Smith, barra ou halteres são identificadas quando necessário. Uma falha futura de carregamento exibe uma imagem local de indisponibilidade, sem quebrar o cartão. Os GIFs novos tiveram download de verificação em memória para conferir o formato real, sem manter cópias de terceiros no projeto.

`research/source-images.json` registra as imagens encontradas junto aos títulos das seções; `research/media-verification.json` registra as verificações de formato. `scripts/discover-media.mjs` coleta os candidatos, e `scripts/enrich-media.mjs` associa os nomes e aliases revisados e gera `media-overrides.js`. A auditoria HTTP pode ser repetida com `npm run media:audit`. Ela confirma disponibilidade, não uma revisão técnica completa da execução de todos os movimentos.

## Correções em relação ao HTML original

- Exercícios e lista de seleção recebem IDs corretamente e passam a aparecer.
- A pesquisa do montador filtra os cartões de fato.
- Adição pela biblioteca inclui o grupo muscular no dia.
- A ordem escolhida é preservada; concluídos ficam no final apenas durante a execução.
- Dias abertos no montador não se fecham a cada alteração.
- Séries, repetições alvo e descanso passam a ser editáveis.
- Cronômetros são separados por dia e atualizam os elementos após renderizações.
- Histórico, nova sessão, backup e persistência em IndexedDB implementados.
- Campos maiores, botões com área de toque, quebra de linhas e tratamento de imagens em telas pequenas.

O projeto gera um site estático para hospedagem na raiz de um domínio. Não inclui login, nuvem, sincronização multiusuário ou cache offline do site.
