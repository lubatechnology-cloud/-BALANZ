# BALANZ

Controle inteligente de finanças pessoais com captura automática de gastos.

## Features

- **Dashboard** - Visão geral do saldo, receitas e despesas
- **Captura de voz** - Adicione gastos por comando de voz
- **OCR de faturas** - Escaneie recibos e faturas automaticamente
- **Leitura de emails** - Detecte pagamentos via IMAP
- **SMS Android** - Detecte pagamentos via notificações
- **iOS SMS Filter** - ILMessageFilterExtension para iOS
- **Importação CSV** - Importe extratos bancários
- **Relatórios** - Gráficos e análises financeiras
- **Metas** - Defina e acompanhe metas de economia
- **Premium** - Assinatura via RevenueCat

## Stack

- React Native (Expo SDK 52)
- TypeScript
- Firebase (Auth, Firestore, Storage)
- React Navigation
- Zustand (State Management)
- RevenueCat (Subscriptions)

## Setup

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npx expo start

# Build de produção
eas build
```

## Estrutura

```
src/
├── components/      # Componentes reutilizáveis
├── hooks/          # Custom hooks
├── navigation/     # Navegação
├── screens/        # Telas do app
├── services/       # Serviços (Firebase, Auth, etc)
├── store/          # Estado global (Zustand)
├── theme/          # Cores, tipografia, espaçamento
├── types/          # Tipos TypeScript
└── utils/          # Funções auxiliares
```

## Licença

Proprietário - Lubatechnology
