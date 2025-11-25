'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, User, LogOut, Settings, Menu, X, MapPin, DollarSign, Clock, Star, FileText } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'passenger' | 'driver';
  rating: number;
  totalTrips: number;
  driverVerified?: boolean;
}

export default function DriverPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Se motorista não verificado, redirecionar para onboarding
    if (!parsedUser.driverVerified) {
      router.push('/driver/onboarding');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const switchToPassenger = () => {
    if (user) {
      const updatedUser = { ...user, role: 'passenger' as const };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      router.push('/passenger');
    }
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EAED] via-[#F5F5F5] to-[#DADCE0]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#4A5568] to-[#2D3748] shadow-lg border-b border-[#718096]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="w-8 h-8 text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F7FAFC]">Ostra Mob</h1>
            <span className="text-sm text-[#CBD5E0]">Motorista</span>
          </div>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-[#718096] rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6 text-[#F7FAFC]" /> : <Menu className="w-6 h-6 text-[#F7FAFC]" />}
          </button>
        </div>

        {/* Menu Dropdown */}
        {menuOpen && (
          <div className="absolute right-4 top-16 w-64 bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow-2xl border border-[#CBD5E0] z-50">
            <div className="p-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A5568] to-[#2D3748] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D3748]">{user.name}</p>
                  <p className="text-sm text-[#718096]">Motorista</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button 
                onClick={switchToPassenger}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#EDF2F7] rounded-lg transition-colors text-left"
              >
                <User className="w-5 h-5 text-[#4A5568]" />
                <span className="text-[#2D3748]">Mudar para Passageiro</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#EDF2F7] rounded-lg transition-colors text-left">
                <Settings className="w-5 h-5 text-[#718096]" />
                <span className="text-[#2D3748]">Configurações</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-600">Sair</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mapa e Status */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-2xl shadow-lg overflow-hidden h-[400px] relative border border-[#E2E8F0]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EBF8FF] to-[#BEE3F8] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
                  <p className="text-[#4A5568] font-medium">Mapa interativo aqui</p>
                  <p className="text-sm text-[#718096] mt-2">Sua localização em tempo real</p>
                </div>
              </div>
            </div>

            {/* Toggle Online/Offline */}
            <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-2xl shadow-lg p-6 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2D3748]">Status</h3>
                  <p className="text-sm text-[#718096]">
                    {isOnline ? 'Você está online e disponível' : 'Você está offline'}
                  </p>
                </div>
                <button
                  onClick={toggleOnline}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                    isOnline ? 'bg-[#10B981]' : 'bg-[#CBD5E0]'
                  }`}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                      isOnline ? 'translate-x-12' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas e Ganhos */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#4A5568] to-[#2D3748] rounded-2xl shadow-lg p-6 text-white border border-[#718096]">
              <h2 className="text-xl font-semibold mb-4">Ganhos de Hoje</h2>
              <div className="flex items-baseline gap-2">
                <DollarSign className="w-8 h-8 text-[#10B981]" />
                <span className="text-5xl font-bold">0,00</span>
              </div>
              <p className="text-[#CBD5E0] mt-2">0 corridas completadas</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 border border-[#E2E8F0]">
                <Clock className="w-6 h-6 text-[#3B82F6] mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">{user.totalTrips}</p>
                <p className="text-sm text-[#718096]">Total de Corridas</p>
              </div>
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 border border-[#E2E8F0]">
                <Star className="w-6 h-6 text-[#F59E0B] mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">{user.rating}</p>
                <p className="text-sm text-[#718096]">Avaliação</p>
              </div>
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 border border-[#E2E8F0]">
                <DollarSign className="w-6 h-6 text-[#10B981] mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">R$ 0</p>
                <p className="text-sm text-[#718096]">Esta Semana</p>
              </div>
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 border border-[#E2E8F0]">
                <FileText className="w-6 h-6 text-[#4A5568] mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">0</p>
                <p className="text-sm text-[#718096]">Pendentes</p>
              </div>
            </div>

            {/* Próximas Corridas */}
            <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-2xl shadow-lg p-6 border border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Solicitações</h3>
              <div className="text-center py-8 text-[#718096]">
                <Car className="w-12 h-12 mx-auto mb-3 text-[#CBD5E0]" />
                <p>Nenhuma solicitação no momento</p>
                <p className="text-sm mt-1">Fique online para receber corridas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
