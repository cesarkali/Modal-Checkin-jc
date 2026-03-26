import { useState, useRef, useEffect } from 'react';
import { X, Check, Plus, Trash2, Search, Car, Zap, Tag, Paperclip, Home, Users, DollarSign, Receipt, Utensils, Pencil, CreditCard, Copy, Calendar, Bed, BedSingle, BedDouble, Save, IdCard, MapPin } from 'lucide-react';
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

type RoomType = 'SNG' | 'DBL' | 'TWN';
const roomsData: { id: number; number: string; type: RoomType }[] = [
  { id: 1, number: '101', type: 'TWN' },
  { id: 2, number: '102', type: 'SNG' },
  { id: 3, number: '104', type: 'SNG' },
  { id: 4, number: '105', type: 'SNG' },
  { id: 5, number: '106', type: 'SNG' },
  { id: 6, number: '107', type: 'SNG' },
  { id: 7, number: '108', type: 'SNG' },
  { id: 8, number: '109', type: 'SNG' },
  { id: 9, number: '203', type: 'DBL' },
  { id: 10, number: '204', type: 'DBL' },
  { id: 11, number: '205', type: 'DBL' },
  { id: 12, number: '206', type: 'DBL' },
  { id: 13, number: '207', type: 'DBL' },
  { id: 14, number: '208', type: 'DBL' },
  { id: 15, number: '209', type: 'DBL' },
  { id: 16, number: '210', type: 'DBL' },
  { id: 17, number: '211', type: 'DBL' },
  { id: 18, number: '212', type: 'DBL' },
  { id: 19, number: '213', type: 'DBL' },
  { id: 20, number: '214', type: 'DBL' },
];

const thClass = "text-left px-3 py-2 font-semibold text-xs text-foreground uppercase tracking-wider bg-slate-50";
const tdClass = "px-3 py-1.5 text-sm";
const labelClass = "block text-xs font-semibold text-slate-700 mb-1";
const sectionClass = "bg-white border border-slate-200 shadow-sm rounded-lg p-6 scroll-mt-32 mb-6";
const inputClass = "h-9 text-sm";
const selectClass = "h-9 w-full px-2 border border-slate-300 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card";

// Blue action button group — used for [+ | Pencil] inside panels
const ActionBtn = ({ children, title, rounded, onClick, className }: { children: React.ReactNode; title?: string; rounded?: 'left' | 'right' | 'none'; onClick?: React.MouseEventHandler<HTMLButtonElement>; className?: string }) => {
  const radiusClass =
    rounded === 'left' ? 'rounded-l-none rounded-r-none' :
      rounded === 'right' ? 'rounded-l-none rounded-r-md' :
        rounded === 'none' ? 'rounded-none' : '';
  return (
    <Button
      size="sm"
      title={title}
      onClick={onClick}
      className={`h-9 bg-primary hover:bg-primary/90 text-primary-foreground px-2.5 border-r border-white/20 ${radiusClass} ${className || ''}`}
    >
      {children}
    </Button>
  );
};

export default function CheckInModal() {
  const [activeSection, setActiveSection] = useState('hospedagem');
  const [isEstrangeiro] = useState(false);
  const [isUhModalOpen, setIsUhModalOpen] = useState(false);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personModalTab, setPersonModalTab] = useState<'main' | 'address'>('main');
  const [personType, setPersonType] = useState<'Física' | 'Jurídica'>('Física');
  const [personEstrangeiro, setPersonEstrangeiro] = useState('NÃO');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [selectedUh, setSelectedUh] = useState(roomsData[6]); // 108 default
  // Per-day tariff values — storing localized string formats
  const [tarifaValues, setTarifaValues] = useState<string[]>(['199,00', '199,00']);
  const [tarifaGlobal, setTarifaGlobal] = useState('1 - CAFÉ DA MANHÃ');

  const [receiptTab, setReceiptTab] = useState<'dinheiro' | 'deposito' | 'cartao' | 'outros' | 'conta_hospede'>('dinheiro');
  const [receiptValor, setReceiptValor] = useState('');
  const [receiptError, setReceiptError] = useState(false);
  const [receiptData, setReceiptData] = useState(() => new Date().toISOString().split('T')[0]);
  const [receiptBanco, setReceiptBanco] = useState('Banco do Brasil');
  const [receiptOperacao, setReceiptOperacao] = useState('Débito');
  const [receiptOperadora, setReceiptOperadora] = useState('Visa Débito');
  const [receiptParcelas, setReceiptParcelas] = useState('1');
  const [receiptAut, setReceiptAut] = useState('');
  const [receiptNSU, setReceiptNSU] = useState('');
  const [receiptOutrosForma, setReceiptOutrosForma] = useState('PIX');
  const [extraValor, setExtraValor] = useState('');
  const [recebimentos, setRecebimentos] = useState([
    {
      id: 1,
      data: '26/03/2026',
      historico: 'Pagamento parcial',
      caixaBanco: 'Caixa Geral',
      tipo: 'Dinheiro',
      valor: '0,20',
    }
  ]);

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

  const handleSaveReceipt = () => {
    const rawVal = receiptValor.replace(/\./g, '').replace(',', '.');
    if (!rawVal || parseFloat(rawVal) <= 0) {
      setReceiptError(true);
      return;
    }

    let typeDisplay = '';
    let bankDisplay = 'Caixa Geral';
    
    if (receiptTab === 'dinheiro') {
      typeDisplay = 'Dinheiro';
    } else if (receiptTab === 'deposito') {
      typeDisplay = 'Depósito';
      bankDisplay = receiptBanco;
    } else if (receiptTab === 'cartao') {
      typeDisplay = `${receiptOperacao} - ${receiptOperadora}`;
      bankDisplay = 'Conta Cartão';
    } else if (receiptTab === 'outros') {
      typeDisplay = receiptOutrosForma;
    } else if (receiptTab === 'conta_hospede') {
      typeDisplay = 'Conta Hóspede';
      bankDisplay = 'Conta Hóspede';
    }

    const formatDate = (ds: string) => {
        if (!ds) return new Date().toLocaleDateString('pt-BR');
        const [y, m, d] = ds.split('-');
        return `${d}/${m}/${y}`;
    }

    const newReceipt = {
        id: Date.now(),
        data: receiptTab === 'dinheiro' ? new Date().toLocaleDateString('pt-BR') : formatDate(receiptData),
        historico: 'Novo recebimento',
        caixaBanco: bankDisplay,
        tipo: typeDisplay,
        valor: receiptValor || '0,00',
    };

    setRecebimentos([...recebimentos, newReceipt]);
    setReceiptValor('');
    setReceiptAut('');
    setReceiptNSU('');
    setReceiptError(false);
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap text-xs font-medium ${isActive
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Linha 1: UH(auto) | Data Inicial(auto) | Data Final(auto) | Diárias(1) | [Espaço(auto)] */}
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>UH (Quarto)</label>
                <button 
                  type="button"
                  onClick={() => setIsUhModalOpen(true)}
                  className={`flex items-center justify-between ${selectClass} hover:bg-secondary/50 transition-colors text-left font-bold text-primary`}
                >
                  <span className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                    {selectedUh.type === 'SNG' ? <BedSingle className="w-4 h-4" /> : 
                     selectedUh.type === 'DBL' ? <BedDouble className="w-4 h-4" /> : 
                     <Bed className="w-4 h-4" />}
                    {selectedUh.number} - {selectedUh.type}
                  </span>
                </button>
              </div>
              <div className="col-span-12 md:col-span-10 flex flex-col md:flex-row gap-4">
                <div>
                  <label className={labelClass}>Data Inicial</label>
                  <div className="relative flex items-center">
                    <Input 
                      type="datetime-local" 
                      defaultValue="2026-03-26T14:00" 
                      className={`${inputClass} w-[150px] rounded-r-none border-r-0 text-xs [&::-webkit-calendar-picker-indicator]:hidden`} 
                    />
                    <ActionBtn 
                      rounded="right" 
                      title="Abrir Calendário"
                      // @ts-ignore
                      onClick={(e) => e.currentTarget.previousElementSibling?.showPicker?.()}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </ActionBtn>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Data Final</label>
                  <div className="relative flex items-center">
                    <Input 
                      type="datetime-local" 
                      defaultValue="2026-03-27T11:59" 
                      className={`${inputClass} w-[150px] rounded-r-none border-r-0 text-xs [&::-webkit-calendar-picker-indicator]:hidden`} 
                    />
                    <ActionBtn 
                      rounded="right" 
                      title="Abrir Calendário"
                      // @ts-ignore
                      onClick={(e) => e.currentTarget.previousElementSibling?.showPicker?.()}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </ActionBtn>
                  </div>
                </div>
                <div className="w-20">
                  <label className={labelClass}>Diárias</label>
                  <Input type="number" defaultValue="1" disabled className={`${inputClass} w-full bg-muted text-center`} />
                </div>
              </div>

              {/* Linha 2: CPF(3) | Titular+[+|✏](9) */}
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>CPF / ID</label>
                <div className="flex">
                  <Input placeholder="000.000.000-00 / 0000" className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn rounded="right">
                    <Search className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <label className={labelClass}>Titular</label>
                <div className="flex">
                  <Input placeholder="Pesquisar titular..." className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn title="Novo Cadastro" rounded="none" onClick={() => { setPersonType('Física'); setIsPersonModalOpen(true); }}>
                    <Plus className="w-3.5 h-3.5" />
                  </ActionBtn>
                  <ActionBtn title="Editar Cadastro" rounded="right" onClick={() => { setPersonType('Física'); setIsPersonModalOpen(true); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>

              {/* Linha 3: Estrangeiro(1) | RG(2) | Órgão(2) | Email(4) | Celular(3) */}
              <div className="col-span-12 md:col-span-1">
                <label className={`${labelClass} opacity-60`}>Estrangeiro</label>
                <div className="flex items-center gap-1.5 h-9 cursor-not-allowed">
                  <Checkbox checked={isEstrangeiro} disabled className="opacity-60" />
                  <span className="text-xs text-muted-foreground opacity-60">{isEstrangeiro ? 'Sim' : 'Não'}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>RG</label>
                <Input placeholder="00.000.000-0" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Órgão Expedidor</label>
                <Input placeholder="SSP/SP" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Email</label>
                <Input type="email" placeholder="email@exemplo.com" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>Celular</label>
                <Input type="tel" placeholder="(00) 00000-0000" className={`${inputClass} w-full`} />
              </div>

              {/* Linha 4: Observação | Observações Internas */}
              <div className="col-span-12 md:col-span-6">
                <label className={labelClass}>Observação</label>
                <textarea
                  rows={3}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card h-20 resize-none"
                  placeholder="Observações gerais..."
                />
              </div>
              <div className="col-span-12 md:col-span-6">
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Forma de Pagamento(2) | CNPJ(3) | Empresa de Faturamento(7) */}
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Forma de Pagamento</label>
                <select className={selectClass}>
                  <option>Aberto</option>
                  <option>Faturado</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>CNPJ</label>
                <div className="flex">
                  <Input placeholder="00.000.000/0000-00" className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn rounded="right">
                    <Search className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>
              <div className="col-span-12 md:col-span-7">
                <label className={labelClass}>Empresa de Faturamento</label>
                <div className="flex">
                  <Input placeholder="Nome da empresa" className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn title="Nova Empresa" rounded="none" onClick={() => { setPersonType('Jurídica'); setIsPersonModalOpen(true); }}>
                    <Plus className="w-3.5 h-3.5" />
                  </ActionBtn>
                  <ActionBtn title="Editar Empresa" rounded="right" onClick={() => { setPersonType('Jurídica'); setIsPersonModalOpen(true); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== ACOMPANHANTES ==================== */}
          <section id="acompanhantes" ref={setSectionRef('acompanhantes')} className={sectionClass}>
            <h2 className="text-sm font-bold mb-4 text-foreground">Acompanhantes (1)</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              {/* CPF(3) | Nome+[+|✏](5) | Tipo(2) | Idade(1) | Adicionar(1) */}
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>CPF / ID</label>
                <div className="flex">
                  <Input placeholder="000.000.000-00 / 0000" className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn rounded="right">
                    <Search className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className={labelClass}>Nome do Acompanhante</label>
                <div className="flex">
                  <Input placeholder="Pesquisar Acompanhante..." className={`${inputClass} flex-1 rounded-r-none border-r-0`} />
                  <ActionBtn title="Novo Cadastro" rounded="none" onClick={() => { setPersonType('Física'); setIsPersonModalOpen(true); }}>
                    <Plus className="w-4 h-4" />
                  </ActionBtn>
                  <ActionBtn title="Editar Cadastro" rounded="right" onClick={() => { setPersonType('Física'); setIsPersonModalOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </ActionBtn>
                </div>
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Tipo</label>
                <select id="acomp-tipo" className={selectClass} onChange={(e) => {
                  const idadeField = document.getElementById('acomp-idade') as HTMLSelectElement | null;
                  if (idadeField) idadeField.disabled = e.target.value !== 'Criança';
                }}>
                  <option>Adulto</option>
                  <option>Criança</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-1">
                <label className={labelClass}>Idade</label>
                <select id="acomp-idade" disabled defaultValue="" className={`${selectClass} opacity-50 cursor-not-allowed`}>
                  <option value="">Selecione</option>
                  {Array.from({ length: 18 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="col-span-12 md:col-span-1 flex items-end">
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
                    <th className={thClass} style={{ width: '100px' }}>Dia</th>
                    <th className={thClass}>Tarifa</th>
                    <th className={thClass} style={{ width: '160px' }}>Diária</th>
                    <th className={thClass} style={{ width: '80px' }}>Replicar</th>
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
            <h2 className="text-sm font-bold text-foreground mb-4">Recebimentos</h2>

            <div className="bg-card border border-border rounded-lg mb-6 overflow-hidden">
              <div className="h-10 flex items-center overflow-x-auto bg-secondary/50 border-b border-border px-3 gap-0.5">
                {[
                  { id: 'dinheiro', label: 'Dinheiro', icon: DollarSign },
                  { id: 'deposito', label: 'Depósito', icon: Home },
                  { id: 'cartao', label: 'Cartão', icon: CreditCard },
                  { id: 'outros', label: 'Outros', icon: Zap },
                  { id: 'conta_hospede', label: 'Conta Hóspede', icon: Users }
                ].map(tab => {
                   const isActive = receiptTab === tab.id;
                   const Icon = tab.icon;
                   return (
                     <button
                        key={tab.id}
                        type="button"
                        onClick={() => setReceiptTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors whitespace-nowrap text-xs font-medium ${isActive
                            ? 'bg-card text-primary shadow-sm border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                        }`}
                     >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                     </button>
                   );
                })}
              </div>

              <div className="p-4">
                {receiptTab === 'dinheiro' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-300">
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Valor (R$):</label>
                      <Input 
                        className={`${inputClass} ${receiptError ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                        value={receiptValor}
                        onChange={(e) => {
                          setReceiptValor(formatCurrency(e.target.value));
                          if (receiptError) setReceiptError(false);
                        }}
                        placeholder="0,00" 
                      />
                      {receiptError && <span className="text-xs text-destructive mt-1 block">O valor não pode ser menor ou igual a 0</span>}
                    </div>
                  </div>
                )}
                
                {receiptTab === 'deposito' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-300">
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Banca/Banco:</label>
                      <select className={selectClass} value={receiptBanco} onChange={(e) => setReceiptBanco(e.target.value)}>
                        <option value="Banco do Brasil">Banco do Brasil</option>
                        <option value="Caixa Econômica">Caixa Econômica</option>
                        <option value="Itaú">Itaú</option>
                        <option value="Bradesco">Bradesco</option>
                        <option value="Nubank">Nubank</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Data:</label>
                      <div className="relative flex items-center">
                        <Input 
                          type="date" 
                          value={receiptData}
                          onChange={(e) => setReceiptData(e.target.value)}
                          className={`${inputClass} flex-1 rounded-r-none border-r-0 pr-2 text-xs [&::-webkit-calendar-picker-indicator]:hidden`} 
                        />
                        <ActionBtn 
                          rounded="right" 
                          // @ts-ignore
                          onClick={(e) => e.currentTarget.previousElementSibling?.showPicker?.()}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </ActionBtn>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Valor (R$):</label>
                      <Input 
                        className={`${inputClass} ${receiptError ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                        value={receiptValor}
                        onChange={(e) => {
                          setReceiptValor(formatCurrency(e.target.value));
                          if (receiptError) setReceiptError(false);
                        }}
                        placeholder="0,00" 
                      />
                      {receiptError && <span className="text-xs text-destructive mt-1 block">O valor não pode ser menor ou igual a 0</span>}
                    </div>
                  </div>
                )}

                {receiptTab === 'cartao' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-300">
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Operação:</label>
                      <select className={selectClass} value={receiptOperacao} onChange={(e) => {
                         setReceiptOperacao(e.target.value);
                         if (e.target.value === 'Débito') setReceiptParcelas('1');
                      }}>
                        <option value="Débito">Débito</option>
                        <option value="Crédito">Crédito</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Operadora:</label>
                      <select className={selectClass} value={receiptOperadora} onChange={(e) => setReceiptOperadora(e.target.value)}>
                        <option value="Visa Débito">Visa Débito</option>
                        <option value="Mastercard Crédito">Mastercard Crédito</option>
                        <option value="Elo Crédito">Elo Crédito</option>
                        <option value="American Express">American Express</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Parcelas:</label>
                      <select 
                         className={`${selectClass} ${receiptOperacao === 'Débito' ? 'bg-muted cursor-not-allowed text-muted-foreground' : ''}`}
                         value={receiptParcelas} 
                         disabled={receiptOperacao === 'Débito'}
                         onChange={(e) => setReceiptParcelas(e.target.value)}
                      >
                        {[...Array(12)].map((_, i) => (
                           <option key={i+1} value={String(i+1)}>{i+1}x</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className={labelClass}>Data:</label>
                      <div className="relative flex items-center">
                        <Input 
                          type="date" 
                          value={receiptData}
                          onChange={(e) => setReceiptData(e.target.value)}
                          className={`${inputClass} flex-1 rounded-r-none border-r-0 pr-2 text-xs [&::-webkit-calendar-picker-indicator]:hidden`} 
                        />
                        <ActionBtn 
                          rounded="right" 
                          // @ts-ignore
                          onClick={(e) => e.currentTarget.previousElementSibling?.showPicker?.()}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </ActionBtn>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className={labelClass}>Aut. (Autorização):</label>
                      <Input className={inputClass} value={receiptAut} onChange={(e) => setReceiptAut(e.target.value)} placeholder="Código" />
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className={labelClass}>NSU:</label>
                      <Input className={inputClass} value={receiptNSU} onChange={(e) => setReceiptNSU(e.target.value)} placeholder="NSU" />
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className={labelClass}>Valor (R$):</label>
                      <Input 
                        className={`${inputClass} ${receiptError ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                        value={receiptValor}
                        onChange={(e) => {
                          setReceiptValor(formatCurrency(e.target.value));
                          if (receiptError) setReceiptError(false);
                        }}
                        placeholder="0,00" 
                      />
                      {receiptError && <span className="text-xs text-destructive mt-1 block">O valor não pode ser menor ou igual a 0</span>}
                    </div>
                  </div>
                )}

                {receiptTab === 'outros' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-300">
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Forma de Pagamento:</label>
                      <select className={selectClass} value={receiptOutrosForma} onChange={(e) => setReceiptOutrosForma(e.target.value)}>
                        <option value="PIX">PIX</option>
                        <option value="Vale Alimentação">Vale Alimentação</option>
                        <option value="Vale Refeição">Vale Refeição</option>
                        <option value="Convênio">Convênio</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Data:</label>
                      <div className="relative flex items-center">
                        <Input 
                          type="date" 
                          value={receiptData}
                          onChange={(e) => setReceiptData(e.target.value)}
                          className={`${inputClass} flex-1 rounded-r-none border-r-0 pr-2 text-xs [&::-webkit-calendar-picker-indicator]:hidden`} 
                        />
                        <ActionBtn 
                          rounded="right" 
                          // @ts-ignore
                          onClick={(e) => e.currentTarget.previousElementSibling?.showPicker?.()}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </ActionBtn>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Valor (R$):</label>
                      <Input 
                        className={`${inputClass} ${receiptError ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                        value={receiptValor}
                        onChange={(e) => {
                          setReceiptValor(formatCurrency(e.target.value));
                          if (receiptError) setReceiptError(false);
                        }}
                        placeholder="0,00" 
                      />
                      {receiptError && <span className="text-xs text-destructive mt-1 block">O valor não pode ser menor ou igual a 0</span>}
                    </div>
                  </div>
                )}

                {receiptTab === 'conta_hospede' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-300">
                    <div className="col-span-12 sm:col-span-5">
                      <label className={labelClass}>Titular/Empresa:</label>
                      <select className={`${selectClass} bg-muted cursor-not-allowed`} disabled>
                        <option>JULIO CALIBERDA (Titular)</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-4 flex flex-col justify-end">
                      <div className="w-full truncate px-3 py-1.5 bg-secondary/50 rounded-md border border-border h-9 flex items-center gap-2">
                         <span className="text-xs font-semibold text-muted-foreground">Saldo Disponível:</span>
                         <span className="text-sm font-bold text-success">R$ 5.000,00</span>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className={labelClass}>Valor (R$):</label>
                      <Input 
                        className={`${inputClass} ${receiptError ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                        value={receiptValor}
                        onChange={(e) => {
                          setReceiptValor(formatCurrency(e.target.value));
                          if (receiptError) setReceiptError(false);
                        }}
                        placeholder="0,00" 
                      />
                      {receiptError && <span className="text-xs text-destructive mt-1 block">O valor não pode ser menor ou igual a 0</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end p-3 border-t border-border bg-secondary/30">
                <Button size="sm" type="button" className="h-8 text-xs bg-success hover:bg-success/90 text-success-foreground" onClick={handleSaveReceipt}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Recebimento
                </Button>
              </div>
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
                  {recebimentos.map(rec => (
                    <tr key={rec.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className={tdClass}>{rec.data}</td>
                      <td className={tdClass}>{rec.historico}</td>
                      <td className={tdClass}>{rec.caixaBanco}</td>
                      <td className={tdClass}>{rec.tipo}</td>
                      <td className={`${tdClass} font-bold text-success`}>R$ {rec.valor}</td>
                      <td className={tdClass}>
                        <button className="text-destructive hover:text-destructive/80 p-0.5" onClick={() => setRecebimentos(prev => prev.filter(p => p.id !== rec.id))}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>Garagem</label>
                <Input placeholder="Nº Garagem" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Placa</label>
                <Input placeholder="ABC-1234" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Cor</label>
                <Input placeholder="Cor" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>Modelo</label>
                <Input placeholder="Modelo" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-2 flex items-end">
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>Produto/Serviço</label>
                <Input placeholder="Buscar produto..." className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Frequência</label>
                <select className={selectClass}>
                  <option>Única</option>
                  <option>Diariamente</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>PDV</label>
                <select className={selectClass}>
                  <option>Recepção</option>
                  <option>Restaurante</option>
                  <option>Frigobar</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-1">
                <label className={labelClass}>Qtd.</label>
                <Input placeholder="1" type="number" min="1" defaultValue="1" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Valor</label>
                <Input 
                  placeholder="0,00" 
                  className={`${inputClass} w-full`}
                  value={extraValor}
                  onChange={(e) => setExtraValor(formatCurrency(e.target.value))}
                />
              </div>
              <div className="col-span-12 md:col-span-2 flex items-end">
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Código</label>
                <Input placeholder="Código da pulseira" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className={labelClass}>Nome do Hóspede</label>
                <Input placeholder="Nome" className={`${inputClass} w-full`} />
              </div>
              <div className="col-span-12 md:col-span-3 flex items-end">
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
        <div className="flex flex-col md:flex-row md:h-14 p-4 md:p-0 md:px-5 items-center justify-center md:justify-end gap-4 border-t border-border bg-card rounded-b-lg flex-shrink-0">
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

      {/* UH Selection Modal */}
      {isUhModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <div className="bg-card w-[95vw] md:w-full md:max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Selecionar Nova UH</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Escolha a acomodação para Walk-in/check-in</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUhModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-card rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Body */}
            <div className="p-5 overflow-y-auto max-h-[60vh] bg-secondary/10">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {roomsData.map((room) => {
                  const isSelected = selectedUh.id === room.id;
                  const Icon = room.type === 'SNG' ? BedSingle : room.type === 'DBL' ? BedDouble : Bed;
                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedUh(room);
                        setIsUhModalOpen(false);
                      }}
                      className={`relative flex flex-col items-center justify-center pt-4 pb-3 px-2 rounded-xl border-2 transition-all duration-200 group ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground hover:shadow-sm'
                      }`}
                    >
                      {/* Top right check icon when selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 animate-in zoom-in">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </div>
                      )}
                      
                      <div className={`p-2.5 rounded-full mb-2.5 transition-colors duration-200 ${
                        isSelected ? 'bg-primary/20 text-primary' : 'bg-secondary group-hover:bg-primary/10 text-slate-400 group-hover:text-primary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="text-center w-full">
                        <div className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {room.number}
                        </div>
                        <div className="text-[10px] font-semibold tracking-wider uppercase opacity-80 mt-0.5">
                          {room.type}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Action Bar */}
            <div className="h-14 flex items-center justify-end px-5 border-t border-border bg-secondary/30">
               <Button size="sm" className="bg-card text-foreground hover:bg-secondary border border-border transition-colors" onClick={() => setIsUhModalOpen(false)}>Cancelar Operação</Button>
            </div>
          </div>
        </div>
      )}

      {/* Person/Company Registration Modal */}
      {isPersonModalOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[70] animate-in fade-in duration-200"
          onClick={() => setIsPersonModalOpen(false)}
        >
          <div 
            className="bg-card w-[95vw] md:w-full md:max-w-3xl rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Cadastrar Solicitante</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Nova Pessoa {personType}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPersonModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-card rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex flex-col h-full bg-secondary/10">
              {/* Tabs */}
              <div className="flex px-5 pt-5 pb-0 gap-4">
                <button 
                  onClick={() => setPersonModalTab('main')}
                  className={`flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-t-lg font-bold text-sm transition-all border-b-2 ${
                    personModalTab === 'main' ? 'border-primary text-primary bg-card shadow-[0_-2px_6px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'border-transparent text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  <IdCard className="w-4 h-4" /> Informações Principais
                </button>
                <button 
                  onClick={() => setPersonModalTab('address')}
                  className={`flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-t-lg font-bold text-sm transition-all border-b-2 ${
                    personModalTab === 'address' ? 'border-primary text-primary bg-card shadow-[0_-2px_6px_rgba(0,0,0,0.02)] translate-y-[1px]' : 'border-transparent text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  <MapPin className="w-4 h-4" /> Informações de Endereço
                </button>
              </div>

              {/* Tab Content - FIXED HEIGHT FOR PERSISTENCE */}
              <div className="p-5 overflow-y-auto bg-card rounded-b-xl border-t border-border shadow-sm mx-5 mb-5 mt-[-1px] h-[480px]">
                {personModalTab === 'main' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Line 1: Type + Name */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Tipo de Pessoa:</label>
                      <select className={selectClass} value={personType} onChange={(e) => setPersonType(e.target.value as 'Física' | 'Jurídica')}>
                        <option value="Física">Física</option>
                        <option value="Jurídica">Jurídica</option>
                      </select>
                    </div>
                    <div className="col-span-12 sm:col-span-8">
                      <label className={labelClass}>{personType === 'Física' ? 'Nome Completo' : 'Razão Social'}</label>
                      <Input className={inputClass} placeholder={personType === 'Física' ? 'Digite o nome completo' : 'Digite a razão social'} />
                    </div>

                    {/* Line 2: Nome Social / Fantasia */}
                    <div className="col-span-12">
                      <label className={labelClass}>{personType === 'Física' ? 'Nome Social' : 'Nome Fantasia'}</label>
                      <Input className={inputClass} placeholder={personType === 'Física' ? 'Digite o nome social (opcional)' : 'Digite o nome fantasia'} />
                    </div>

                    {/* Line 3: Doc / Doc */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className={labelClass}>
                        {personType === 'Física' ? (personEstrangeiro === 'SIM' ? 'ID' : 'CPF') : 'CNPJ'}
                      </label>
                      <Input className={inputClass} placeholder={personType === 'Física' ? (personEstrangeiro === 'SIM' ? 'Identidade Estrangeira' : '000.000.000-00') : '00.000.000/0000-00'} />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <label className={labelClass}>{personType === 'Física' ? 'RG' : 'IE'}</label>
                      <Input className={inputClass} placeholder={personType === 'Física' ? '00.000.000-0' : 'Inscrição Estadual'} />
                    </div>

                    {/* Line 4: Email */}
                    <div className="col-span-12">
                      <label className={labelClass}>Email:</label>
                      <Input type="email" className={inputClass} placeholder="email@exemplo.com" />
                    </div>

                    {/* Line 5: Data / Tel / Cel */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Data Nascimento:</label>
                      <div className="relative flex items-center">
                        <Input 
                          type="date" 
                          className={`${inputClass} flex-1 rounded-r-none border-r-0 pr-2 text-xs [&::-webkit-calendar-picker-indicator]:hidden`} 
                        />
                        <ActionBtn 
                          rounded="right" 
                          // @ts-ignore
                          onClick={(e) => e.currentTarget.previousElementSibling?.showPicker?.()}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </ActionBtn>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Telefone:</label>
                      <Input type="tel" className={inputClass} placeholder="(00) 0000-0000" />
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Celular:</label>
                      <Input type="tel" className={inputClass} placeholder="(00) 00000-0000" />
                    </div>

                    {/* Line 6: Estrangeiro */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>Estrangeiro:</label>
                      <select className={selectClass} value={personEstrangeiro} onChange={(e) => setPersonEstrangeiro(e.target.value)}>
                        <option value="NÃO">NÃO</option>
                        <option value="SIM">SIM</option>
                      </select>
                    </div>
                    
                    {personEstrangeiro === 'SIM' && (
                      <div className="col-span-12 sm:col-span-8 animate-in fade-in zoom-in-95 duration-200">
                        <label className={labelClass}>Passaporte:</label>
                        <Input className={inputClass} placeholder="Número do Passaporte" />
                      </div>
                    )}

                    {/* Line 7: Observação */}
                    <div className="col-span-12">
                      <label className={labelClass}>Observação:</label>
                      <textarea className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary bg-card h-24 resize-none" placeholder="Adicione alguma observação se necessário..." />
                    </div>
                  </div>
                )}

                {personModalTab === 'address' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Line 1: CEP + Endereço */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className={labelClass}>CEP:</label>
                      <div className="flex">
                        <Input className={`${inputClass} rounded-r-none border-r-0`} placeholder="00000-000" />
                        <ActionBtn rounded="right" title="Buscar CEP"><Search className="w-3.5 h-3.5" /></ActionBtn>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-8">
                      <label className={labelClass}>Endereço:</label>
                      <Input className={inputClass} placeholder="Nome da rua/avenida..." />
                    </div>

                    {/* Line 2: Cidade + Estado */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className={labelClass}>Cidade:</label>
                      <div className="flex">
                        <Input 
                          className={`${inputClass} ${personEstrangeiro !== 'SIM' ? 'bg-muted cursor-not-allowed text-muted-foreground' : ''} ${personEstrangeiro === 'SIM' ? 'rounded-r-none border-r-0' : ''} flex-1`} 
                          placeholder={personEstrangeiro === 'SIM' ? 'Selecione ou adicione a cidade' : 'Cidade preenchida via CEP'}
                          readOnly={personEstrangeiro !== 'SIM'}
                        />
                        {personEstrangeiro === 'SIM' && (
                          <ActionBtn 
                            rounded="right" 
                            title="Cadastrar Nova Cidade Estrangeira" 
                            onClick={() => setIsCityModalOpen(true)}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </ActionBtn>
                        )}
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <label className={labelClass}>Estado:</label>
                      <Input 
                        className={`${inputClass} ${personEstrangeiro !== 'SIM' ? 'bg-muted cursor-not-allowed text-muted-foreground' : ''}`} 
                        placeholder={personEstrangeiro === 'SIM' ? 'UF ou Estado' : 'UF preenchida via CEP'}
                        readOnly={personEstrangeiro !== 'SIM'}
                      />
                    </div>

                    {/* Line 3: País */}
                    <div className="col-span-12">
                      <label className={labelClass}>País:</label>
                      <select className={selectClass} defaultValue="BRASIL">
                        <option value="BRASIL">BRASIL</option>
                        <option value="ARGENTINA">ARGENTINA</option>
                        <option value="ESTADOS UNIDOS">ESTADOS UNIDOS</option>
                        <option value="OUTRO">OUTRO PAÍS</option>
                      </select>
                    </div>

                    {/* Line 4: Bairro + Numero */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className={labelClass}>Bairro:</label>
                      <Input className={inputClass} placeholder="Bairro" />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <label className={labelClass}>Número:</label>
                      <Input className={inputClass} placeholder="Nº" />
                    </div>

                    {/* Line 5: Complemento */}
                    <div className="col-span-12">
                      <label className={labelClass}>Complemento:</label>
                      <Input className={inputClass} placeholder="Apto, Bloco, etc." />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="h-16 flex items-center justify-end px-5 gap-3 border-t border-border bg-card mt-auto rounded-b-xl">
               <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors" onClick={() => setIsPersonModalOpen(false)}>
                 <X className="w-4 h-4 mr-1" /> Fechar
               </Button>
               <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" onClick={() => setIsPersonModalOpen(false)}>
                 <Save className="w-4 h-4 mr-1" /> Salvar Cadastro
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Foreign City Registration Modal */}
      {isCityModalOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[80] animate-in fade-in duration-200" 
          onClick={() => setIsCityModalOpen(false)}
        >
          <div 
            className="bg-card w-full max-w-sm rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="h-12 flex items-center justify-between px-4 border-b border-border bg-secondary/30">
              <h2 className="text-sm font-bold text-foreground">Cadastrar Cidade</h2>
              <button 
                onClick={() => setIsCityModalOpen(false)} 
                className="p-1 hover:bg-card rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 bg-secondary/10">
               <div>
                  <label className={labelClass}>Nome da Cidade Estrangeira:</label>
                  <Input autoFocus className={inputClass} placeholder="Ex: Buenos Aires" />
               </div>
            </div>
            <div className="h-14 flex items-center justify-end px-4 gap-3 border-t border-border bg-card">
               <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors" onClick={() => setIsCityModalOpen(false)}>
                 <X className="w-4 h-4 mr-1" /> Cancelar
               </Button>
               <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors" onClick={() => setIsCityModalOpen(false)}>
                 <Save className="w-4 h-4 mr-1"/> Salvar
               </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
