# Changelog — PMS Check-in/Walk-in Modal

Todas as mudanças notáveis neste projeto estão documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.1.0] — 2026-04-01

### Adicionado
- Campo **Idade** na seção de Acompanhantes (habilitado apenas ao selecionar o tipo "Criança", faixa 0–17 anos).
- Coluna **Idade** na tabela de acompanhantes já adicionados.
- Campo **Celular** ao lado de Email na seção de Hospedagem.
- Botões de ação **[+] Novo** e **[✏] Editar** no campo Empresa de Faturamento (espelhando o padrão do campo Titular).
- Seleção de **PDV** como dropdown com as opções: Recepção, Restaurante e Frigobar.
- Badge com o **nome da pensão** selecionada exibido no cabeçalho da seção de Refeições.
- Segunda linha de tarifa para o dia 27/03 na seção de Tarifas.
- Botão **Replicar** por linha na tabela de Tarifas — aplica o valor daquela linha para todos os demais dias.
- Formatação automática de moeda **real-time** no campo de valor das diárias (ex.: `25000` → `250,00`).
- Nome da tarifa selecionada exibido em cada linha da tabela de Tarifas.

### Alterado
- **Seção de Tarifas**: seleção de tarifa (Pensão) movida para ser **única e global** (acima da tabela), em vez de por linha.
- Rótulo "Pensão" renomeado para **"Tarifa"** na seleção global.
- Campos **Data Inicial** e **Data Final** convertidos para `datetime-local` com horários padrão (14:00 e 11:59).
- Resumo financeiro (**Total / Recebido / Em Aberto**) movido do cabeçalho para o **rodapé**, ao lado dos botões de ação, com fonte um pouco maior.
- Layout da linha 1 (Dados da Hospedagem) ajustado: `UH(2) + DataInicial(3) + DataFinal(3) + Diárias(1)` — sem espaços mortos na direita.
- Modal com **85% de zoom** (`scale(0.85)`) para melhor aproveitamento de tela.
- Botão lápis removido da seção de Tarifas (valor agora é editável diretamente no input).

### Removido
- Botões **Expresso** e **Completo** e ícone de configurações do cabeçalho.
- Seletor visual de UH (grid de quartos) substituído por `<select>` padrão, alinhado ao restante do formulário.

---

## [1.0.0] — 2026-03-26

### Adicionado
- Layout inicial do modal de **Check-in / Walk-in**.
- Abas de navegação com ScrollSpy: Hospedagem, Faturamento, Acompanhantes, Tarifas, Recebimentos, Refeições, Veículos, Extras, Pulseiras e Anexos.
- Seção **Faturamento** separada da aba de Hospedagem, contendo: Forma de Pagamento, CNPJ e Empresa de Faturamento.
- Correção do bug de **ScrollSpy** com flag `isScrollingRef` para evitar salto de aba durante rolagem programática.
- Tokens de design padronizados com variáveis CSS: Azul Primário (`#0057D9`), Verde Sucesso (`#10B981`) e Vermelho Danger (`#E60000`).
- Grid de 12 colunas de alta densidade para todos os painéis.
