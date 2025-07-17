import React from 'react';
import { Shield, Phone, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OccurrenceForm } from '@/components/OccurrenceForm';

const Index = () => {
  const scrollToForm = () => {
    document.getElementById('occurrence-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-primary rounded-full shadow-hero">
                <Shield className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Sistema de Ocorrências
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Relate situações que necessitem atenção das autoridades competentes de forma rápida e segura
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={scrollToForm}
                className="animate-slide-up"
              >
                Registrar Ocorrência
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/admin'}
                className="animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                Acesso Administrativo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center animate-slide-up">
            <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resposta Rápida</h3>
            <p className="text-muted-foreground">
              Registro instantâneo e encaminhamento automático para as autoridades competentes
            </p>
          </div>
          
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
            <p className="text-muted-foreground">
              Seus dados são protegidos e tratados com total confidencialidade
            </p>
          </div>
          
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Atendimento 24h</h3>
            <p className="text-muted-foreground">
              Equipe especializada disponível para atender sua ocorrência a qualquer hora
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-16 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Phone className="h-6 w-6 text-destructive" />
            <h3 className="text-lg font-semibold text-destructive">Emergência?</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Em caso de emergência imediata, ligue para:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <span className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full">
              Polícia: 190
            </span>
            <span className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full">
              Bombeiros: 193
            </span>
            <span className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full">
              SAMU: 192
            </span>
          </div>
        </div>

        {/* Form Section */}
        <div id="occurrence-form" className="animate-slide-up">
          <OccurrenceForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Sistema de Ocorrências. Todos os direitos reservados.</p>
          <p className="mt-2">
            Sistema desenvolvido para facilitar o registro e acompanhamento de ocorrências
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
