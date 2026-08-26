# Segunda Sagrada — Regulamento do Motor

> Especificação funcional do funcionamento integrado de Simples, Duplas, Geral, Agenda, Sugestões e Sorteio.
>
> Este documento deve ser tratado como referência de negócio do aplicativo. Alterações futuras no motor devem manter este regulamento sincronizado com o código.

## 1. Estrutura da temporada

A temporada trabalha com até 10 atletas e duas modalidades competitivas: Simples e Duplas.

### Simples
- Todos contra todos.
- Cada par de atletas possui um confronto oficial.
- Com 10 atletas, o universo completo possui 45 partidas.

### Duplas
- Universo fechado de 20 confrontos oficiais.
- As partidas seguem uma grade predeterminada pelo motor.
- Cada confronto contém duas duplas de dois atletas.
- A grade busca distribuir parcerias e confrontos ao longo da temporada, em vez de criar quatro jogadores aleatórios a cada partida.

### Geral
O Geral não é uma terceira modalidade. Ele consolida individualmente o desempenho obtido por cada atleta em Simples e Duplas.

## 2. Motor de Simples

Cada partida ocorre entre dois atletas da grade oficial.

Ao registrar um resultado, o motor atualiza individualmente:
- partidas disputadas;
- vitórias;
- derrotas;
- games vencidos;
- games sofridos;
- saldo de games;
- pontuação.

O confronto realizado deixa de pertencer ao universo de confrontos pendentes.

### Pontuação de Simples
A fórmula implementada parte de:
- vencedor: 10 pontos-base;
- perdedor: 6 pontos-base;
- soma-se a quantidade de games vencidos pelo atleta, respeitando os limites previstos pelo motor.

Assim, a pontuação combina resultado da partida e desempenho em games.

### Match tie-break
Quando aplicável, o match tie-break determina o vencedor, mas possui tratamento específico para não distorcer o saldo normal de games.

## 3. Motor de Duplas

Duplas não funciona como um sorteio irrestrito de quatro pessoas.

Existe uma grade oficial de 20 confrontos. O mesmo template é utilizado pelo módulo de Duplas e pelo Organizador/Sorteio para identificar quais partidas ainda podem ocorrer.

Cada partida possui:
- Dupla A;
- Dupla B;
- Set 1;
- Set 2;
- Match tie-break quando os sets terminam 1 × 1.

O match tie-break somente deve ser utilizado quando houver empate de 1 × 1 em sets.

### Pontuação individual em Duplas
Embora a partida seja disputada em dupla, o desempenho é atribuído individualmente aos atletas. Os integrantes da dupla vencedora recebem a pontuação correspondente à vitória e os integrantes da dupla derrotada recebem a pontuação correspondente à derrota.

Isso permite consolidar Simples e Duplas no Ranking Geral.

## 4. Ranking Geral

Para cada atleta:

**Pontos Total = Pontos de Simples + Pontos de Duplas**

O Geral também consolida:
- partidas disputadas;
- vitórias;
- derrotas;
- games vencidos;
- games sofridos;
- saldo de games;
- pontos de Simples;
- pontos de Duplas;
- pontos totais.

Não existe uma terceira fonte independente de pontuação no Geral.

## 5. Agenda oficial

Existe uma agenda central de disponibilidade compartilhada pelo ecossistema.

### Quartas-feiras
Nas quartas-feiras, a disponibilidade registrada no Geral é obrigatória para o Organizador/Sorteio.

Se um atleta estiver marcado como indisponível naquela quarta-feira:
- aparece como indisponível no Organizador;
- não pode ser selecionado;
- fica automaticamente fora do universo do sorteio daquela data.

### Outros dias da semana
Quando a data escolhida não é quarta-feira, a indisponibilidade cadastrada no calendário oficial do Geral não bloqueia o atleta.

## 6. Motor de confrontos pendentes

O Organizador não sorteia nomes sem contexto. Antes de qualquer sorteio, reconstrói o universo de partidas elegíveis.

### Simples
O motor considera:
1. grade oficial de confrontos;
2. resultados já realizados;
3. IDs das partidas;
4. pares de adversários que já se enfrentaram.

Tudo que já ocorreu é removido do universo elegível.

Existe proteção tanto por ID quanto pelo par de atletas. Portanto, um confronto já realizado não deve reaparecer apenas por eventual divergência de identificador.

### Duplas
O motor recria os 20 confrontos oficiais da grade e remove aqueles já registrados como realizados.

O sorteio de Duplas escolhe entre confrontos oficiais pendentes; não deve inventar uma nova partida fora da grade competitiva.

## 7. Prioridade por quantidade de jogos

O Organizador mantém contadores separados por modalidade:
- quantidade de partidas de Simples disputadas por atleta;
- quantidade de partidas de Duplas disputadas por atleta.

A prioridade de distribuição é específica da modalidade:
- quem tem menos Simples deve ser favorecido na alocação de Simples;
- quem tem menos Duplas deve ser favorecido na alocação de Duplas.

O objetivo é reduzir desequilíbrios de participação ao longo da temporada.

## 8. Sorteio não é aleatoriedade pura

A sacolinha é a interface visual de um otimizador com componente aleatório.

O algoritmo primeiro procura soluções válidas segundo as restrições da competição. Entre os critérios avaliados estão:
- composição solicitada;
- quantidade de atletas efetivamente utilizados;
- quantidade de partidas viáveis;
- equilíbrio da distribuição de jogos.

A aleatoriedade atua somente depois das restrições e prioridades, inclusive como desempate entre soluções equivalentes.

**As regras vêm antes da sorte.**

## 9. Seleção manual dos atletas

O Organizador apresenta os atletas oficiais e permite selecionar quem participará da rodada.

Existem duas camadas:
1. disponibilidade obrigatória, quando aplicável;
2. seleção voluntária do usuário para aquela rodada.

Nas quartas-feiras, atletas oficialmente indisponíveis ficam desabilitados. Os demais podem ser marcados ou desmarcados pelo usuário.

## 10. Composição da rodada

O usuário pode escolher:
- Só Simples;
- Só Duplas;
- Simples + Duplas.

### Capacidade matemática
- cada partida de Simples utiliza 2 atletas;
- cada partida de Duplas utiliza 4 atletas.

Para uma composição com `S` partidas de Simples e `D` partidas de Duplas:

`2 × S + 4 × D <= número de atletas selecionados`

O aplicativo oferece somente composições matematicamente compatíveis com a quantidade de atletas selecionados.

A capacidade matemática, porém, não garante que existam confrontos oficiais pendentes suficientes. Depois dessa etapa, o motor ainda valida a grade competitiva.

## 11. Não sobreposição na mesma rodada

Na montagem de uma composição, o motor controla os atletas já utilizados.

Um atleta não deve ocupar dois confrontos diferentes na mesma composição sorteada. Em especial, numa rodada mista, o mesmo atleta não deve ser escalado simultaneamente em Simples e Duplas.

A mesma filosofia é utilizada nas sugestões automáticas do Geral.

## 12. Quando a composição exata não é possível

Pode existir quantidade suficiente de atletas, mas não existir combinação competitiva válida por motivos como:
- confrontos já realizados;
- grade de Duplas já consumida;
- partidas pendentes que compartilham os mesmos atletas;
- indisponibilidade de atletas necessários.

O motor não deve fabricar partidas inválidas. Ele procura a melhor solução possível dentro das regras e deve sinalizar quando a composição exata solicitada não puder ser atendida.

## 13. Sugestões automáticas do Geral

A seção Próximos Jogos recomenda confrontos futuros considerando:
- disponibilidade;
- partidas pendentes;
- distribuição de participação;
- conflitos entre Simples e Duplas na mesma data.

Princípio funcional:

**Respeitar disponibilidade, priorizar quem tem menos jogos e não repetir atleta entre Simples e Duplas na mesma data.**

Diferença conceitual:
- **Sugestões:** recomendação automática produzida pelo sistema;
- **Sorteio:** o usuário escolhe data, participantes e composição e solicita ao motor uma solução válida.

## 14. Sorteio não altera a competição

Executar um sorteio não grava automaticamente:
- resultado;
- disponibilidade;
- agenda;
- ranking.

O Organizador é uma ferramenta de planejamento.

Sortear um confronto não significa registrar esse confronto como realizado.

## 15. Fonte de verdade e fluxo lógico

Fluxo conceitual:

```
Dados oficiais da temporada
        ↓
Simples + Duplas + Disponibilidade
        ↓
Motor Geral
        ↓
Ranking / Agenda / Sugestões
        ↓
Motor do Sorteio
        ↓
Remove realizados
        ↓
Aplica disponibilidade
        ↓
Aplica composição
        ↓
Equilibra participação
        ↓
Sorteia entre soluções válidas
```

O Sorteio não deve manter uma competição paralela. Ele consulta o estado oficial da temporada.

## 16. Princípios do motor

### 1. Integridade competitiva
Nunca oferecer como pendente um confronto já realizado.

### 2. Respeito à grade oficial
Simples e Duplas trabalham dentro dos confrontos previstos.

### 3. Disponibilidade
Nas quartas-feiras, o calendário oficial prevalece.

### 4. Não sobreposição
Um atleta não deve ser escalado duas vezes na mesma composição de rodada.

### 5. Equalização
Favorecer quem disputou menos partidas na modalidade relevante.

### 6. Aproveitamento da rodada
Entre soluções válidas, buscar uma composição adequada aos atletas disponíveis e ao formato solicitado.

### 7. Aleatoriedade subordinada
O acaso entra depois das restrições e prioridades.

### 8. Separação entre planejamento e resultado
Sortear não significa registrar partida ou resultado.

### 9. Consolidação individual
O Geral soma a produção individual do atleta em Simples e Duplas.

### 10. Uma temporada, vários módulos
Geral, Simples, Duplas, Agenda, Sugestões e Sorteio são interfaces diferentes sobre o mesmo campeonato.

## 17. Governança desta especificação

Este documento é a referência funcional do motor da Segunda Sagrada.

Toda alteração futura que modifique pontuação, grade, disponibilidade, prioridades, elegibilidade, sugestões ou sorteio deve:
1. verificar impacto neste regulamento;
2. atualizar este documento quando a regra de negócio mudar;
3. evitar divergência entre Simples, Duplas, Geral e Sorteio;
4. preservar uma única fonte de verdade para o estado oficial da temporada.
