import { useState, useRef, useEffect } from 'react';
import { X, Check, Plus, Trash2, Search, Car, Zap, Tag, Paperclip, Home, Users, DollarSign, Receipt, Utensils, Pencil, CreditCard, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const sections = [
  { id: 'hospedagem', label: 'Hospedagem', icon: Home },
  { id: 'faturamento', label: 'Faturamento', icon: CreditCard },
  { id: 'acompanhantes', label: 'Acompanhantes', icon: Users },
  { id: 'tarifas', label: 'Tarifas', icon: DollarSign },
  { id: 'recebimentos', label: 'Recebimentos', icon: Receipt },
  { id: 'refeicoes', label: 'Refeições', icon: Utensils },
  { id: 'veiculos', label: 'Veículos', icon: Car },
  { id: 'extras', label: 'Extras', icon: Zap },
  { id: 'pulseiras', label: 'Pulseiras', icon: Tag },
  { id: 'anexos', label: 'Anexos', icon: Paperclip },
];

const uhOptions = [
  '101','102','103','104','105','106',
  '107','108','109','110','111','112',
  '201','202','203','204','205','206',
  '207','208','209','210','211','212',
];

const thClass = "text-left px-3 py-2 font-semibold text-xs text-foreground uppercase tracking-wider bg-slate-50";
const tdClass = "px-3 py-1.5 text-sm";
const labelClass = "block text-xs font-semibold text-slate-700 mb-1";
const sectionClass = "bg-white border border-slate-200 shadow-sm rounded-lg p-6 scroll-mt-32 mb-6";
const inputClass = "h-9 text-sm";
const selectClass = "h-9 w-full px-2 border border-slate-300 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card";

// Blue action button group — used for [+ | Pencil] inside panels
const ActionBtn = ({ children, title, rounded }: { children: React.ReactNode; title?: string; rounded?: 'left' | 'right' | 'none' }) => {
  const radiusClass =
    rounded === 'left' ? 'rounded-l-none rounded-r-none' :
    rounded === 'right' ? 'rounded-l-none rounded-r-md' :
    rounded === 'none' ? 'rounded-none' : '';
  return (
    <Button
      size="sm"
      title={title}
      className={`h-9 bg-primary hover:bg-primary/90 text-primary-foreground px-2.5 border-r border-white/20 ${radiusClass}`}
    >
      {children}
    </Button>
  );
};

export default function CheckInModal() {
  const [activeSection, setActiveSection] = useState('hospedagem');
  const [isEstrangeiro] = useState(false);
  // Per-day tariff values — storing localized string formats
  const [tarifaValues, setTarifaValues] = useState<string[]>(['199,00', '199,00']);
  const [tarifaGlobal, setTarifaGlobal] = useState('1 - CAFÉ DA MANHÃ');

  const formatCurrency = (val: string) => {
    let nums = val.replace(/\D/g, '');
    if (!nums) return '0,00';
    const parsed = (parseInt(nums, 10) / 100).toFixed(2);
    return parsed.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const replicateValue = (fromIndex: number) => {
    const value = tarifaValues[fromIndex];
    setTarifaValues(tarifaValues.map(() => value));
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return; // ignore observer during programmatic scroll
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
      // Set flag immediately so observer ignores scroll events
      isScrollingRef.current = true;
      setActiveSection(id);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Re-enable observer after scroll animation completes (~700ms)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el;
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-card rounded-lg shadow-xl flex flex-col w-full max-w-[1200px] h-[90vh] max-h-[90vh]"
        style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}
      >

        {/* Header — title only, no financial values */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-card rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <h1 className="text-sm font-bold text-foreground">WALK-IN - UH: 108 - Quarto Superior (Duplo)</h1>
          </div>
          <button className="p-1 hover:bg-secondary rounded-md transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tab Navigation / ScrollSpy */}
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

              {/* Linha 1: UH(2) | Data Inicial(3) | Data Final(3) | Diárias(1) | [Espaço(3)] */}
              <div className="col-span-2">
                <label className={labelClass}>UH (Quarto)</label>
                <select className={selectClass} defaultValue="108">
                  {uhOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Data Inicial</label>
                <Input type="datetime-local" defaultValue="2026-03-26T14:00" className={`${inputClass} w-full text-xs`} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Data Final</label>
                <Input type="datetime-local" defaultValue="2026-03-27T11:59" className={`${inputClass} w-full text-xs`} />
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Diárias</label>
                <Input type="number" defaultValue="1" disabled className={`${inputClass} w-full bg-muted text-center`} />
              </div>
              <div className="col-span-3" />{/* filler space */}

              {/* Linha 2: CPF(3) | Titular+[+|✏](9) */}
              <div className="col-span-3">
                <label className={labelClass}>CPF / ID</label>
                <div className="relative">
                  <Input placeholder="000.000.000-00" className={`${inputClass} w-full pr-8`} />
                  <Search className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </div>
              <div className="col-span-9">
                <label className={labelClass}>Titular</label>
                <div className="flex">
                  <Input placeholder="Pesquisar titular..." className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn title="Novo Cadastro" rounded="none">
                    <Plus className="w-3.5 h-3.5" />
                  </ActionBtn>
                  <ActionBtn title="Editar Cadastro" rounded="right">
                    <Pencil className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>

              {/* Linha 3: Estrangeiro(1) | RG(2) | Órgão(2) | Email(4) | Celular(3) */}
              <div className="col-span-1">
                <label className={`${labelClass} opacity-60`}>Estrangeiro</label>
                <div className="flex items-center gap-1.5 h-9 cursor-not-allowed">
                  <Checkbox checked={isEstrangeiro} disabled className="opacity-60" />
                  <span className="text-xs text-muted-foreground opacity-60">{isEstrangeiro ? 'Sim' : 'Não'}</span>
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>RG</label>
                <Input placeholder="00.000.000-0" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Órgão Expedidor</label>
                <Input placeholder="SSP/SP" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-4">
                <label className={labelClass}>Email</label>
                <Input type="email" placeholder="email@exemplo.com" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Celular</label>
                <Input type="tel" placeholder="(00) 00000-0000" className={`${inputClass} w-full`} />
              </div>

              {/* Linha 4: Observação | Observações Internas */}
              <div className="col-span-6">
                <label className={labelClass}>Observação</label>
                <textarea
                  rows={3}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card h-20 resize-none"
                  placeholder="Observações gerais..."
                />
              </div>
              <div className="col-span-6">
                <label className={labelClass}>Observações Internas</label>
                <textarea
                  rows={3}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card h-20 resize-none"
                  placeholder="Observações internas (não visível para o hóspede)..."
                />
              </div>
            </div>
          </section>

          {/* ==================== FATURAMENTO ==================== */}
          <section id="faturamento" ref={setSectionRef('faturamento')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Faturamento</h2>
            <div className="grid grid-cols-12 gap-4">

              {/* Forma de Pagamento(2) | CNPJ(3) | Empresa de Faturamento(7) */}
              <div className="col-span-2">
                <label className={labelClass}>Forma de Pagamento</label>
                <select className={selectClass}>
                  <option>Aberto</option>
                  <option>Faturado</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className={labelClass}>CNPJ</label>
                <div className="relative">
                  <Input placeholder="00.000.000/0000-00" className={`${inputClass} w-full pr-8`} />
                  <Search className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </div>
              </div>
              <div className="col-span-7">
                <label className={labelClass}>Empresa de Faturamento</label>
                <div className="flex">
                  <Input placeholder="Nome da empresa" className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn title="Nova Empresa" rounded="none">
                    <Plus className="w-3.5 h-3.5" />
                  </ActionBtn>
                  <ActionBtn title="Editar Empresa" rounded="right">
                    <Pencil className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== ACOMPANHANTES ==================== */}
          <section id="acompanhantes" ref={setSectionRef('acompanhantes')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Acompanhantes (1)</h2>
            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* CPF(3) | Nome+[+|✏](5) | Tipo(2) | Idade(1) | Adicionar(1) */}
              <div className="col-span-3">
                <label className={labelClass}>CPF</label>
                <Input placeholder="000.000.000-00" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-5">
                <label className={labelClass}>Nome do Acompanhante</label>
                <div className="flex">
                  <Input placeholder="Nome completo" className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn title="Novo Cadastro" rounded="none">
                    <Plus className="w-4 h-4" />
                  </ActionBtn>
                  <ActionBtn title="Editar Cadastro" rounded="right">
                    <Pencil className="w-4 h-4" />
                  </ActionBtn>
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Tipo</label>
                <select id="acomp-tipo" className={selectClass} onChange={(e) => {
                  const idadeField = document.getElementById('acomp-idade') as HTMLSelectElement | null;
                  if (idadeField) idadeField.disabled = e.target.value !== 'Criança';
                }}>
                  <option>Adulto</option>
                  <option>Criança</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Idade</label>
                <select id="acomp-idade" disabled className={`${selectClass} opacity-50 cursor-not-allowed`}>
                  {Array.from({length: 18}, (_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="col-span-1 flex items-end">
                <Button size="sm" className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground px-1.5">
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
                    <th className={thClass}>Idade</th>
                    <th className={thClass}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>ADULTO</td>
                    <td className={`${tdClass} font-medium`}>JULIO CALIBERDA</td>
                    <td className={tdClass}>123.456.789-00</td>
                    <td className={tdClass}>—</td>
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
            {/* Header: title + single tarifa selector for all days */}
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-foreground whitespace-nowrap">Tarifas</h2>
              <div className="flex items-center gap-2">
                <label className={`${labelClass} mb-0 whitespace-nowrap`}>Tarifa:</label>
                <select 
                  className="h-8 px-2 border border-input rounded text-sm bg-card min-w-[260px]"
                  value={tarifaGlobal}
                  onChange={(e) => setTarifaGlobal(e.target.value)}
                >
                  <option>1 - CAFÉ DA MANHÃ</option>
                  <option>2 - MEIA PENSÃO</option>
                  <option>3 - PENSÃO COMPLETA</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className={thClass} style={{width:'100px'}}>Dia</th>
                    <th className={thClass}>Tarifa</th>
                    <th className={thClass} style={{width:'160px'}}>Diária</th>
                    <th className={thClass} style={{width:'80px'}}>Replicar</th>
                  </tr>
                </thead>
                <tbody>
                  {(['26/03/2026', '27/03/2026'] as const).map((dia, i) => (
                    <tr key={dia} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className={tdClass}>{dia}</td>
                      <td className={`${tdClass} text-muted-foreground font-medium`}>{tarifaGlobal}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">R$</span>
                          <input
                            type="text"
                            value={tarifaValues[i]}
                            onChange={(e) => {
                              const updated = [...tarifaValues];
                              updated[i] = formatCurrency(e.target.value);
                              setTarifaValues(updated);
                            }}
                            className="h-8 w-28 border border-input rounded px-2 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary bg-card text-right"
                          />
                        </div>
                      </td>
                      <td className={tdClass}>
                        <button
                          title="Replicar este valor para todas as diárias"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium p-0.5"
                          onClick={() => replicateValue(i)}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Replicar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== RECEBIMENTOS ==================== */}
          <section id="recebimentos" ref={setSectionRef('recebimentos')} className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Recebimentos</h2>
              <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">Refeições</h2>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Pensão: 1 - CAFÉ DA MANHÃ</span>
            </div>
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
            <h2 className="text-sm font-bold mb-4 text-foreground">Veículos</h2>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <label className={labelClass}>Garagem</label>
                <Input placeholder="Nº Garagem" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Placa</label>
                <Input placeholder="ABC-1234" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Cor</label>
                <Input placeholder="Cor" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-3">
                <label className={labelClass}>Modelo</label>
                <Input placeholder="Modelo" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-2 flex items-end">
                <Button size="sm" className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Adicionar
                </Button>
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
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>1</td>
                    <td className={tdClass}>ABC-1234</td>
                    <td className={tdClass}>Golf</td>
                    <td className={tdClass}>Preto</td>
                    <td className={tdClass}>01</td>
                    <td className={tdClass}>
                      <button className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== EXTRAS ==================== */}
          <section id="extras" ref={setSectionRef('extras')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Extras</h2>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className={labelClass}>Produto/Serviço</label>
                <Input placeholder="Buscar produto..." className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Frequência</label>
                <select className={selectClass}>
                  <option>Única</option>
                  <option>Diariamente</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>PDV</label>
                <select className={selectClass}>
                  <option>Recepção</option>
                  <option>Restaurante</option>
                  <option>Frigobar</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Valor</label>
                <Input placeholder="0,00" type="number" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-2 flex items-end">
                <Button size="sm" className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Adicionar
                </Button>
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
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>336016</td>
                    <td className={tdClass}>Refrigerante 350ml</td>
                    <td className={tdClass}>Bar</td>
                    <td className={tdClass}>Diariamente</td>
                    <td className={tdClass}>1</td>
                    <td className={tdClass}>R$ 5,00</td>
                    <td className={`${tdClass} font-bold`}>R$ 5,00</td>
                    <td className={tdClass}>
                      <button className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== PULSEIRAS ==================== */}
          <section id="pulseiras" ref={setSectionRef('pulseiras')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Pulseiras</h2>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <label className={labelClass}>Código</label>
                <Input placeholder="Código da pulseira" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-5">
                <label className={labelClass}>Nome do Hóspede</label>
                <Input placeholder="Nome" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-3 flex items-end">
                <Button size="sm" className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Adicionar
                </Button>
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
                  <tr className="border-b border-border/50 hover:bg-secondary/30">
                    <td className={tdClass}>1</td>
                    <td className={tdClass}>123132</td>
                    <td className={tdClass}>JULIO CALIBERDA</td>
                    <td className={tdClass}>
                      <button className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
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
        <div className="h-14 flex items-center justify-end gap-5 px-5 border-t border-border bg-card rounded-b-lg flex-shrink-0">
          {/* Financial summary — right side, next to action buttons */}
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium">Total</div>
              <div className="text-base font-bold text-foreground">R$ 199,00</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium">Recebido</div>
              <div className="text-base font-bold text-success">R$ 0,20</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium">Em Aberto</div>
              <div className="text-base font-bold text-destructive">R$ 198,80</div>
            </div>
          </div>
          <div className="w-px h-6 bg-border" />{/* divider */}
          <div className="flex items-center gap-2">
            {/* Cancelar — Danger Red */}
            <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0">
              Cancelar
            </Button>
            {/* Check-in — Success Green */}
            <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
              <Check className="w-4 h-4 mr-1" /> Check-in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
