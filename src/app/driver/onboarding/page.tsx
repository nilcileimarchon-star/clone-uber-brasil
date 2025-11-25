'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Car, 
  User, 
  Camera,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

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

interface DocumentStatus {
  cnh: boolean;
  crlv: boolean;
  selfie: boolean;
  antecedentes: boolean;
  carPhoto: boolean;
}

export default function DriverOnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<DocumentStatus>({
    cnh: false,
    crlv: false,
    selfie: false,
    antecedentes: false,
    carPhoto: false
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleFileUpload = (docType: keyof DocumentStatus) => {
    // Simular upload de arquivo
    setDocuments(prev => ({ ...prev, [docType]: true }));
  };

  const allDocumentsUploaded = Object.values(documents).every(status => status);

  const completeOnboarding = () => {
    if (user && allDocumentsUploaded) {
      const updatedUser = { ...user, driverVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      router.push('/driver');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EAED] via-[#F5F5F5] to-[#DADCE0] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com gradiente cinza grafite */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#4A5568] to-[#2D3748] px-6 py-3 rounded-2xl mb-4 shadow-lg border border-[#718096]">
            <Car className="w-10 h-10 text-[#E2E8F0]" />
            <h1 className="text-3xl font-bold text-[#F7FAFC]">Cadastro de Motorista</h1>
          </div>
          <p className="text-[#718096]">Complete seu cadastro para começar a dirigir</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F7FAFC] rounded-3xl shadow-2xl p-8 mb-6 border border-[#CBD5E0]">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s 
                    ? 'bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white' 
                    : 'bg-[#E2E8F0] text-[#A0AEC0]'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-gradient-to-r from-[#4A5568] to-[#2D3748]' : 'bg-[#E2E8F0]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Documentos Pessoais */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6">Documentos Pessoais</h2>
              
              {/* CNH */}
              <div className="border-2 border-dashed border-[#CBD5E0] rounded-xl p-6 hover:border-[#718096] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-[#718096]" />
                    <div>
                      <h3 className="font-semibold text-[#2D3748]">CNH (Carteira de Motorista)</h3>
                      <p className="text-sm text-[#A0AEC0]">Frente e verso em alta qualidade</p>
                    </div>
                  </div>
                  {documents.cnh ? (
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                  ) : (
                    <button
                      onClick={() => handleFileUpload('cnh')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white rounded-lg hover:from-[#2D3748] hover:to-[#1A202C] transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              {/* Selfie */}
              <div className="border-2 border-dashed border-[#CBD5E0] rounded-xl p-6 hover:border-[#718096] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Camera className="w-8 h-8 text-[#718096]" />
                    <div>
                      <h3 className="font-semibold text-[#2D3748]">Selfie com Documento</h3>
                      <p className="text-sm text-[#A0AEC0]">Foto sua segurando a CNH</p>
                    </div>
                  </div>
                  {documents.selfie ? (
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                  ) : (
                    <button
                      onClick={() => handleFileUpload('selfie')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white rounded-lg hover:from-[#2D3748] hover:to-[#1A202C] transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              {/* Antecedentes */}
              <div className="border-2 border-dashed border-[#CBD5E0] rounded-xl p-6 hover:border-[#718096] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-[#718096]" />
                    <div>
                      <h3 className="font-semibold text-[#2D3748]">Antecedentes Criminais</h3>
                      <p className="text-sm text-[#A0AEC0]">Certidão negativa atualizada</p>
                    </div>
                  </div>
                  {documents.antecedentes ? (
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                  ) : (
                    <button
                      onClick={() => handleFileUpload('antecedentes')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white rounded-lg hover:from-[#2D3748] hover:to-[#1A202C] transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!documents.cnh || !documents.selfie || !documents.antecedentes}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white py-4 rounded-xl font-semibold hover:from-[#2D3748] hover:to-[#1A202C] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Documentos do Veículo */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6">Documentos do Veículo</h2>
              
              {/* CRLV */}
              <div className="border-2 border-dashed border-[#CBD5E0] rounded-xl p-6 hover:border-[#718096] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-[#718096]" />
                    <div>
                      <h3 className="font-semibold text-[#2D3748]">CRLV (Documento do Veículo)</h3>
                      <p className="text-sm text-[#A0AEC0]">Certificado de registro atualizado</p>
                    </div>
                  </div>
                  {documents.crlv ? (
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                  ) : (
                    <button
                      onClick={() => handleFileUpload('crlv')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white rounded-lg hover:from-[#2D3748] hover:to-[#1A202C] transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              {/* Foto do Carro */}
              <div className="border-2 border-dashed border-[#CBD5E0] rounded-xl p-6 hover:border-[#718096] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Car className="w-8 h-8 text-[#718096]" />
                    <div>
                      <h3 className="font-semibold text-[#2D3748]">Foto do Veículo</h3>
                      <p className="text-sm text-[#A0AEC0]">4 fotos: frente, traseira, laterais</p>
                    </div>
                  </div>
                  {documents.carPhoto ? (
                    <CheckCircle className="w-6 h-6 text-[#10B981]" />
                  ) : (
                    <button
                      onClick={() => handleFileUpload('carPhoto')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white rounded-lg hover:from-[#2D3748] hover:to-[#1A202C] transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#E2E8F0] text-[#4A5568] py-4 rounded-xl font-semibold hover:bg-[#CBD5E0] transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!documents.crlv || !documents.carPhoto}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A5568] to-[#2D3748] text-white py-4 rounded-xl font-semibold hover:from-[#2D3748] hover:to-[#1A202C] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Revisão e Confirmação */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6">Revisão Final</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Todos os documentos enviados!</h3>
                    <p className="text-sm text-green-700">
                      Seus documentos serão analisados em até 24 horas. Você receberá uma notificação quando a análise for concluída.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#4A5568]">CNH</span>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#4A5568]">Selfie com Documento</span>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#4A5568]">Antecedentes Criminais</span>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#4A5568]">CRLV</span>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[#4A5568]">Fotos do Veículo</span>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Importante</h3>
                    <p className="text-sm text-yellow-700">
                      Certifique-se de que todos os documentos estão legíveis e atualizados. Documentos ilegíveis ou vencidos serão rejeitados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#E2E8F0] text-[#4A5568] py-4 rounded-xl font-semibold hover:bg-[#CBD5E0] transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
                <button
                  onClick={completeOnboarding}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white py-4 rounded-xl font-semibold hover:from-[#059669] hover:to-[#047857] transition-all shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Concluir Cadastro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
