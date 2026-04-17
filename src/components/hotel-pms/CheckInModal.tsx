import { useState, useRef, useEffect, useMemo } from 'react';
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

type Person = { id: string; name: string; document: string; type: 'PF' | 'PJ' };
const mockPeople: Person[] = [
  { id: '1', name: 'João Silva', document: '111.111.111-11', type: 'PF' },
  { id: '2', name: 'Maria Souza', document: '222.222.222-22', type: 'PF' },
  { id: '3', name: 'Carlos Santos', document: '333.333.333-33', type: 'PF' },
  { id: '4', name: 'Ana Oliveira', document: '444.444.444-44', type: 'PF' },
  { id: '5', name: 'Pedro Costa', document: '555.555.555-55', type: 'PF' },
  { id: '6', name: 'Tech Solutions LTDA', document: '11.111.111/0001-11', type: 'PJ' },
  { id: '7', name: 'Global Services SA', document: '22.222.222/0001-22', type: 'PJ' },
  { id: '8', name: 'Inova Brasil ME', document: '33.333.333/0001-33', type: 'PJ' },
  { id: '9', name: 'Julio Caliberda', document: '123.456.789-00', type: 'PF' },
  { id: '10', name: 'Travel Agency Corp', document: '44.444.444/0001-44', type: 'PJ' },
];

type Product = { id: string; cod: string; desc: string; pdv: string; valor: number };
const mockProducts: Product[] = [
  { id: 'p1', cod: '336016', desc: 'Refrigerante 350ml', pdv: 'Bar', valor: 5.00 },
  { id: 'p2', cod: '336017', desc: 'Água Mineral 500ml', pdv: 'Bar', valor: 4.00 },
  { id: 'p3', cod: '336018', desc: 'Cerveja Long Neck', pdv: 'Bar', valor: 12.00 },
  { id: 'p4', cod: '336019', desc: 'Hambúrguer Artesanal', pdv: 'Restaurante', valor: 35.00 },
  { id: 'p5', cod: '336020', desc: 'Porção de Fritas', pdv: 'Restaurante', valor: 25.00 },
  { id: 'p6', cod: '336021', desc: 'Suco Natural', pdv: 'Restaurante', valor: 10.00 },
  { id: 'p7', cod: '336022', desc: 'Café Expresso', pdv: 'Recepção', valor: 6.00 },
  { id: 'p8', cod: '336023', desc: 'Chocolate em Barra', pdv: 'Frigobar', valor: 8.00 },
  { id: 'p9', cod: '336024', desc: 'Vinho Tinto Misto', pdv: 'Restaurante', valor: 89.00 },
  { id: 'p10', cod: '336025', desc: 'Amendoim Japonês', pdv: 'Frigobar', valor: 7.00 },
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
      <span className={className}>{children}</span>
    </Button>
  );
};

const Autocomplete = ({
  items,
  placeholder,
  value,
  onChange,
  renderItem,
  onSelect,
}: {
  items: any[];
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  renderItem: (item: any) => React.ReactNode;
  onSelect: (item: any) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => { setHighlightedIndex(-1); }, [items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1" ref={ref}>
      <Input
        placeholder={placeholder}
        className="h-9 text-sm w-full rounded-r-none border-r-0"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
            setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open && e.key === 'ArrowDown') {
             setOpen(true);
             return;
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (open && highlightedIndex >= 0 && highlightedIndex < items.length) {
              onSelect(items[highlightedIndex]);
              setOpen(false);
            }
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      {open && items.length > 0 && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-y-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 text-sm cursor-pointer ${
                highlightedIndex === idx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
      {open && items.length === 0 && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md p-3 text-sm text-muted-foreground text-center">
          Nenhum resultado encontrado.
        </div>
      )}
    </div>
  );
};

const formatCpf = (v: string) => {
  let val = v.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  return val.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatCnpj = (v: string) => {
  let val = v.replace(/\D/g, '');
  if (val.length > 14) val = val.slice(0, 14);
  return val.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
};

const ErrorMessage = ({ msg, className = '' }: { msg: string, className?: string }) => {
  if (!msg) return null;
  return <div className={`text-xs text-destructive font-medium mt-1 ${className}`}>{msg}</div>;
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
  // Tariff definitions with pension types
  const TARIFAS = [
    { id: '1', name: 'RESORT CLASSIC', pension: 'cafe_manha', pensionLabel: 'Café da Manhã' },
    { id: '2', name: 'GRAND RELAX', pension: 'meia_almoco', pensionLabel: 'Meia Pensão Almoço' },
    { id: '3', name: 'SUNSET PREMIUM', pension: 'meia_jantar', pensionLabel: 'Meia Pensão Jantar' },
    { id: '4', name: 'FULL EXPERIENCE', pension: 'completa', pensionLabel: 'Pensão Completa' },
    { id: '5', name: 'TOTAL FREEDOM', pension: 'all_inclusive', pensionLabel: 'All Inclusive' },
  ] as const;

  type TarifaId = typeof TARIFAS[number]['id'];
  type PensionType = typeof TARIFAS[number]['pension'];

  // Per-day tariff values — storing localized string formats
  const [tarifaValues, setTarifaValues] = useState<string[]>(['199,00']);
  const [tarifaGlobal, setTarifaGlobal] = useState<TarifaId>('1');

  const selectedTarifa = TARIFAS.find(t => t.id === tarifaGlobal) ?? TARIFAS[0];

  const [checkInDate, setCheckInDate] = useState('2026-03-26T14:00');
  const [checkOutDate, setCheckOutDate] = useState('2026-03-27T11:59');

  const { diarias, nights, calendarDays } = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const today = new Date().toLocaleDateString('pt-BR');
      return { diarias: 1, nights: [today], calendarDays: [today, new Date(Date.now() + 86400000).toLocaleDateString('pt-BR')] };
    }

    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    let diffDays = Math.round((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) diffDays = 0;

    const tariffCount = Math.max(1, diffDays);
    const nightsArr = [];
    for (let i = 0; i < tariffCount; i++) {
      const d = new Date(startDay);
      d.setDate(d.getDate() + i);
      nightsArr.push(d.toLocaleDateString('pt-BR'));
    }

    const calCount = Math.max(1, diffDays + 1);
    const calDaysArr = [];
    for (let i = 0; i < calCount; i++) {
      const d = new Date(startDay);
      d.setDate(d.getDate() + i);
      calDaysArr.push(d.toLocaleDateString('pt-BR'));
    }

    return { diarias: diffDays, nights: nightsArr, calendarDays: calDaysArr };
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    setTarifaValues(prev => {
      if (prev.length === nights.length) return prev;
      const newArr = [...prev];
      while (newArr.length < nights.length) newArr.push(prev[prev.length - 1] || '199,00');
      return newArr.slice(0, nights.length);
    });
  }, [nights.length]);

  // Compute which meals are active per day based on pension + 1-daily rule
  const getMealState = (dayIdx: number, meal: 'cafe' | 'almoco' | 'jantar'): boolean => {
    const pension = selectedTarifa.pension;
    const isCheckInDay = dayIdx === 0;

    const includesCafe = ['cafe_manha', 'meia_almoco', 'meia_jantar', 'completa', 'all_inclusive'].includes(pension);
    const includesAlmoco = ['meia_almoco', 'completa', 'all_inclusive'].includes(pension);
    const includesJantar = ['meia_jantar', 'completa', 'all_inclusive'].includes(pension);

    if (isCheckInDay) {
      if (meal === 'jantar') return includesJantar;
      return false;
    }

    // Normal rules for day 1+
    if (meal === 'cafe') return includesCafe;
    if (meal === 'almoco') return includesAlmoco;
    if (meal === 'jantar') return includesJantar;
    return false;
  };

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
    setTarifaValues(Array(nights.length).fill(value));
  };

  const totalTarifas = tarifaValues.reduce((acc, val) => {
    const num = parseFloat(val.replace(/\./g, '').replace(',', '.'));
    return isNaN(num) ? acc : acc + num;
  }, 0);

  const totalRecebido = recebimentos.reduce((acc, rec) => {
    const num = parseFloat(rec.valor.replace(/\./g, '').replace(',', '.'));
    return isNaN(num) ? acc : acc + num;
  }, 0);

  const [titularBusca, setTitularBusca] = useState('');
  const [titularSelected, setTitularSelected] = useState<Person | null>(null);
  const [titularDoc, setTitularDoc] = useState('');

  const [empresaBusca, setEmpresaBusca] = useState('');
  const [empresaSelected, setEmpresaSelected] = useState<Person | null>(null);
  const [empresaDoc, setEmpresaDoc] = useState('');

  const [acompBusca, setAcompBusca] = useState('');
  const [acompSelected, setAcompSelected] = useState<Person | null>(null);
  const [acompDoc, setAcompDoc] = useState('');
  const [acompTipo, setAcompTipo] = useState('Adulto');
  const [acompIdade, setAcompIdade] = useState('');

  const [acompanhantes, setAcompanhantes] = useState<any[]>([
    { id: 'mock1', tipo: 'Adulto', nome: 'JULIO CALIBERDA', cpf: '123.456.789-00', idade: '—', personId: '9' }
  ]);

  const [pulseiraCodigo, setPulseiraCodigo] = useState('');
  const [pulseiraHospedeBusca, setPulseiraHospedeBusca] = useState('');
  const [pulseiraHospedeSelected, setPulseiraHospedeSelected] = useState<{id: string, name: string} | null>(null);
  const [pulseiras, setPulseiras] = useState<any[]>([]);

  const [titularError, setTitularError] = useState('');
  const [empresaError, setEmpresaError] = useState('');
  const [acompError, setAcompError] = useState('');
  const [extraError, setExtraError] = useState('');
  const [pulseiraError, setPulseiraError] = useState('');

  useEffect(() => { setTitularError(''); }, [titularBusca, titularDoc]);
  useEffect(() => { setEmpresaError(''); }, [empresaBusca, empresaDoc]);
  useEffect(() => { setAcompError(''); }, [acompBusca, acompDoc]);
  useEffect(() => { setPulseiraError(''); }, [pulseiraCodigo, pulseiraHospedeBusca, pulseiraHospedeSelected]);

  const hospedesDisponiveis = [
    ...(titularSelected ? [{ id: titularSelected.id, name: titularSelected.name, role: 'Titular', faixa: 'Adulto' }] 
        : titularBusca.trim() ? [{ id: 'titular_manual', name: titularBusca, role: 'Titular', faixa: 'Adulto' }] 
        : [{ id: 'titular_null', name: 'Titular Não Informado', role: 'Titular', faixa: 'Adulto' }]),
    ...acompanhantes.map((a, i) => ({ id: a.id || a.personId || `acomp-${i}`, name: a.nome, role: 'Acompanhante', faixa: a.tipo }))
  ];

  const [extraBusca, setExtraBusca] = useState('');
  const [extraSelected, setExtraSelected] = useState<Product | null>(null);
  const [extraFreq, setExtraFreq] = useState('Única');
  const [extraPdv, setExtraPdv] = useState('Recepção');
  const [extraQtd, setExtraQtd] = useState(1);

  const [extrasList, setExtrasList] = useState([
    { id: '1', cod: '336016', desc: 'Refrigerante 350ml', pdv: 'Bar', freq: 'Diariamente', qtd: 1, valor: 5.00, subtotal: 5.00 }
  ]);

  const totalExtras = extrasList.reduce((acc, curr) => acc + curr.subtotal, 0);

  const totalGeral = totalTarifas + totalExtras;
  const emAberto = Math.max(0, totalGeral - totalRecebido);

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
        <div className="h-12 flex items-center overflow-x-auto bg-secondary/50 border-b border-border px-5 gap-1 flex-shrink-0">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors whitespace-nowrap text-sm font-medium ${isActive
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
                      value={checkInDate}
                      onChange={e => setCheckInDate(e.target.value)}
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
                      value={checkOutDate}
                      onChange={e => setCheckOutDate(e.target.value)}
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
                  <Input type="number" value={diarias} readOnly disabled className={`${inputClass} w-full bg-muted text-center font-bold`} />
                </div>
              </div>

              {/* Linha 2: CPF(3) | Titular+[+|✏](9) */}
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>CPF / ID</label>
                <div className="flex">
                  <Input 
                    placeholder="000.000.000-00 / 0000" 
                    value={titularDoc}
                    onChange={(e) => setTitularDoc(formatCpf(e.target.value))}
                    className={`${inputClass} flex-1 rounded-r-none border-r-0`} 
                  />
                  <ActionBtn title="Buscar CPF" rounded="right" onClick={() => {
                    const found = mockPeople.find(p => p.type === 'PF' && p.document === titularDoc);
                    if (found) {
                      setTitularSelected(found);
                      setTitularBusca(found.name);
                    } else {
                      setTitularError('CPF não encontrado.');
                    }
                  }}>
                    <Search className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
                <ErrorMessage msg={titularError} />
              </div>
              <div className="col-span-12 md:col-span-9">
                <label className={labelClass}>Titular</label>
                <div className="flex">
                  <Autocomplete 
                     placeholder="Pesquisar titular..."
                     items={mockPeople.filter(p => p.type === 'PF' && p.name.toLowerCase().includes(titularBusca.toLowerCase()))}
                     value={titularSelected ? titularSelected.name : titularBusca}
                     onChange={(v) => { setTitularBusca(v); setTitularSelected(null); }}
                     renderItem={(item) => <div className="font-medium">{item.name} <span className="text-muted-foreground text-xs ml-2">{item.document}</span></div>}
                     onSelect={(item) => {
                         setTitularSelected(item);
                         setTitularDoc(item.document);
                     }}
                  />
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
                <Input type="tel" maxLength={20} placeholder="(00) 00000-0000" className={`${inputClass} w-full`} />
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
                  <Input 
                    placeholder="00.000.000/0000-00" 
                    value={empresaDoc}
                    onChange={(e) => setEmpresaDoc(formatCnpj(e.target.value))}
                    className={`${inputClass} flex-1 rounded-r-none border-r-0`} 
                  />
                  <ActionBtn title="Buscar CNPJ" rounded="right" onClick={() => {
                    const found = mockPeople.find(p => p.type === 'PJ' && p.document === empresaDoc);
                    if (found) {
                      setEmpresaSelected(found);
                      setEmpresaBusca(found.name);
                    } else {
                      setEmpresaError('CNPJ não encontrado.');
                    }
                  }}>
                    <Search className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
                <ErrorMessage msg={empresaError} />
              </div>
              <div className="col-span-12 md:col-span-7">
                <label className={labelClass}>Empresa de Faturamento</label>
                <div className="flex">
                  <Autocomplete 
                     placeholder="Nome da empresa"
                     items={mockPeople.filter(p => p.type === 'PJ' && p.name.toLowerCase().includes(empresaBusca.toLowerCase()))}
                     value={empresaSelected ? empresaSelected.name : empresaBusca}
                     onChange={(v) => { setEmpresaBusca(v); setEmpresaSelected(null); }}
                     renderItem={(item) => <div className="font-medium">{item.name} <span className="text-muted-foreground text-xs ml-2">{item.document}</span></div>}
                     onSelect={(item) => {
                         setEmpresaSelected(item);
                         setEmpresaDoc(item.document);
                     }}
                  />
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
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-bold text-foreground">Acompanhantes ({acompanhantes.length})</h2>
              <ErrorMessage msg={acompError} className="!mt-0" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              {/* CPF(3) | Nome+[+|✏](5) | Tipo(2) | Idade(1) | Adicionar(1) */}
              <div className="col-span-12 md:col-span-3">
                <label className={labelClass}>CPF / ID</label>
                <div className="flex">
                  <Input 
                    placeholder="000.000.000-00 / 0000" 
                    value={acompDoc}
                    onChange={(e) => setAcompDoc(formatCpf(e.target.value))}
                    className={`${inputClass} flex-1 rounded-r-none border-r-0`} 
                  />
                  <ActionBtn title="Buscar CPF" rounded="right" onClick={() => {
                    const found = mockPeople.find(p => p.type === 'PF' && p.document === acompDoc && p.id !== titularSelected?.id);
                    if (found) {
                      setAcompSelected(found);
                      setAcompBusca(found.name);
                    } else {
                      setAcompError('CPF não encontrado ou inválido.');
                    }
                  }}>
                    <Search className="w-3.5 h-3.5" />
                  </ActionBtn>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className={labelClass}>Nome do Acompanhante</label>
                <div className="flex">
                  <Autocomplete 
                     placeholder="Pesquisar Acompanhante..."
                     items={mockPeople.filter(p => p.type === 'PF' && p.id !== titularSelected?.id && p.name.toLowerCase().includes(acompBusca.toLowerCase()))}
                     value={acompSelected ? acompSelected.name : acompBusca}
                     onChange={(v) => { setAcompBusca(v); setAcompSelected(null); }}
                     renderItem={(item) => <div className="font-medium">{item.name} <span className="text-muted-foreground text-xs ml-2">{item.document}</span></div>}
                     onSelect={(item) => {
                         setAcompSelected(item);
                         setAcompDoc(item.document);
                     }}
                  />
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
                <select id="acomp-tipo" className={selectClass} value={acompTipo} onChange={(e) => {
                  setAcompTipo(e.target.value);
                  if (e.target.value !== 'Criança') setAcompIdade('');
                }}>
                  <option>Adulto</option>
                  <option>Criança</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-1">
                <label className={labelClass}>Idade</label>
                <select 
                  id="acomp-idade" 
                  disabled={acompTipo !== 'Criança'} 
                  value={acompIdade}
                  onChange={(e) => setAcompIdade(e.target.value)}
                  className={`${selectClass} ${acompTipo !== 'Criança' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">N/I</option>
                  {Array.from({ length: 18 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="col-span-12 md:col-span-1 flex items-end">
                <Button 
                   size="sm" 
                   className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground px-1.5"
                   onClick={() => {
                     if (!acompSelected && !acompBusca.trim()) {
                       setAcompError('Informe um acompanhante.');
                       return;
                     }
                     setAcompanhantes([...acompanhantes, {
                       id: Date.now().toString(),
                       tipo: acompTipo,
                       nome: acompSelected ? acompSelected.name : acompBusca,
                       cpf: acompDoc || '—',
                       idade: acompIdade || '—',
                       personId: acompSelected?.id || 'manual'
                     }]);
                     setAcompSelected(null);
                     setAcompBusca('');
                     setAcompDoc('');
                     setAcompTipo('Adulto');
                     setAcompIdade('');
                   }}
                >
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
                  {acompanhantes.map((acomp) => (
                    <tr key={acomp.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className={tdClass}>{acomp.tipo.toUpperCase()}</td>
                      <td className={`${tdClass} font-medium`}>{acomp.nome}</td>
                      <td className={tdClass}>{acomp.cpf}</td>
                      <td className={tdClass}>{acomp.idade}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1">
                          <button 
                             onClick={() => {
                               setPersonType('Física');
                               setIsPersonModalOpen(true);
                             }}
                             className="text-primary hover:text-primary/80 p-0.5"
                          ><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setAcompanhantes((prev: any[]) => prev.filter(p => p.id !== acomp.id))} className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {acompanhantes.length === 0 && (
                    <tr className="border-b border-border/50">
                       <td colSpan={5} className="text-center py-4 text-sm text-muted-foreground border-border/50">Nenhum acompanhante adicionado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== TARIFAS ==================== */}
          <section id="tarifas" ref={setSectionRef('tarifas')} className={sectionClass}>
            {/* Header: title + full-row tarifa selector + pension info badge */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-bold text-foreground whitespace-nowrap">Tarifas</h2>
              <label className={`${labelClass} mb-0 whitespace-nowrap`}>Tarifa:</label>
              {/* Selector fills available horizontal space */}
              <select
                className="h-8 px-2 border border-input rounded text-sm bg-card flex-1"
                value={tarifaGlobal}
                onChange={(e) => setTarifaGlobal(e.target.value as TarifaId)}
              >
                {TARIFAS.map(t => (
                  <option key={t.id} value={t.id}>{t.id} - {t.name}</option>
                ))}
              </select>
              {/* Pension info badge — right side */}
              <div className="flex items-center gap-1.5 h-8 px-3 border border-primary/30 rounded bg-primary/5 whitespace-nowrap flex-shrink-0">
                <Utensils className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Pensão: {selectedTarifa.pensionLabel}</span>
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
                  {nights.map((dia, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className={tdClass}>{dia}</td>
                      <td className={`${tdClass} text-muted-foreground font-medium`}>{selectedTarifa.id} - {selectedTarifa.name}</td>
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
                <tfoot>
                  <tr className="bg-primary/5 font-bold border-t-2 border-border">
                    <td colSpan={2} className={`${tdClass} text-right text-primary uppercase text-xs tracking-wider`}>Total de Tarifas</td>
                    <td className={`${tdClass} text-primary`}>R$ {formatCurrency(Math.round(totalTarifas * 100).toString())}</td>
                    <td className={tdClass}></td>
                  </tr>
                </tfoot>
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
              <div className="flex items-center gap-1.5 h-7 px-2.5 border border-primary/30 rounded bg-primary/5">
                <Utensils className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Pensão: {selectedTarifa.pensionLabel}</span>
              </div>
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
                  {calendarDays.flatMap((dia, dayIdx) => 
                    hospedesDisponiveis.map((hospede, hIdx) => (
                      <tr key={`${dayIdx}-${hIdx}`} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className={tdClass}>{hIdx === 0 ? dia.slice(0, 5) : ''}</td>
                        <td className={`${tdClass} font-medium`}>{hospede.name}</td>
                        <td className={tdClass}>{hospede.faixa}</td>
                        <td className={tdClass}>{hospede.role}</td>
                        <td className={`${tdClass} text-center`}>
                          <Checkbox
                            checked={getMealState(dayIdx, 'cafe')}
                            disabled
                            className={getMealState(dayIdx, 'cafe') ? 'opacity-100' : 'opacity-40'}
                          />
                        </td>
                        <td className={`${tdClass} text-center`}>
                          <Checkbox
                            checked={getMealState(dayIdx, 'almoco')}
                            disabled
                            className={getMealState(dayIdx, 'almoco') ? 'opacity-100' : 'opacity-40'}
                          />
                        </td>
                        <td className={`${tdClass} text-center`}>
                          <Checkbox
                            checked={getMealState(dayIdx, 'jantar')}
                            disabled
                            className={getMealState(dayIdx, 'jantar') ? 'opacity-100' : 'opacity-40'}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                  {calendarDays.length === 0 && (
                    <tr className="border-b border-border/50">
                      <td colSpan={7} className="text-center py-4 text-sm text-muted-foreground border-border/50">Nenhuma refeição disponível para este período.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pension rule note */}
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-semibold">Regra de pensão:</span> No dia do check-in, somente o <span className="font-semibold">jantar</span> é marcado (quando incluso). Café da manhã e almoço iniciam no dia seguinte.
            </p>
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
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-bold text-foreground">Lançamentos Extras</h2>
              <ErrorMessage msg={extraError} className="!mt-0" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Produto/Serviço</label>
                <Autocomplete 
                   placeholder="Pesquisar extra..."
                   items={mockProducts.filter(p => p.desc.toLowerCase().includes(extraBusca.toLowerCase()))}
                   value={extraSelected ? extraSelected.desc : extraBusca}
                   onChange={v => {
                      setExtraBusca(v);
                      setExtraSelected(null);
                      setExtraValor('');
                   }}
                   renderItem={item => <div className="font-medium">{item.desc} <span className="text-muted-foreground text-xs ml-2">R$ {formatCurrency(Math.round(item.valor * 100).toString())}</span></div>}
                   onSelect={item => {
                       setExtraSelected(item);
                       setExtraValor(formatCurrency(Math.round(item.valor * 100).toString()));
                   }}
                />
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>Frequência</label>
                <select className={selectClass} value={extraFreq} onChange={e => setExtraFreq(e.target.value)}>
                  <option>Única</option>
                  <option>Diariamente</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className={labelClass}>PDV</label>
                <select className={selectClass} value={extraPdv} onChange={e => setExtraPdv(e.target.value)}>
                  <option>Recepção</option>
                  <option>Bar</option>
                  <option>Restaurante</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-1">
                <label className={labelClass}>Qtd.</label>
                <Input type="number" min="1" className={`${inputClass} w-full`} value={extraQtd} onChange={e => setExtraQtd(Number(e.target.value))} />
              </div>
              <div className="col-span-12 md:col-span-1">
                <label className={labelClass}>Valor Unitário</label>
                <Input 
                  placeholder="0,00" 
                  className={`${inputClass} w-full`}
                  value={extraValor}
                  onChange={(e) => {
                      setExtraValor(formatCurrency(e.target.value));
                      setExtraError('');
                  }}
                />
              </div>
              <div className="col-span-12 md:col-span-2 flex items-end">
                <Button 
                   size="sm" 
                   className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                   onClick={() => {
                     if (!extraSelected) {
                       setExtraError('Selecione um produto.');
                       return;
                     }
                     const val = parseFloat(extraValor.replace(/\./g, '').replace(',', '.')) || 0;
                     if (val <= 0) {
                       setExtraError('Valor inválido.');
                       return;
                     }
                     setExtrasList([...extrasList, {
                       id: Date.now().toString(),
                       cod: extraSelected.cod,
                       desc: extraSelected.desc,
                       pdv: extraPdv,
                       freq: extraFreq,
                       qtd: extraQtd,
                       valor: val,
                       subtotal: val * extraQtd
                     }]);
                     setExtraSelected(null);
                     setExtraBusca('');
                     setExtraQtd(1);
                     setExtraValor('');
                   }}
                >
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
                  {extrasList.map(extra => (
                    <tr key={extra.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className={tdClass}>{extra.cod}</td>
                      <td className={tdClass}>{extra.desc}</td>
                      <td className={tdClass}>{extra.pdv}</td>
                      <td className={tdClass}>{extra.freq}</td>
                      <td className={tdClass}>{extra.qtd}</td>
                      <td className={tdClass}>R$ {formatCurrency(Math.round(extra.valor * 100).toString())}</td>
                      <td className={`${tdClass} font-bold`}>R$ {formatCurrency(Math.round(extra.subtotal * 100).toString())}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setExtraSelected({ id: extra.id, cod: extra.cod, desc: extra.desc, pdv: extra.pdv, valor: extra.valor });
                              setExtraFreq(extra.freq);
                              setExtraQtd(extra.qtd);
                              setExtraPdv(extra.pdv);
                              setExtrasList((prev: any[]) => prev.filter(p => p.id !== extra.id));
                            }}
                            className="text-primary hover:text-primary/80 p-0.5"
                          ><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setExtrasList((prev: any[]) => prev.filter(p => p.id !== extra.id))} className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-primary/5 font-bold border-t-2 border-border">
                    <td colSpan={6} className={`${tdClass} text-right text-primary uppercase text-xs tracking-wider`}>Total de Extras</td>
                    <td className={`${tdClass} text-primary`}>R$ {formatCurrency(Math.round(totalExtras * 100).toString())}</td>
                    <td className={tdClass}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ==================== PULSEIRAS ==================== */}
          <section id="pulseiras" ref={setSectionRef('pulseiras')} className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-bold text-foreground">Pulseiras</h2>
              <ErrorMessage msg={pulseiraError} className="!mt-0" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-4">
                <label className={labelClass}>Código</label>
                <Input 
                   placeholder="Código da pulseira" 
                   value={pulseiraCodigo} 
                   onChange={e => setPulseiraCodigo(e.target.value)} 
                   className={`${inputClass} w-full`} 
                />
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className={labelClass}>Nome do Hóspede</label>
                <Autocomplete 
                   placeholder="Nome do hóspede..."
                   items={hospedesDisponiveis.filter(h => h.name.toLowerCase().includes(pulseiraHospedeBusca.toLowerCase()))}
                   value={pulseiraHospedeSelected ? pulseiraHospedeSelected.name : pulseiraHospedeBusca}
                   onChange={v => { setPulseiraHospedeBusca(v); setPulseiraHospedeSelected(null); }}
                   renderItem={item => <div className="font-medium">{item.name}</div>}
                   onSelect={item => setPulseiraHospedeSelected(item)}
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex items-end">
                <Button 
                   size="sm" 
                   className="h-9 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                   onClick={() => {
                     if (!pulseiraCodigo || (!pulseiraHospedeSelected && !pulseiraHospedeBusca.trim())) {
                       setPulseiraError('Selecione um hóspede e insira um código.');
                       return;
                     }
                     if (pulseiras.find(p => p.codigo === pulseiraCodigo)) {
                       setPulseiraError('Pulseira já cadastrada.');
                       return;
                     }
                     setPulseiras([...pulseiras, { id: Date.now().toString(), codigo: pulseiraCodigo, hospede: pulseiraHospedeSelected ? pulseiraHospedeSelected.name : pulseiraHospedeBusca }]);
                     setPulseiraCodigo('');
                     setPulseiraHospedeSelected(null);
                     setPulseiraHospedeBusca('');
                   }}
                >
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
                  {pulseiras.map((p, i) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className={tdClass}>{i + 1}</td>
                      <td className={tdClass}>{p.codigo}</td>
                      <td className={tdClass}>{p.hospede}</td>
                      <td className={tdClass}>
                        <div className="flex gap-1">
                          <button 
                             onClick={() => {
                               setPulseiraCodigo(p.codigo);
                               setPulseiraHospedeSelected({ id: 'any', name: p.hospede });
                               setPulseiras(prev => prev.filter(x => x.id !== p.id));
                             }}
                             className="text-primary hover:text-primary/80 p-0.5"
                          ><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setPulseiras(prev => prev.filter(x => x.id !== p.id))} className="text-destructive hover:text-destructive/80 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pulseiras.length === 0 && (
                    <tr className="border-b border-border/50">
                       <td colSpan={4} className="text-center py-4 text-sm text-muted-foreground border-border/50">Nenhuma pulseira adicionada.</td>
                    </tr>
                  )}
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
              <div className="text-base font-bold text-foreground">R$ {formatCurrency(Math.round(totalGeral * 100).toString())}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium">Recebido</div>
              <div className="text-base font-bold text-success">R$ {formatCurrency(Math.round(totalRecebido * 100).toString())}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground font-medium">Em Aberto</div>
              <div className="text-base font-bold text-destructive">R$ {formatCurrency(Math.round(emAberto * 100).toString())}</div>
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
                      <Input type="tel" maxLength={20} className={inputClass} placeholder="(00) 00000-0000" />
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
