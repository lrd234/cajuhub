import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOccurrences } from '@/contexts/OccurrenceContext';

interface FormData {
  type: string;
  location: string;
  description: string;
}

const occurrenceTypes = [
  'Acidente de Trânsito',
  'Furto/Roubo',
  'Briga/Confusão',
  'Dano ao Patrimônio',
  'Perturbação do Sossego',
  'Emergência Médica',
  'Incêndio',
  'Outros'
];

export const OccurrenceForm: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addOccurrence } = useOccurrences();
  const { toast } = useToast();

  const form = useForm<FormData>({
    defaultValues: {
      type: '',
      location: '',
      description: '',
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      addOccurrence({
        type: data.type,
        location: data.location,
        description: data.description,
        photo: photo || undefined,
      });

      toast({
        title: "Ocorrência registrada com sucesso!",
        description: "Sua ocorrência foi registrada e será analisada pela equipe responsável.",
      });

      // Reset form
      form.reset();
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Erro ao registrar ocorrência",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-hero bg-gradient-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <AlertTriangle className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Registrar Nova Ocorrência
        </CardTitle>
        <CardDescription className="text-base">
          Relate qualquer situação que necessite atenção das autoridades competentes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Selecione o tipo de ocorrência" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Tipo de Ocorrência
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de ocorrência" />
                      </SelectTrigger>
                      <SelectContent>
                        {occurrenceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              rules={{ required: "Informe o local da ocorrência" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Local da Ocorrência
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Rua das Flores, 123 - Centro"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Descreva a ocorrência" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Ocorrência</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva detalhadamente o que aconteceu..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <label className="block text-sm font-medium">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4" />
                  Foto da Ocorrência (Opcional)
                </div>
              </label>
              
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {photo ? 'Alterar Foto' : 'Adicionar Foto'}
                </Button>

                {photo && (
                  <div className="mt-3">
                    <img
                      src={photo}
                      alt="Foto da ocorrência"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full animate-fade-in"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Ocorrência'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};