import { useState, useRef, useEffect } from 'react';
import { X, Check, Plus, Trash2, Search, Car, Zap, Tag, Paperclip, Home, Users, DollarSign, Receipt, Utensils, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'hospedagem', label: 'Hospedagem', icon: Home },
  { id: 'acompanhantes', label: 'Acompanhantes', icon: Users },
  { id: 'tarifas', label: 'Tarifas', icon: DollarSign },
  { id: 'recebimentos', label: 'Recebimentos', icon: Receipt },
  { id: 'refeicoes', label: 'Refeições', icon: Utensils },
  { id: 'veiculos', label: 'Veículos', icon: Car },
  { id: 'extras', label: 'Extras', icon: Zap },
  { id: 'pulseiras', label: 'Pulseiras', icon: Tag },
  { id: 'anexos', label: 'Anexos', icon: Paperclip },
];

export default function CheckInModal() {
  const [activeSection, setActiveSection] = useState('hospedagem');
  const [isCompleteMode, setIsCompleteMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: contentRef.current, threshold: 0.3 }
    );

    sections.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el && contentRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el;
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl flex flex-col w-full max-w-[1200px] h-[85vh] max-h-[85vh]">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-card-foreground">WALK-IN - UH: 108 - Quarto Superior (Duplo)</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium mb-1">Total</div>
              <div className="text-sm font-bold text-card-foreground">R$ 199,00</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium mb-1">Recebido</div>
              <div className="text-sm font-bold text-success">R$ 0,20</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium mb-1">Em Aberto</div>
              <div className="text-sm font-bold text-destructive">R$ 198,80</div>
            </div>

            <div className="flex items-center gap-2 bg-secondary rounded-md p-1">
              <button
                onClick={() => setIsCompleteMode(false)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  !isCompleteMode ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Expresso
              </button>
              <button
                onClick={() => setIsCompleteMode(true)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  isCompleteMode ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Completo
              </button>
            </div>

            <button className="p-1 hover:bg-secondary rounded-md transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-1 hover:bg-secondary rounded-md transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="h-14 flex items-center overflow-x-auto bg-secondary/50 border-b border-border px-6 gap-1 flex-shrink-0">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap text-sm font-medium ${
                  isActive
                    ? 'bg-card text-primary shadow-sm border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-8">

          {/* Hospedagem */}
          <section id="hospedagem" ref={setSectionRef('hospedagem')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <h2 className="text-xl font-bold mb-6 text-card-foreground">Hospedagem</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Data Inicial</label>
                <Input type="date" defaultValue="2026-03-26" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Data Final</label>
                <Input type="date" defaultValue="2026-03-27" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Titular</label>
                <div className="relative">
                  <Input placeholder="Pesquisar titular..." />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Empresa</label>
                <Input placeholder="Empresa de faturamento" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Forma de Pagamento</label>
                <select className="w-full px-3 py-2 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card">
                  <option>Aberto</option>
                  <option>Cartão de Crédito</option>
                  <option>Débito</option>
                  <option>Dinheiro</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Observações</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card"
                  placeholder="Digite observações..."
                />
              </div>
            </div>
          </section>

          {/* Acompanhantes */}
          <section id="acompanhantes" ref={setSectionRef('acompanhantes')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Acompanhantes(1)</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Tipo</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Nome</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">CPF</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2">ADULTO</td>
                    <td className="px-3 py-2 font-medium">JULIO CALIBERDA</td>
                    <td className="px-3 py-2">123.456.789-00</td>
                    <td className="px-3 py-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tarifas */}
          <section id="tarifas" ref={setSectionRef('tarifas')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Tarifas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Data</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Tipo UH</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Tarifa</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2">26/03/2026</td>
                    <td className="px-3 py-2">Superior Duplo</td>
                    <td className="px-3 py-2">Balcão</td>
                    <td className="px-3 py-2 font-bold">R$ 199,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Recebimentos */}
          <section id="recebimentos" ref={setSectionRef('recebimentos')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Recebimentos</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <select className="px-3 py-2 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card">
                <option>Forma de Pagamento</option>
                <option>Dinheiro</option>
                <option>Cartão de Crédito</option>
                <option>Pix</option>
              </select>
              <Input placeholder="Valor" type="number" />
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Plus className="w-4 h-4 mr-1" /> Receber
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">#</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Forma</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Valor</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Data</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2">Dinheiro</td>
                    <td className="px-3 py-2 font-bold text-success">R$ 0,20</td>
                    <td className="px-3 py-2">26/03/2026</td>
                    <td className="px-3 py-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Refeições */}
          <section id="refeicoes" ref={setSectionRef('refeicoes')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <h2 className="text-xl font-bold mb-6 text-card-foreground">Refeições</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Hóspede</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">26/03</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">27/03</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2 font-medium">JULIO</td>
                    <td className="px-3 py-2">
                      <input type="checkbox" className="rounded cursor-pointer accent-primary" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="checkbox" defaultChecked className="rounded cursor-pointer accent-primary" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Veículos */}
          <section id="veiculos" ref={setSectionRef('veiculos')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Veículos</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <Input placeholder="Garagem" />
              <Input placeholder="Placa" />
              <Input placeholder="Cor" />
              <Input placeholder="Modelo" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">#</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Placa</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Modelo</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Cor</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2">ABC123</td>
                    <td className="px-3 py-2">Golf</td>
                    <td className="px-3 py-2">Preto</td>
                    <td className="px-3 py-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Extras */}
          <section id="extras" ref={setSectionRef('extras')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Extras</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <Input placeholder="Produto/Serviço" />
              <select className="px-3 py-2 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card">
                <option>Frequência</option>
              </select>
              <Input placeholder="Valor" type="number" />
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Código</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Descrição</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Frequência</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Quantidade</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Valor</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2">336016</td>
                    <td className="px-3 py-2">Refrigerante 350ml</td>
                    <td className="px-3 py-2">Diariamente</td>
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2">R$ 5,00</td>
                    <td className="px-3 py-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Pulseiras */}
          <section id="pulseiras" ref={setSectionRef('pulseiras')} className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Pulseiras</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input placeholder="Código da Pulseira" />
              <Input placeholder="Nome do Hóspede" />
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">#</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Código</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Hóspede</th>
                    <th className="text-left px-3 py-2 font-medium text-card-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-3 py-2">1</td>
                    <td className="px-3 py-2">123132</td>
                    <td className="px-3 py-2">JULIO CALIBERDA</td>
                    <td className="px-3 py-2">
                      <button className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Anexos */}
          <section id="anexos" ref={setSectionRef('anexos')} className="bg-card rounded-xl shadow-sm border border-border p-8 mb-20">
            <h2 className="text-xl font-bold mb-6 text-card-foreground">Anexos</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arraste arquivos aqui ou clique para selecionar</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="h-16 flex items-center justify-end gap-3 px-6 border-t border-border bg-card rounded-b-lg flex-shrink-0">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-success hover:bg-success/90 text-success-foreground">
            <Check className="w-4 h-4 mr-1" /> Check-in
          </Button>
        </div>
      </div>
    </div>
  );
}
