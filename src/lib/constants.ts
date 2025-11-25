import { RideCategoryInfo } from './types';

// Categorias de viagem do Uber Brasil 2025
export const RIDE_CATEGORIES: RideCategoryInfo[] = [
  {
    id: 'uberx',
    name: 'UberX',
    description: 'Viagens econômicas para o dia a dia',
    icon: '🚗',
    priceMultiplier: 1.0,
    capacity: 4,
    features: ['Econômico', 'Carros populares']
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Carros com mais espaço e conforto',
    icon: '✨',
    priceMultiplier: 1.3,
    capacity: 4,
    features: ['Ar-condicionado', 'Carros novos', 'Motoristas top']
  },
  {
    id: 'black',
    name: 'Black',
    description: 'Viagens premium com motoristas profissionais',
    icon: '🎩',
    priceMultiplier: 2.0,
    capacity: 4,
    features: ['Carros premium', 'Motoristas executivos', 'Água mineral']
  },
  {
    id: 'xl',
    name: 'UberXL',
    description: 'Carros grandes para até 6 passageiros',
    icon: '🚙',
    priceMultiplier: 1.5,
    capacity: 6,
    features: ['Até 6 pessoas', 'Espaço extra', 'Bagagens']
  },
  {
    id: 'flash',
    name: 'Flash',
    description: 'Entregas rápidas de moto ou carro',
    icon: '⚡',
    priceMultiplier: 0.8,
    capacity: 1,
    features: ['Entrega rápida', 'Moto ou carro', 'Até 10kg']
  },
  {
    id: 'moto',
    name: 'Moto',
    description: 'Viagens rápidas de moto',
    icon: '🏍️',
    priceMultiplier: 0.6,
    capacity: 1,
    features: ['Mais rápido', 'Capacete incluso', 'Trânsito']
  },
  {
    id: 'taxi',
    name: 'Taxi',
    description: 'Táxis credenciados',
    icon: '🚕',
    priceMultiplier: 1.1,
    capacity: 4,
    features: ['Taxímetro', 'Nota fiscal', 'Profissionais']
  },
  {
    id: 'electric',
    name: 'Electric',
    description: 'Carros elétricos sustentáveis',
    icon: '🔋',
    priceMultiplier: 1.4,
    capacity: 4,
    features: ['Zero emissões', 'Silencioso', 'Sustentável']
  },
  {
    id: 'reserve',
    name: 'Reserve',
    description: 'Agende com até 90 dias de antecedência',
    icon: '📅',
    priceMultiplier: 1.2,
    capacity: 4,
    features: ['Agendamento', 'Garantia', 'Preço fixo']
  },
  {
    id: 'shuttle',
    name: 'Shuttle',
    description: 'Compartilhe a viagem e economize',
    icon: '🚐',
    priceMultiplier: 0.7,
    capacity: 3,
    features: ['Compartilhado', 'Econômico', 'Rota otimizada']
  }
];

// Cores do Uber Brasil
export const UBER_COLORS = {
  primary: '#000000',
  secondary: '#FFFFFF',
  accent: '#06C167', // Verde Uber
  danger: '#E11900',
  warning: '#FFC043',
  info: '#276EF1',
  gray: {
    50: '#F6F6F6',
    100: '#EEEEEE',
    200: '#E2E2E2',
    300: '#CBCBCB',
    400: '#AFAFAF',
    500: '#757575',
    600: '#545454',
    700: '#333333',
    800: '#1F1F1F',
    900: '#141414'
  }
};

// Métodos de pagamento
export const PAYMENT_METHODS = [
  { id: 'pix', name: 'PIX', icon: '💳', description: 'Instantâneo e seguro' },
  { id: 'credit_card', name: 'Cartão de Crédito', icon: '💳', description: 'Visa, Master, Elo' },
  { id: 'debit_card', name: 'Cartão de Débito', icon: '💳', description: 'Débito automático' },
  { id: 'cash', name: 'Dinheiro', icon: '💵', description: 'Pague em espécie' },
  { id: 'wallet', name: 'Saldo Uber', icon: '👛', description: 'Use seu saldo' },
  { id: 'uber_one', name: 'Uber One', icon: '⭐', description: 'Assinatura com descontos' }
];

// Configurações de mapa
export const MAP_CONFIG = {
  defaultCenter: { lat: -23.5505, lng: -46.6333 }, // São Paulo
  defaultZoom: 15,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Mensagens do sistema
export const MESSAGES = {
  auth: {
    welcome: 'Bem-vindo ao Uber',
    loginSuccess: 'Login realizado com sucesso!',
    loginError: 'Erro ao fazer login. Tente novamente.',
    signupSuccess: 'Cadastro realizado com sucesso!',
    signupError: 'Erro ao criar conta. Tente novamente.'
  },
  trip: {
    requesting: 'Procurando motorista...',
    accepted: 'Motorista a caminho!',
    arriving: 'Motorista chegando...',
    inProgress: 'Viagem em andamento',
    completed: 'Viagem concluída!',
    cancelled: 'Viagem cancelada'
  },
  driver: {
    online: 'Você está online',
    offline: 'Você está offline',
    newRequest: 'Nova solicitação de corrida!',
    tripStarted: 'Viagem iniciada',
    tripCompleted: 'Viagem concluída!'
  }
};

// Features de segurança
export const SAFETY_FEATURES = [
  {
    id: 'share_trip',
    name: 'Compartilhar viagem',
    description: 'Compartilhe sua localização em tempo real',
    icon: '📍'
  },
  {
    id: 'trusted_contacts',
    name: 'Contatos de confiança',
    description: 'Adicione contatos para emergências',
    icon: '👥'
  },
  {
    id: 'emergency_button',
    name: 'Botão de emergência',
    icon: '🚨',
    description: 'Ligue para 190 rapidamente'
  },
  {
    id: 'audio_recording',
    name: 'Gravação de áudio',
    description: 'Grave áudio criptografado da viagem',
    icon: '🎙️'
  },
  {
    id: 'prefer_female_driver',
    name: 'Preferência motorista mulher',
    description: 'Solicite motorista mulher quando disponível',
    icon: '👩'
  },
  {
    id: 'route_deviation',
    name: 'Detecção de desvio',
    description: 'Alerta se motorista desviar da rota',
    icon: '🛣️'
  }
];
