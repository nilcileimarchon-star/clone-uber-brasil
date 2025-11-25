'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Car, Clock, Star, User, LogOut, Settings, Menu, X } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'passenger' | 'driver';
  rating: number;
  totalTrips: number;
}

export default function PassengerPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const switchToDriver = () => {
    if (user) {
      const updatedUser = { ...user, role: 'driver' as const };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      router.push('/driver');
    }
  };

  const requestRide = () => {
    if (!pickup || !destination) {
      alert('Por favor, preencha origem e destino');
      return;
    }
    alert('Procurando motoristas próximos...');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EAED] via-[#F5F5F5] to-[#DADCE0]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#4A5568] to-[#2D3748] shadow-lg border-b border-[#718096]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-[#3B82F6]" />
            <h1 className="text-2xl font-bold text-[#F7FAFC]">Ostra Mob</h1>
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
                  <p className="text-sm text-[#718096]">Passageiro</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button 
                onClick={switchToDriver}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#EDF2F7] rounded-lg transition-colors text-left"
              >
                <Car className="w-5 h-5 text-[#4A5568]" />
                <span className="text-[#2D3748]">Mudar para Motorista</span>
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
          {/* Mapa Simulado */}
          <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-2xl shadow-lg overflow-hidden h-[500px] relative border border-[#E2E8F0]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#EBF8FF] to-[#BEE3F8] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
                <p className="text-[#4A5568] font-medium">Mapa interativo aqui</p>
                <p className="text-sm text-[#718096] mt-2">Integração com Google Maps</p>
              </div>
            </div>
          </div>

          {/* Formulário de Corrida */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-2xl shadow-lg p-6 border border-[#E2E8F0]">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6">Solicitar Corrida</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A5568] mb-2">
                    De onde você está?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#10B981]" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#F7FAFC] border border-[#CBD5E0] text-[#2D3748] rounded-xl focus:ring-2 focus:ring-[#718096] focus:border-transparent transition-all placeholder:text-[#A0AEC0]"
                      placeholder="Endereço de origem"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A5568] mb-2">
                    Para onde vai?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#F7FAFC] border border-[#CBD5E0] text-[#2D3748] rounded-xl focus:ring-2 focus:ring-[#718096] focus:border-transparent transition-all placeholder:text-[#A0AEC0]"
                      placeholder="Endereço de destino"
                    />
                  </div>
                </div>

                <button
                  onClick={requestRide}
                  className="w-full bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-[#F7FAFC] py-4 rounded-xl font-semibold hover:from-[#2D3748] hover:to-[#1A202C] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Buscar Motorista
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 text-center border border-[#E2E8F0]">
                <Clock className="w-6 h-6 text-[#3B82F6] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">{user.totalTrips}</p>
                <p className="text-sm text-[#718096]">Corridas</p>
              </div>
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 text-center border border-[#E2E8F0]">
                <Star className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">{user.rating}</p>
                <p className="text-sm text-[#718096]">Avaliação</p>
              </div>
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-xl shadow p-4 text-center border border-[#E2E8F0]">
                <Car className="w-6 h-6 text-[#4A5568] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#2D3748]">0</p>
                <p className="text-sm text-[#718096]">Ativas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
