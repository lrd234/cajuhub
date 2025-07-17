import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  FileText, 
  LogOut, 
  Search, 
  Filter,
  Eye,
  Trash2,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useOccurrences, Occurrence } from '@/contexts/OccurrenceContext';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { occurrences, updateOccurrenceStatus, deleteOccurrence, getStatistics } = useOccurrences();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);

  const statistics = getStatistics();

  const filteredOccurrences = occurrences.filter(occurrence => {
    const matchesSearch = occurrence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         occurrence.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || occurrence.status === statusFilter;
    const matchesType = typeFilter === 'all' || occurrence.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (id: string, newStatus: 'pending' | 'resolved') => {
    updateOccurrenceStatus(id, newStatus);
    toast({
      title: "Status atualizado",
      description: `Ocorrência marcada como ${newStatus === 'resolved' ? 'resolvida' : 'pendente'}.`,
    });
  };

  const handleDelete = (id: string) => {
    deleteOccurrence(id);
    toast({
      title: "Ocorrência excluída",
      description: "A ocorrência foi removida do sistema.",
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'resolved' ? (
      <Badge variant="secondary" className="bg-success text-success-foreground">
        <CheckCircle className="h-3 w-3 mr-1" />
        Resolvida
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-warning text-warning-foreground">
        <Clock className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    );
  };

  const uniqueTypes = [...new Set(occurrences.map(occ => occ.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Header */}
      <div className="bg-white shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gerenciamento de Ocorrências</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card bg-gradient-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ocorrências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{statistics.total}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{statistics.pending}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolvidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{statistics.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="shadow-card bg-gradient-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por descrição, local ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="resolved">Resolvidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Ocorrências */}
        <Card className="shadow-card bg-gradient-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lista de Ocorrências ({filteredOccurrences.length})
            </CardTitle>
            <CardDescription>
              Gerencie todas as ocorrências registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOccurrences.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma ocorrência encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOccurrences.map((occurrence) => (
                  <div key={occurrence.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{occurrence.type}</h3>
                          {getStatusBadge(occurrence.status)}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {occurrence.location}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(occurrence.createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {occurrence.description}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOccurrence(occurrence)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Ocorrência</DialogTitle>
                            </DialogHeader>
                            {selectedOccurrence && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Tipo:</h4>
                                  <p>{selectedOccurrence.type}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Local:</h4>
                                  <p>{selectedOccurrence.location}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Descrição:</h4>
                                  <p>{selectedOccurrence.description}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Status:</h4>
                                  {getStatusBadge(selectedOccurrence.status)}
                                </div>
                                {selectedOccurrence.photo && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Foto:</h4>
                                    <img 
                                      src={selectedOccurrence.photo} 
                                      alt="Foto da ocorrência" 
                                      className="max-w-full h-auto rounded-lg border"
                                    />
                                  </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    variant={selectedOccurrence.status === 'resolved' ? 'warning' : 'success'}
                                    onClick={() => handleStatusChange(
                                      selectedOccurrence.id, 
                                      selectedOccurrence.status === 'resolved' ? 'pending' : 'resolved'
                                    )}
                                  >
                                    {selectedOccurrence.status === 'resolved' ? 'Marcar como Pendente' : 'Marcar como Resolvida'}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(selectedOccurrence.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant={occurrence.status === 'resolved' ? 'warning' : 'success'}
                          size="sm"
                          onClick={() => handleStatusChange(
                            occurrence.id, 
                            occurrence.status === 'resolved' ? 'pending' : 'resolved'
                          )}
                        >
                          {occurrence.status === 'resolved' ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(occurrence.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};