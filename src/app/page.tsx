'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Car, MapPin, Upload } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'passenger' as 'passenger' | 'driver'
  });

  // Carregar logo salva ao montar componente
  useEffect(() => {
    const savedLogo = localStorage.getItem('appLogo');
    if (savedLogo) {
      setLogoImage(savedLogo);
    }
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular autenticação e criar usuário
    const userData = {
      id: Math.random().toString(36).substring(7),
      name: formData.name || 'Usuário',
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      rating: 4.8,
      totalTrips: 0,
      driverVerified: false
    };

    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Redirecionar baseado no role
    if (formData.role === 'driver') {
      router.push('/driver/onboarding');
    } else {
      router.push('/passenger');
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simular login social
    const userData = {
      id: Math.random().toString(36).substring(7),
      name: `Usuário ${provider}`,
      email: `user@${provider}.com`,
      phone: '(11) 99999-9999',
      role: 'passenger' as const,
      rating: 4.8,
      totalTrips: 0,
      driverVerified: false
    };

    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/passenger');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EAED] via-[#F5F5F5] to-[#DADCE0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo com Upload */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4A5568] to-[#2D3748] backdrop-blur-sm px-6 py-3 rounded-2xl mb-4 border border-[#718096] shadow-lg">
            <div className="flex flex-col items-center relative group">
              <div className="relative">
                {logoImage ? (
                  <img 
                    src={logoImage} 
                    alt="Logo" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#A0AEC0]"
                  />
                ) : (
                  <>
                    <MapPin className="w-10 h-10 text-[#E2E8F0]" fill="currentColor" />
                    <Car className="w-6 h-6 text-[#E2E8F0] absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </>
                )}
                
                {/* Botão de Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#4A5568] to-[#2D3748] hover:from-[#2D3748] hover:to-[#1A202C] rounded-full flex items-center justify-center border-2 border-[#718096] transition-all opacity-0 group-hover:opacity-100"
                  title="Fazer upload da logo"
                >
                  <Upload className="w-3 h-3 text-[#E2E8F0]" />
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-[#F7FAFC]">Ostra Mob</h1>
          </div>
          <p className="text-[#4A5568]">Transporte inteligente com IA</p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-[#CBD5E0]">
          {/* Toggle Login/Cadastro */}
          <div className="flex gap-2 mb-6 bg-[#E2E8F0] rounded-full p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                isLogin 
                  ? 'bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white shadow-lg' 
                  : 'text-[#718096] hover:text-[#4A5568]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                !isLogin 
                  ? 'bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white shadow-lg' 
                  : 'text-[#718096] hover:text-[#4A5568]'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#2D3748] mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-[#F7FAFC] border border-[#CBD5E0] text-[#2D3748] rounded-xl focus:ring-2 focus:ring-[#718096] focus:border-transparent transition-all placeholder:text-[#A0AEC0]"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2D3748] mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0AEC0]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#F7FAFC] border border-[#CBD5E0] text-[#2D3748] rounded-xl focus:ring-2 focus:ring-[#718096] focus:border-transparent transition-all placeholder:text-[#A0AEC0]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#2D3748] mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0AEC0]" />
                  <input
                    type="tel"
                    required={!isLogin}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-[#F7FAFC] border border-[#CBD5E0] text-[#2D3748] rounded-xl focus:ring-2 focus:ring-[#718096] focus:border-transparent transition-all placeholder:text-[#A0AEC0]"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2D3748] mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0AEC0]" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#F7FAFC] border border-[#CBD5E0] text-[#2D3748] rounded-xl focus:ring-2 focus:ring-[#718096] focus:border-transparent transition-all placeholder:text-[#A0AEC0]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#2D3748] mb-2">
                  Quero usar como
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'passenger' })}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.role === 'passenger'
                        ? 'border-[#718096] bg-gradient-to-br from-[#4A5568] to-[#2D3748] text-white shadow-lg'
                        : 'border-[#CBD5E0] hover:border-[#718096] text-[#718096]'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Passageiro</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'driver' })}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.role === 'driver'
                        ? 'border-[#718096] bg-gradient-to-br from-[#4A5568] to-[#2D3748] text-white shadow-lg'
                        : 'border-[#CBD5E0] hover:border-[#718096] text-[#718096]'
                    }`}
                  >
                    <Car className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Motorista</div>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white py-4 rounded-xl font-semibold hover:from-[#2D3748] hover:to-[#1A202C] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isLogin ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CBD5E0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#718096]">ou continue com</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="p-3 border border-[#CBD5E0] rounded-xl hover:bg-[#F7FAFC] hover:border-[#718096] transition-all"
            >
              <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="p-3 border border-[#CBD5E0] rounded-xl hover:bg-[#F7FAFC] hover:border-[#718096] transition-all"
            >
              <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                <path fill="#2D3748" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin('phone')}
              className="p-3 border border-[#CBD5E0] rounded-xl hover:bg-[#F7FAFC] hover:border-[#718096] transition-all"
            >
              <Phone className="w-6 h-6 mx-auto text-[#718096]" />
            </button>
          </div>

          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-[#718096] hover:text-[#4A5568] font-medium">
                Esqueceu a senha?
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[#718096]">
          <p>Ao continuar, você concorda com os</p>
          <p>
            <a href="#" className="underline hover:text-[#4A5568] font-medium">Termos de Serviço</a>
            {' e '}
            <a href="#" className="underline hover:text-[#4A5568] font-medium">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}
