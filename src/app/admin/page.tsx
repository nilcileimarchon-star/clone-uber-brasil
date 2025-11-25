'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  DollarSign, 
  Users, 
  Settings, 
  TrendingUp,
  MapPin,
  Clock,
  Ban,
  Percent,
  Gift,
  LogOut,
  Menu,
  X,
  Upload
} from 'lucide-react';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Ride {
  id: string;
  passenger: string;
  driver: string;
  origin: string;
  destination: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  fare: number;
  time: string;
}

interface Driver {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  rating: number;
  trips: number;
  earnings: number;
}

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  reason: string;
  blockedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados dos dados
  const [rides, setRides] = useState<Ride[]>([
    { id: '1', passenger: 'João Silva', driver: 'Carlos Santos', origin: 'Av. Paulista, 1000', destination: 'Rua Augusta, 500', status: 'active', fare: 25.50, time: '10:30' },
    { id: '2', passenger: 'Maria Oliveira', driver: 'Pedro Lima', origin: 'Shopping Iguatemi', destination: 'Aeroporto Congonhas', status: 'completed', fare: 45.00, time: '09:15' },
    { id: '3', passenger: 'Ana Costa', driver: 'Roberto Alves', origin: 'Estação da Luz', destination: 'Parque Ibirapuera', status: 'pending', fare: 18.00, time: '11:00' },
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    { id: '1', name: 'Carlos Santos', status: 'online', rating: 4.8, trips: 1250, earnings: 45000 },
    { id: '2', name: 'Pedro Lima', status: 'busy', rating: 4.9, trips: 980, earnings: 38000 },
    { id: '3', name: 'Roberto Alves', status: 'online', rating: 4.7, trips: 1100, earnings: 42000 },
    { id: '4', name: 'José Ferreira', status: 'offline', rating: 4.6, trips: 850, earnings: 32000 },
  ]);

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    { id: '1', name: 'Usuário Teste', email: 'teste@email.com', reason: 'Comportamento inadequado', blockedAt: '2024-01-15' },
  ]);

  const [dynamicRate, setDynamicRate] = useState({
    baseRate: 2.50,
    perKm: 1.80,
    perMinute: 0.50,
    surgeMultiplier: 1.0,
    peakHours: { start: '07:00', end: '09:00' },
  });

  const [promotions, setPromotions] = useState([
    { id: '1', code: 'PRIMEIRA', discount: 50, type: 'percentage', active: true, uses: 150 },
    { id: '2', code: 'FIDELIDADE', discount: 10, type: 'fixed', active: true, uses: 320 },
  ]);

  // Verificar autenticação e carregar logo
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    // Simular verificação de admin
    if (parsedUser.role !== 'admin') {
      // Para demo, permitir qualquer usuário acessar
      parsedUser.role = 'admin';
    }
    setUser(parsedUser);

    // Carregar logo salva
    const savedLogo = localStorage.getItem('appLogo');
    if (savedLogo) {
      setLogoImage(savedLogo);
    }
  }, [router]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoImage(result);
        localStorage.setItem('appLogo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleBlockUser = (email: string, reason: string) => {
    const newBlock: BlockedUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      reason,
      blockedAt: new Date().toISOString().split('T')[0],
    };
    setBlockedUsers([...blockedUsers, newBlock]);
  };

  const handleUnblockUser = (id: string) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== id));
  };

  const handleUpdateRate = (field: string, value: number | string) => {
    setDynamicRate({ ...dynamicRate, [field]: value });
  };

  const handleTogglePromotion = (id: string) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Estatísticas
  const stats = {
    totalRides: rides.length,
    activeRides: rides.filter(r => r.status === 'active').length,
    onlineDrivers: drivers.filter(d => d.status === 'online').length,
    totalRevenue: rides.reduce((sum, r) => sum + r.fare, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* Header com gradiente cinza grafite */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3 group relative">
              {logoImage ? (
                <img 
                  src={logoImage} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
                />
              ) : (
                <MapPin className="w-8 h-8 text-blue-400" />
              )}
              
              {/* Botão de Upload no Header */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -left-1 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-800 transition-all opacity-0 group-hover:opacity-100"
                title="Fazer upload da logo"
              >
                <Upload className="w-3 h-3 text-white" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              <h1 className="text-2xl font-bold text-white">Ostra Mob Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-300">Administrador</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out mt-[73px] lg:mt-0 shadow-lg
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('rides'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'rides' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Corridas do Dia</span>
            </button>

            <button
              onClick={() => { setActiveTab('drivers'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'drivers' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Car className="w-5 h-5" />
              <span className="font-medium">Motoristas Online</span>
            </button>

            <button
              onClick={() => { setActiveTab('revenue'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'revenue' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Faturamento</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Ban className="w-5 h-5" />
              <span className="font-medium">Bloqueio de Usuários</span>
            </button>

            <button
              onClick={() => { setActiveTab('rates'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'rates' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Percent className="w-5 h-5" />
              <span className="font-medium">Taxa Dinâmica</span>
            </button>

            <button
              onClick={() => { setActiveTab('promotions'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'promotions' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium">Promoções</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Corridas Hoje</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRides}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Corridas Ativas</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeRides}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Clock className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Motoristas Online</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stats.onlineDrivers}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Car className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Faturamento Hoje</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        R$ {stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h3>
                <div className="space-y-4">
                  {rides.slice(0, 5).map(ride => (
                    <div key={ride.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          ride.status === 'active' ? 'bg-green-500' :
                          ride.status === 'completed' ? 'bg-blue-500' :
                          ride.status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-800">{ride.passenger}</p>
                          <p className="text-sm text-gray-600">{ride.origin} → {ride.destination}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">R$ {ride.fare.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{ride.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Corridas do Dia */}
          {activeTab === 'rides' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Corridas do Dia</h2>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Passageiro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Motorista</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Origem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Destino</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Horário</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rides.map(ride => (
                        <tr key={ride.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">#{ride.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{ride.passenger}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{ride.driver}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{ride.origin}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{ride.destination}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              ride.status === 'active' ? 'bg-green-100 text-green-700' :
                              ride.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              ride.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {ride.status === 'active' ? 'Em andamento' :
                               ride.status === 'completed' ? 'Concluída' :
                               ride.status === 'pending' ? 'Pendente' :
                               'Cancelada'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">R$ {ride.fare.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{ride.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Motoristas Online */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Motoristas Online</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map(driver => (
                  <div key={driver.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-500">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{driver.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-gray-600">{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        driver.status === 'online' ? 'bg-green-100 text-green-700' :
                        driver.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {driver.status === 'online' ? 'Online' :
                         driver.status === 'busy' ? 'Ocupado' :
                         'Offline'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Corridas</span>
                        <span className="font-semibold text-gray-800">{driver.trips}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ganhos</span>
                        <span className="font-semibold text-green-600">R$ {driver.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faturamento */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Faturamento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Hoje</p>
                  <p className="text-3xl font-bold text-gray-800">R$ {stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-green-600 mt-2">+12% vs ontem</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Esta Semana</p>
                  <p className="text-3xl font-bold text-gray-800">R$ 2.450,00</p>
                  <p className="text-sm text-green-600 mt-2">+8% vs semana passada</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Este Mês</p>
                  <p className="text-3xl font-bold text-gray-800">R$ 8.920,00</p>
                  <p className="text-sm text-green-600 mt-2">+15% vs mês passado</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhamento por Categoria</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Corridas Normais</span>
                      <span className="text-sm font-semibold text-gray-800">R$ 1.850,00 (65%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Corridas Premium</span>
                      <span className="text-sm font-semibold text-gray-800">R$ 850,00 (30%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Taxas de Cancelamento</span>
                      <span className="text-sm font-semibold text-gray-800">R$ 142,00 (5%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bloqueio de Usuários */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Bloqueio de Usuários</h2>
                <button
                  onClick={() => {
                    const email = prompt('Email do usuário:');
                    const reason = prompt('Motivo do bloqueio:');
                    if (email && reason) {
                      handleBlockUser(email, reason);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Ban className="w-5 h-5" />
                  Bloquear Usuário
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Motivo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {blockedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.reason}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.blockedAt}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleUnblockUser(user.id)}
                              className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              Desbloquear
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Taxa Dinâmica */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Configuração de Taxa Dinâmica</h2>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Tarifas Base</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarifa Base (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={dynamicRate.baseRate}
                      onChange={(e) => handleUpdateRate('baseRate', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Por Quilômetro (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={dynamicRate.perKm}
                      onChange={(e) => handleUpdateRate('perKm', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Por Minuto (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={dynamicRate.perMinute}
                      onChange={(e) => handleUpdateRate('perMinute', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Multiplicador de Demanda
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dynamicRate.surgeMultiplier}
                      onChange={(e) => handleUpdateRate('surgeMultiplier', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-1">1.0 = normal, 2.0 = dobro do preço</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Exemplo de Cálculo</h4>
                  <p className="text-sm text-gray-700">
                    Corrida de 10km, 20 minutos: <br />
                    Base: R$ {dynamicRate.baseRate.toFixed(2)} + 
                    Distância: R$ {(dynamicRate.perKm * 10).toFixed(2)} + 
                    Tempo: R$ {(dynamicRate.perMinute * 20).toFixed(2)} = 
                    <span className="font-bold"> R$ {(dynamicRate.baseRate + (dynamicRate.perKm * 10) + (dynamicRate.perMinute * 20)).toFixed(2)}</span>
                    {dynamicRate.surgeMultiplier > 1 && (
                      <span> × {dynamicRate.surgeMultiplier} (demanda alta) = 
                        <span className="font-bold"> R$ {((dynamicRate.baseRate + (dynamicRate.perKm * 10) + (dynamicRate.perMinute * 20)) * dynamicRate.surgeMultiplier).toFixed(2)}</span>
                      </span>
                    )}
                  </p>
                </div>

                <button className="mt-6 w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg">
                  Salvar Configurações
                </button>
              </div>
            </div>
          )}

          {/* Promoções */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Promoções</h2>
                <button
                  onClick={() => {
                    const code = prompt('Código da promoção:');
                    const discount = prompt('Valor do desconto:');
                    if (code && discount) {
                      setPromotions([...promotions, {
                        id: Date.now().toString(),
                        code: code.toUpperCase(),
                        discount: parseFloat(discount),
                        type: 'percentage',
                        active: true,
                        uses: 0
                      }]);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-colors"
                >
                  <Gift className="w-5 h-5" />
                  Nova Promoção
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.map(promo => (
                  <div key={promo.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-5 h-5 text-gray-600" />
                          <h3 className="font-bold text-lg text-gray-800">{promo.code}</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-700">
                          {promo.type === 'percentage' ? `${promo.discount}%` : `R$ ${promo.discount}`}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {promo.type === 'percentage' ? 'de desconto' : 'de desconto fixo'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePromotion(promo.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          promo.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {promo.active ? 'Ativa' : 'Inativa'}
                      </button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Usos</span>
                        <span className="font-semibold text-gray-800">{promo.uses}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
