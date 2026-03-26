import { useState, useRef, useEffect } from 'react';
import { X, Check, Plus, Trash2, Search, Car, Zap, Tag, Paperclip, Home, Users, DollarSign, Receipt, Utensils, Settings, Pencil, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

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

const thClass = "text-left px-3 py-2 font-semibold text-xs text-foreground uppercase tracking-wider bg-slate-50";
const tdClass = "px-3 py-1.5 text-sm";
const labelClass = "block text-xs font-semibold text-slate-700 mb-1";
const sectionClass = "bg-white border border-slate-200 shadow-md rounded-lg p-6 scroll-mt-32 mb-12";
const inputClass = "h-9 text-sm w-full";
const selectClass = "h-9 w-full px-2 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card";
const btnAction = "h-9 rounded-md text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground";
const emptyRow = (cols: number, msg = "Nenhum item adicionado.") => (
  <tr><td colSpan={cols} className="px-3 py-4 text-center text-sm text-muted-foreground italic">{msg}</td></tr>
);

export default function CheckInModal() {
  const [activeSection, setActiveSection] = useState('hospedagem');
  const [isCompleteMode, setIsCompleteMode] = useState(false);
  const [isEstrangeiro, setIsEstrangeiro] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveSection(sorted[0].target.id);
        }
      },
      { root: contentRef.current, threshold: 0.1, rootMargin: '-120px 0px -40% 0px' }
    );

    sections.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el;
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl flex flex-col w-full max-w-[1200px] h-[90vh] max-h-[90vh]">

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-card rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <h1 className="text-sm font-bold text-foreground">WALK-IN - UH: 108 - Quarto Superior (Duplo)</h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground font-medium">Total</div>
              <div className="text-xs font-bold text-foreground">R$ 199,00</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground font-medium">Recebido</div>
              <div className="text-xs font-bold text-success">R$ 0,20</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground font-medium">Em Aberto</div>
              <div className="text-xs font-bold text-destructive">R$ 198,80</div>
            </div>

            <div className="flex items-center gap-1 bg-secondary rounded-md p-0.5">
              <button
                onClick={() => setIsCompleteMode(false)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  !isCompleteMode ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Expresso
              </button>
              <button
                onClick={() => setIsCompleteMode(true)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  isCompleteMode ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Completo
              </button>
            </div>

            <button className="p-1 hover:bg-secondary rounded-md transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1 hover:bg-secondary rounded-md transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="h-10 flex items-center overflow-x-auto bg-secondary/50 border-b border-border px-5 gap-0.5 flex-shrink-0">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap text-xs font-medium ${
                  isActive
                    ? 'bg-card text-primary shadow-sm border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-6">

          {/* ==================== HOSPEDAGEM ==================== */}
          <section id="hospedagem" ref={setSectionRef('hospedagem')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Dados da Hospedagem</h2>
            <div className="grid grid-cols-12 gap-4">
              {/* Linha 1 */}
              <div className="col-span-3">
                <label className={labelClass}>Data Inicial</label>
                <Input type="date" defaultValue="2026-03-26" className={inputClass} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Data Final</label>
                <Input type="date" defaultValue="2026-03-27" className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>UH</label>
                <Input defaultValue="108" className={inputClass} />
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Diárias</label>
                <Input type="number" defaultValue="1" disabled className={`${inputClass} bg-muted`} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Forma de Pagamento</label>
                <select className={selectClass}>
                  <option>Aberto</option>
                  <option>Faturado</option>
                </select>
              </div>

              {/* Linha 2 */}
              <div className="col-span-3">
                <label className={labelClass}>CPF/CNPJ</label>
                <div className="relative">
                  <Input placeholder="000.000.000-00" className={`${inputClass} pr-8`} />
                  <Search className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </div>
              <div className="col-span-5">
                <label className={labelClass}>Titular</label>
                <div className="flex">
                  <Input placeholder="Pesquisar titular..." className={`${inputClass} rounded-r-none border-r-0`} />
                  <Button size="sm" className={`${btnAction} rounded-none px-2.5 border-r border-white/20`} title="Novo Cadastro">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className={`${btnAction} rounded-l-none px-2.5`} title="Editar Cadastro">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="col-span-4">
                <label className={labelClass}>Empresa de Faturamento</label>
                <Input placeholder="Empresa" className={inputClass} />
              </div>

              {/* Linha 3 */}
              <div className="col-span-2">
                <label className={`${labelClass} opacity-60`}>Estrangeiro</label>
                <div className="flex items-center gap-2 h-9 opacity-60 cursor-not-allowed">
                  <Switch checked={isEstrangeiro} disabled />
                  <span className="text-xs text-muted-foreground">{isEstrangeiro ? 'Sim' : 'Não'}</span>
                </div>
              </div>
              <div className="col-span-3">
                <label className={labelClass}>RG</label>
                <Input placeholder="RG" className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Órgão Expedidor</label>
                <Input placeholder="SSP/SP" className={inputClass} />
              </div>
              <div className="col-span-5">
                <label className={labelClass}>Email</label>
                <Input type="email" placeholder="email@exemplo.com" className={inputClass} />
              </div>

              {/* Linha 4 */}
              <div className="col-span-6">
                <label className={labelClass}>Observação</label>
                <textarea
                  rows={3}
                  className="w-full px-2 py-1.5 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card h-20 resize-none"
                  placeholder="Observações gerais..."
                />
              </div>
              <div className="col-span-6">
                <label className={labelClass}>Observações Internas</label>
                <textarea
                  rows={3}
                  className="w-full px-2 py-1.5 border border-input rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card h-20 resize-none"
                  placeholder="Observações internas (não visível para o hóspede)..."
                />
              </div>
            </div>
          </section>

          {/* ==================== ACOMPANHANTES ==================== */}
          <section id="acompanhantes" ref={setSectionRef('acompanhantes')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Acompanhantes (1)</h2>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <label className={labelClass}>CPF</label>
                <Input placeholder="000.000.000-00" className={inputClass} />
              </div>
              <div className="col-span-6">
                <label className={labelClass}>Nome do Acompanhante</label>
                <div className="flex">
                  <Input placeholder="Nome completo" className={`${inputClass} rounded-r-none border-r-0`} />
                  <Button size="sm" className={`${btnAction} rounded-none px-2.5 border-r border-white/20`} title="Novo Cadastro">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className={`${btnAction} rounded-l-none px-2.5`} title="Editar Cadastro">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Tipo</label>
                <select className={selectClass}>
                  <option>Adulto</option>
                  <option>Criança</option>
                </select>
              </div>
              <div className="col-span-1 flex items-end">
                <Button size="sm" className={`${btnAction} w-full px-1`}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>Tipo</th>
                    <th className={thClass}>Nome</th>
                    <th className={thClass}>CPF</th>
                    <th className={thClass}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>ADULTO</td>
                    <td className={`${tdClass} font-medium`}>JULIO CALIBERDA</td>
                    <td className={tdClass}>123.456.789-00</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1">
                        <button className="text-primary hover:text-primary/80 p-0.5"><Pencil className="w-3.5 h-3.5" /></button>
                        <button className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== TARIFAS ==================== */}
          <section id="tarifas" ref={setSectionRef('tarifas')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Tarifas Aplicadas</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>Dia</th>
                    <th className={thClass}>Tarifa</th>
                    <th className={thClass}>Diária</th>
                    <th className={thClass}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>26/03/2026</td>
                    <td className={tdClass}>
                      <select className="h-7 w-full px-2 border border-input rounded text-xs bg-card">
                        <option>1 - CAFÉ DA MANHÃ</option>
                        <option>2 - MEIA PENSÃO</option>
                        <option>3 - PENSÃO COMPLETA</option>
                      </select>
                    </td>
                    <td className={`${tdClass} font-bold`}>R$ 199,00</td>
                    <td className={tdClass}>
                      <button className="text-primary hover:text-primary/80 p-0.5"><Pencil className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== RECEBIMENTOS ==================== */}
          <section id="recebimentos" ref={setSectionRef('recebimentos')} className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Histórico de Recebimentos</h2>
              <Button size="sm" className={`${btnAction} h-8 text-xs`}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Novo Recebimento
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>Data</th>
                    <th className={thClass}>Histórico</th>
                    <th className={thClass}>Caixa/Banco</th>
                    <th className={thClass}>Tipo</th>
                    <th className={thClass}>Valor</th>
                    <th className={thClass}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>26/03/2026</td>
                    <td className={tdClass}>Pagamento parcial</td>
                    <td className={tdClass}>Caixa Geral</td>
                    <td className={tdClass}>Dinheiro</td>
                    <td className={`${tdClass} font-bold text-success`}>R$ 0,20</td>
                    <td className={tdClass}>
                      <button className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== REFEIÇÕES ==================== */}
          <section id="refeicoes" ref={setSectionRef('refeicoes')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Refeições</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>Data</th>
                    <th className={thClass}>Hóspede</th>
                    <th className={thClass}>Faixa Etária</th>
                    <th className={thClass}>Tipo</th>
                    <th className={`${thClass} text-center`}>Café da Manhã</th>
                    <th className={`${thClass} text-center`}>Almoço</th>
                    <th className={`${thClass} text-center`}>Jantar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>26/03</td>
                    <td className={`${tdClass} font-medium`}>JULIO CALIBERDA</td>
                    <td className={tdClass}>Adulto</td>
                    <td className={tdClass}>Titular</td>
                    <td className={`${tdClass} text-center`}><Checkbox defaultChecked /></td>
                    <td className={`${tdClass} text-center`}><Checkbox /></td>
                    <td className={`${tdClass} text-center`}><Checkbox /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== VEÍCULOS ==================== */}
          <section id="veiculos" ref={setSectionRef('veiculos')} className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Veículos</h2>
              <Button size="sm" className={`${btnAction} h-8 text-xs`}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Veículo
              </Button>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <label className={labelClass}>Garagem</label>
                <Input placeholder="Nº Garagem" className={inputClass} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Placa</label>
                <Input placeholder="ABC-1234" className={inputClass} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Cor</label>
                <Input placeholder="Cor" className={inputClass} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Modelo</label>
                <Input placeholder="Modelo" className={inputClass} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>#</th>
                    <th className={thClass}>Placa</th>
                    <th className={thClass}>Modelo</th>
                    <th className={thClass}>Cor</th>
                    <th className={thClass}>Garagem</th>
                    <th className={thClass}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {emptyRow(6)}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== EXTRAS ==================== */}
          <section id="extras" ref={setSectionRef('extras')} className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Extras</h2>
              <Button size="sm" className={`${btnAction} h-8 text-xs`}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Extra
              </Button>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className={labelClass}>Produto/Serviço</label>
                <Input placeholder="Buscar produto..." className={inputClass} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Frequência</label>
                <select className={selectClass}>
                  <option>Única</option>
                  <option>Diariamente</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>PDV</label>
                <Input placeholder="PDV" className={inputClass} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Valor</label>
                <Input placeholder="0,00" type="number" className={inputClass} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>Cód.</th>
                    <th className={thClass}>Descrição</th>
                    <th className={thClass}>PDV</th>
                    <th className={thClass}>Frequência</th>
                    <th className={thClass}>Qtd.</th>
                    <th className={thClass}>Valor</th>
                    <th className={thClass}>Sub-total</th>
                    <th className={thClass}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {emptyRow(8)}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== PULSEIRAS ==================== */}
          <section id="pulseiras" ref={setSectionRef('pulseiras')} className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Pulseiras</h2>
              <Button size="sm" className={`${btnAction} h-8 text-xs`}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Pulseira
              </Button>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className={labelClass}>Código</label>
                <Input placeholder="Código da pulseira" className={inputClass} />
              </div>
              <div className="col-span-8">
                <label className={labelClass}>Nome do Hóspede</label>
                <Input placeholder="Nome" className={inputClass} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass}>#</th>
                    <th className={thClass}>Código</th>
                    <th className={thClass}>Hóspede</th>
                    <th className={thClass}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {emptyRow(4)}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== ANEXOS ==================== */}
          <section id="anexos" ref={setSectionRef('anexos')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Anexos</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <Paperclip className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Arraste arquivos aqui ou clique para selecionar</p>
            </div>
          </section>

          {/* Bottom spacer for last section scroll */}
          <div className="h-16" />
        </div>

        {/* Footer */}
        <div className="h-12 flex items-center justify-end gap-2 px-5 border-t border-border bg-card rounded-b-lg flex-shrink-0">
          <Button size="sm" className="h-9 rounded-md text-sm font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            Cancelar
          </Button>
          <Button size="sm" className="h-9 rounded-md text-sm font-semibold bg-success hover:bg-success/90 text-success-foreground">
            <Check className="w-4 h-4 mr-1" /> Check-in
          </Button>
        </div>
      </div>
    </div>
  );
}
