import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LoginData {
  username: string;
  password: string;
}

export const AdminLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    
    // Simular um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = login(data.username, data.password);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique seu usuário e senha.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-hero bg-gradient-card animate-slide-up">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-primary rounded-full">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Painel Administrativo
          </CardTitle>
          <CardDescription>
            Acesse o sistema de gerenciamento de ocorrências
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                rules={{ required: "Usuário é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Usuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Senha é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
            <p><strong>Credenciais de teste:</strong></p>
            <p>Usuário: <code className="bg-muted px-1 py-0.5 rounded">admin</code></p>
            <p>Senha: <code className="bg-muted px-1 py-0.5 rounded">admin</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};