# Hotel PMS - Módulo de Check-in (Pixel Perfect) teste

Bem-vindo ao repositório do **Módulo de Check-in do Sistema Hotel PMS**. Este projeto foi desenvolvido com foco em alta performance, UX/UI impecável e 100% de responsividade (desde desktops até dispositivos móveis compactos).

## 🚀 Tecnologias Integradas

- **Framework Core**: React v18 + Vite
- **Roteamento**: React Router DOM
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v3.4 + TailwindCSS Animate
- **Ícones**: Lucide React
- **Componentes UI**: Componentes exclusivos, estruturados inspirados no Shadcn UI / Radix UI.
- **Requisições de Status**: TanStack React Query

## 🎨 Principais Funcionalidades Implementadas

* **Formulário Dinâmico e Responsivo**: Interfaces remodeladas com `Tailwind CSS`, utilizando a matriz do Grid Dinâmico (`col-span-12` flexível para telas menores).
* **Gestão de Hóspedes (Walk-in)**: Janela de configuração modular capaz de suportar tanto "Pessoa Física" quanto "Pessoa Jurídica".
* **Módulo Nativo de Recebimentos**: Ferramenta alocada nativamente em abas (`Dinheiro`, `Cartão`, `Outros`, `Conta Hóspede`, `Depósito`), sem necessidade de popups.
* **Validações de Input em Tempo Real**: Tratamentos na digitação de moedas (formatCurrency) e detecção instantânea de valores errôneos (como bloqueio a recebimentos zerados com feedbacks em vermelho na interface).

## 📦 Como Instalar e Rodar o Projeto

1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. Clone o repositório atual e abra no seu terminal.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Para gerar a build de produção:
   ```bash
   npm run build
   ```

## 📱 Responsividade 

Toda a arquitetura deste projeto (tanto os modais complexos de "Nova UH", quanto os blocos extensos do Faturamento e Extras) estão preparados para rodar em dispositivos móveis. As tabelas expandem de forma horizontal com *overflow invisível*, os inputs de digitação se agrupam na vertical (`flex-col`), e o `footer` que flutua a tela ajusta seus botões interativamente.
