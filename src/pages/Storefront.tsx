import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ShoppingCart,
  Sparkles,
  Package,
  Briefcase,
  TrendingUp,
  Tag,
  Shield,
  Truck,
  CheckCircle2,
  Headphones,
  Clock,
  MapPin,
  Star,
  ArrowLeft,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   1. DATA — تم استبدالها بـ API في الإنتاج
   ═══════════════════════════════════════════════════ */

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice: number;
  rating: number;
  accent: string;
  glow: string;
  tag: string;
  icon: 'device' | 'fashion' | 'home' | 'beauty' | 'gaming' | 'audio';
};

type Service = {
  id: number;
  name: string;
  duration: string;
  city: string;
  rating: number;
  price: string;
  description: string;
  accent: string;
  glow: string;
  tag: string;
  icon: 'fix' | 'design' | 'delivery' | 'install' | 'support';
};

const products: Product[] = [
  {
    id: 1,
    name: 'ساعة ذكية Ultra Fit',
    category: 'إلكترونيات',
    description: 'شاشة AMOLED، مقاومة للماء، وتتبع صحي كامل.',
    price: 1290,
    oldPrice: 1540,
    rating: 4.9,
    accent: '#7c6ffa',
    glow: 'rgba(124,111,250,0.28)',
    tag: 'الأكثر طلبًا',
    icon: 'device',
  },
  {
    id: 2,
    name: 'حقيبة Office Glass',
    category: 'موضة وإكسسوارات',
    description: 'تصميم عملي فاخر يناسب العمل والتنقل اليومي.',
    price: 620,
    oldPrice: 790,
    rating: 4.8,
    accent: '#00c2a8',
    glow: 'rgba(0,194,168,0.24)',
    tag: 'شحن سريع',
    icon: 'fashion',
  },
  {
    id: 3,
    name: 'مصباح Aura Desk',
    category: 'المنزل الذكي',
    description: 'إضاءة هادئة بثلاث درجات مع لمسة زجاجية عصرية.',
    price: 460,
    oldPrice: 590,
    rating: 4.7,
    accent: '#3ba0ff',
    glow: 'rgba(59,160,255,0.24)',
    tag: 'جديد 2026',
    icon: 'home',
  },
  {
    id: 4,
    name: 'مجموعة Glow Care',
    category: 'الجمال والعناية',
    description: 'روتين يومي أنيق للعناية مع مكونات لطيفة وفعالة.',
    price: 350,
    oldPrice: 430,
    rating: 4.9,
    accent: '#f472b6',
    glow: 'rgba(244,114,182,0.25)',
    tag: 'عرض حصري',
    icon: 'beauty',
  },
  {
    id: 5,
    name: 'كرسي Gamer Flow',
    category: 'ألعاب ومكاتب',
    description: 'راحة احترافية، خامات ممتازة، ودعم طويل للجلسات.',
    price: 1980,
    oldPrice: 2290,
    rating: 4.8,
    accent: '#22c55e',
    glow: 'rgba(34,197,94,0.24)',
    tag: 'مفضل اللاعبين',
    icon: 'gaming',
  },
  {
    id: 6,
    name: 'سماعات Echo Pro',
    category: 'صوتيات',
    description: 'عزل ضوضاء ذكي وصوت غني ومكالمات واضحة جدًا.',
    price: 890,
    oldPrice: 1090,
    rating: 4.9,
    accent: '#facc15',
    glow: 'rgba(250,204,21,0.24)',
    tag: 'خصم اليوم',
    icon: 'audio',
  },
];

const services: Service[] = [
  {
    id: 1,
    name: 'كهربائي منزلي محترف',
    duration: '2–3 ساعات',
    city: 'الدار البيضاء',
    rating: 4.9,
    price: 'ابتداءً من 180 د.م',
    description: 'تركيب وصيانة وإنهاء الأعطال بسرعة مع التزام بالمواعيد.',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.24)',
    tag: 'متاح اليوم',
    icon: 'fix',
  },
  {
    id: 2,
    name: 'تصميم هوية بصرية',
    duration: '3–5 أيام',
    city: 'عن بعد',
    rating: 5,
    price: 'ابتداءً من 950 د.م',
    description: 'شعار، ألوان، ونظام بصري حديث مناسب للبيع والثقة.',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.24)',
    tag: 'Top Rated',
    icon: 'design',
  },
  {
    id: 3,
    name: 'توصيل داخل نفس اليوم',
    duration: '90 دقيقة',
    city: 'الرباط',
    rating: 4.8,
    price: 'ابتداءً من 45 د.م',
    description: 'حل سريع واحترافي للطلبات العاجلة والوثائق والطرود.',
    accent: '#14b8a6',
    glow: 'rgba(20,184,166,0.24)',
    tag: 'سريع جدًا',
    icon: 'delivery',
  },
  {
    id: 4,
    name: 'تركيب كاميرات ومراقبة',
    duration: '4–6 ساعات',
    city: 'مراكش',
    rating: 4.9,
    price: 'ابتداءً من 420 د.م',
    description: 'زيارة، تركيب، وضبط كامل مع شرح الاستخدام والمتابعة.',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.22)',
    tag: 'موثوق',
    icon: 'install',
  },
  {
    id: 5,
    name: 'دعم تقني للشركات الصغيرة',
    duration: 'خلال 24 ساعة',
    city: 'طنجة',
    rating: 4.8,
    price: 'ابتداءً من 300 د.م',
    description: 'حلول تشغيل، صيانة، ومساندة مستمرة للأجهزة والأنظمة.',
    accent: '#ec4899',
    glow: 'rgba(236,72,153,0.22)',
    tag: 'عقد شهري',
    icon: 'support',
  },
];

/* ═══════════════════════════════════════════════════
   2. HELPERS
   ═══════════════════════════════════════════════════ */

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const formatPrice = (n: number) =>
  `${n.toLocaleString('ar-MA')} د.م`;

/* ═══════════════════════════════════════════════════
   3. TOP NAV — Glass floating
   ═══════════════════════════════════════════════════ */

function TopNav({
  query,
  setQuery,
  onOpenCart,
  cartCount,
  onMenu,
}: {
  query: string;
  setQuery: (v: string) => void;
  onOpenCart: () => void;
  cartCount: number;
  onMenu: () => void;
}) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="glass-nav mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[1.35rem] px-4 py-3 sm:px-5"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-right"
          aria-label="العودة إلى أعلى الصفحة"
        >
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.28em] text-white/45 uppercase">
              VOID AI COMMERCE
            </p>
            <h1 className="text-sm font-semibold tracking-[0.08em] text-white sm:text-base">
              SAHAR SHOP
            </h1>
          </div>
        </button>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <div className="nav-search max-w-xl flex-1">
            <Search size={16} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن منتج أو خدمة أو مدينة..."
              aria-label="بحث سريع"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenu}
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="القائمة"
          >
            <Menu size={18} />
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            className="cart-button"
            aria-label="سلة المشتريات"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   4. MOBILE MENU — Glass side sheet
   ═══════════════════════════════════════════════════ */

function MobileMenu({
  open,
  onClose,
  onNavigate,
  activeTab,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: string, tab?: 'products' | 'services') => void;
  activeTab: 'products' | 'services';
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 200ms ease' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[82%] max-w-sm bg-[var(--panel)] border-l border-[var(--border2)] p-5 overflow-y-auto"
        style={{
          animation: 'slideLeft 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: 'var(--depth-shadow)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="brand-mark">
              <Sparkles size={16} />
            </div>
            <span className="text-sm font-semibold text-white">SAHAR SHOP</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('products', 'products')}
            className={cn(
              'w-full flex items-center gap-3 rounded-[1.1rem] border px-4 py-3 text-right transition',
              activeTab === 'products'
                ? 'border-[var(--border-ember)] bg-[var(--ember-soft)] text-[var(--ember2)]'
                : 'border-[var(--border)] bg-white/[0.03] text-white/75 hover:bg-white/[0.06]'
            )}
          >
            <Package size={18} />
            <span className="text-sm font-semibold">المنتجات</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('services', 'services')}
            className={cn(
              'w-full flex items-center gap-3 rounded-[1.1rem] border px-4 py-3 text-right transition',
              activeTab === 'services'
                ? 'border-[var(--border-ember)] bg-[var(--ember-soft)] text-[var(--ember2)]'
                : 'border-[var(--border)] bg-white/[0.03] text-white/75 hover:bg-white/[0.06]'
            )}
          >
            <Briefcase size={18} />
            <span className="text-sm font-semibold">الخدمات</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('offers')}
            className="w-full flex items-center gap-3 rounded-[1.1rem] border border-[var(--border)] bg-white/[0.03] px-4 py-3 text-right text-white/75 transition hover:bg-white/[0.06]"
          >
            <Tag size={18} />
            <span className="text-sm font-semibold">العروض</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('trust')}
            className="w-full flex items-center gap-3 rounded-[1.1rem] border border-[var(--border)] bg-white/[0.03] px-4 py-3 text-right text-white/75 transition hover:bg-white/[0.06]"
          >
            <Shield size={18} />
            <span className="text-sm font-semibold">عناصر الثقة</span>
          </button>
        </div>

        <div className="mt-8 rounded-[1.3rem] border border-[var(--border)] bg-white/[0.03] p-4 text-right">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">AI Commerce OS</p>
          <p className="mt-2 text-sm text-white/70">
            نظام بيع ذكي — مصنوع للسوق المغربي 🇲🇦
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. CART DRAWER — Glass side sheet
   ═══════════════════════════════════════════════════ */

function CartDrawer({
  open,
  onClose,
  items,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: number) => void;
}) {
  if (!open) return null;

  const total = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 200ms ease' }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-[86%] max-w-md bg-[var(--panel)] border-r border-[var(--border2)] p-5 overflow-y-auto"
        style={{
          animation: 'slideRight 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: 'var(--depth-shadow)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-white" />
            <span className="text-sm font-semibold text-white">سلة المشتريات</span>
            <span className="rounded-full bg-[var(--ember-soft)] px-2 py-0.5 text-[11px] text-[var(--ember2)]">
              {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.length === 0 && (
            <div className="rounded-[1.3rem] border border-[var(--border)] bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/60">السلة فارغة — أضف منتجات للبدء.</p>
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-[1.15rem] border border-[var(--border)] bg-white/[0.03] p-3"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.9rem] border border-white/10 text-white"
                style={{ background: `${item.accent}22` }}
              >
                <Package size={20} />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/55">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--ember2)]">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="mt-1 text-[11px] text-white/45 hover:text-[var(--ember2)]"
                >
                  إزالة
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="mt-5 rounded-[1.3rem] border border-[var(--border-ember)] bg-[var(--ember-soft)] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">المجموع</span>
              <span className="text-lg font-bold text-[var(--ember2)]">{formatPrice(total)}</span>
            </div>
            <button type="button" className="cta-button mt-3 w-full justify-center">
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   6. PRODUCT CARD — Glass floating with image zoom
   ═══════════════════════════════════════════════════ */

function ProductCard({ product, onBuy }: { product: Product; onBuy: (p: Product) => void }) {
  return (
    <article className="glass-card fade-up overflow-hidden">
      <div
        className="relative m-3 rounded-[1.35rem] border border-white/10 p-5"
        style={{
          background: `radial-gradient(circle at 15% 20%, ${product.glow}, transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`,
        }}
      >
        <div
          className="absolute -left-6 top-3 h-24 w-24 rounded-full blur-3xl"
          style={{ backgroundColor: product.glow }}
        />
        <div className="relative flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[11px] font-medium text-white/75 backdrop-blur-xl">
            {product.tag}
          </span>
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 text-white shadow-2xl"
            style={{ backgroundColor: `${product.accent}33` }}
          >
            <Package size={22} />
          </div>
        </div>

        <div className="relative mt-8 flex items-end justify-between">
          <div>
            <p className="text-xs text-white/55">{product.category}</p>
            <p className="mt-2 text-lg font-semibold text-white">تصميم Premium</p>
          </div>
          <div className="relative h-20 w-20 rounded-[1.7rem] border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1">
            <div
              className="absolute inset-3 rounded-[1.2rem]"
              style={{ background: `linear-gradient(135deg, ${product.accent}, rgba(255,255,255,0.15))` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{product.description}</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
            <Star size={14} className="text-amber-300" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">{formatPrice(product.price)}</p>
            <p className="text-sm text-white/35 line-through">{formatPrice(product.oldPrice)}</p>
          </div>
          <button type="button" className="cta-button justify-center whitespace-nowrap" onClick={() => onBuy(product)}>
            اطلب الآن
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════
   7. SERVICE CARD — visually different from products
   ═══════════════════════════════════════════════════ */

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="glass-card fade-up p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 text-white shadow-2xl"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${service.glow}, transparent 55%), ${service.accent}33`,
            }}
          >
            <Briefcase size={20} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                {service.tag}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">{service.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="meta-chip">
                <Clock size={16} />
                {service.duration}
              </span>
              <span className="meta-chip">
                <MapPin size={16} />
                {service.city}
              </span>
              <span className="meta-chip">
                <Star size={16} className="text-amber-300" />
                {service.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-[220px] flex-col items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 lg:items-end">
          <p className="text-sm text-white/45">سعر الخدمة</p>
          <p className="text-xl font-semibold tracking-tight text-white">{service.price}</p>
          <button type="button" className="cta-button w-full justify-center lg:w-auto">
            اطلب الخدمة
          </button>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════
   8. SECTION HEADER — eyebrow pattern
   ═══════════════════════════════════════════════════ */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-white/45 uppercase">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/62 sm:text-[15px]">{subtitle}</p>
      </div>
      {action ? (
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/55 backdrop-blur-xl sm:block">
          {action}
        </div>
      ) : null}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   9. MAIN — Storefront
   ═══════════════════════════════════════════════════ */

export default function Storefront() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return products;
    return products.filter((product) =>
      [product.name, product.category, product.description, product.tag]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredServices = useMemo(() => {
    if (!normalizedQuery) return services;
    return services.filter((service) =>
      [service.name, service.city, service.description, service.tag]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const el = document.getElementById('sf-search');
        el?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const scrollToSection = (section: string, tab?: 'products' | 'services') => {
    if (tab) setActiveTab(tab);
    setMenuOpen(false);
    const el = document.getElementById(section);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addToCart = (p: Product) => {
    setCart((prev) => (prev.find((x) => x.id === p.id) ? prev : [...prev, p]));
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="grid-overlay" />
      </div>

      <TopNav
        query={query}
        setQuery={setQuery}
        onOpenCart={() => setCartOpen(true)}
        cartCount={cart.length}
        onMenu={() => setMenuOpen(true)}
      />

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={scrollToSection}
        activeTab={activeTab}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} />

      <main className="relative mx-auto max-w-7xl px-4 pb-28 pt-28 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32">
        {/* HERO */}
        <section id="hero" className="scroll-mt-28">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="glass-card hero-panel fade-up overflow-hidden px-5 py-7 sm:px-8 sm:py-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.95)]" />
                واجهة بيع حديثة، سريعة، وواضحة للمستخدم
              </div>

              <div className="mt-6 max-w-3xl">
                <h2 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl xl:text-6xl">
                  متجر زجاجي عصري يرفع
                  <span className="block text-white/75">الوضوح، الثقة، والتحويل.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/62 sm:text-base">
                  فصل بصري واضح بين المنتجات والخدمات، بحث مباشر، أزرار شراء احترافية، وحركة خفيفة
                  جدًا تحافظ على الإحساس الفاخر بدون إزعاج أو تشويش.
                </p>
              </div>

              <div className="hero-search mt-7">
                <Search size={20} className="text-white/40" />
                <input
                  id="sf-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثال: سماعات، كهربائي، الرباط، توصيل سريع..."
                  aria-label="ابحث في المتجر والخدمات"
                />
                <button
                  type="button"
                  className="cta-button justify-center whitespace-nowrap"
                  onClick={() =>
                    scrollToSection(activeTab === 'products' ? 'products' : 'services', activeTab)
                  }
                >
                  ابدأ الآن
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => scrollToSection('products', 'products')}
                >
                  تسوق المنتجات
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => scrollToSection('services', 'services')}
                >
                  اطلب خدمة محترفة
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { value: '24h', label: 'استجابة أسرع للطلبات' },
                  { value: '+12k', label: 'زائر شهري بتجربة أوضح' },
                  { value: '4.9/5', label: 'متوسط رضا العملاء' },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="metric-panel fade-up"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <p className="text-2xl font-semibold tracking-tight text-white">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="grid gap-4">
              <div className="glass-card fade-up overflow-hidden p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Spotlight</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">لوحة واجهة عالية التحويل</h3>
                    <p className="mt-3 text-sm leading-7 text-white/60">
                      توزيع مرئي ذكي: CTA واضح، بطاقات عائمة، وثقة أسرع من أول نظرة.
                    </p>
                  </div>
                  <div className="icon-shell text-cyan-300">
                    <TrendingUp size={20} />
                  </div>
                </div>

                <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(124,111,250,0.18),rgba(255,255,255,0.05))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/65">أفضل مسار شراء</span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
                      1 Click Flow
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-sm text-white/60">
                    <span className="step-pill">Search</span>
                    <ArrowLeft size={16} className="text-white/30" />
                    <span className="step-pill">Category</span>
                    <ArrowLeft size={16} className="text-white/30" />
                    <span className="step-pill">Buy</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="glass-card fade-up p-5" style={{ animationDelay: '120ms' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">المنتجات الجاهزة</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                        {filteredProducts.length}
                      </p>
                    </div>
                    <div className="icon-shell text-violet-300">
                      <Package size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/60">
                    بطاقات أكثر وضوحًا مع إبراز السعر والقرار الشرائي.
                  </p>
                </div>

                <div className="glass-card fade-up p-5" style={{ animationDelay: '180ms' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">الخدمات الموثوقة</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                        {filteredServices.length}
                      </p>
                    </div>
                    <div className="icon-shell text-emerald-300">
                      <Briefcase size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/60">
                    فصل بصري يمنع الخلط بين الخدمة والمنتج ويحسن الفهم السريع.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="scroll-mt-28 pt-10 sm:pt-14">
          <div className="glass-card fade-up p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Quick Access</p>
                <h3 className="mt-2 text-xl font-semibold text-white">اختر مسارك بسرعة بدون ازدحام</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px] lg:flex-1">
                <button
                  type="button"
                  aria-pressed={activeTab === 'products'}
                  onClick={() => scrollToSection('products', 'products')}
                  className={cn(
                    'quick-switch text-right',
                    activeTab === 'products' && 'quick-switch-active'
                  )}
                >
                  <span className="icon-shell text-violet-300">
                    <Package size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">المنتجات</span>
                    <span className="mt-1 block text-xs leading-6 text-white/55">
                      عناصر جاهزة للشراء مع عرض السعر والخصم بشكل واضح
                    </span>
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {filteredProducts.length}
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={activeTab === 'services'}
                  onClick={() => scrollToSection('services', 'services')}
                  className={cn(
                    'quick-switch text-right',
                    activeTab === 'services' && 'quick-switch-active'
                  )}
                >
                  <span className="icon-shell text-emerald-300">
                    <Briefcase size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">الخدمات</span>
                    <span className="mt-1 block text-xs leading-6 text-white/55">
                      مختصون جاهزون مع وقت تنفيذ وموقع وتقييم في بطاقة واحدة
                    </span>
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {filteredServices.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="scroll-mt-28 pt-12 sm:pt-16">
          <SectionHeader
            eyebrow="Featured Products"
            title="منتجات مختارة بعرض أوضح للشراء"
            subtitle="بطاقات زجاجية نظيفة، صورة بصرية راقية، سعر واضح، وزر شراء مباشر بدون فوضى أو عناصر مشتتة."
            action={`${filteredProducts.length} نتيجة متاحة`}
          />

          {filteredProducts.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onBuy={addToCart} />
              ))}
            </div>
          ) : (
            <div className="glass-card fade-up empty-state p-8 sm:p-10">
              <div className="icon-shell mx-auto text-cyan-300">
                <Search size={20} />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">لا توجد منتجات مطابقة</h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                جرّب كلمة بحث أخرى أو انتقل إلى قسم الخدمات لإيجاد البديل المناسب.
              </p>
            </div>
          )}
        </section>

        {/* SERVICES */}
        <section id="services" className="scroll-mt-28 pt-12 sm:pt-16">
          <SectionHeader
            eyebrow="Featured Services"
            title="خدمات مفصولة بصريًا لتسهيل القرار"
            subtitle="كل بطاقة خدمة تعرض ما يحتاجه المستخدم فورًا: نوع الخدمة، مدة التنفيذ، المدينة، التقييم، وزر الطلب المباشر."
            action={`${filteredServices.length} خدمة فعالة`}
          />

          <div className="grid gap-4">
            {filteredServices.length ? (
              filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)
            ) : (
              <div className="glass-card fade-up empty-state p-8 sm:p-10">
                <div className="icon-shell mx-auto text-emerald-300">
                  <Search size={20} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">لا توجد خدمات مطابقة</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  غيّر عبارة البحث أو راجع المنتجات الجاهزة، وقد تجد ما يناسبك بشكل أسرع.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TRENDING */}
        <section className="pt-12 sm:pt-16">
          <SectionHeader
            eyebrow="Trending Now"
            title="ما الذي يدفع التحويل الآن؟"
            subtitle="اتجاهات حية مصممة لزيادة الوضوح والثقة: اقتراح ذكي، إبراز العناصر الصاعدة، وتقوية إشارات الموثوقية."
          />

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'اقتراحات ذكية حسب البحث',
                subtitle:
                  'المنتجات والخدمات الأكثر توافقًا مع نية الشراء الحالية.',
                badge: '+28% تحويل',
                accent: 'from-cyan-400/30 to-sky-500/10',
                icon: <Sparkles size={20} />,
              },
              {
                title: 'أكثر ما يصعد هذا الأسبوع',
                subtitle:
                  'سماعات Echo Pro وخدمة التوصيل السريع يقودان الطلب الآن.',
                badge: 'Trending',
                accent: 'from-violet-400/30 to-fuchsia-500/10',
                icon: <TrendingUp size={20} />,
              },
              {
                title: 'عناصر موثوقة ومحققة',
                subtitle:
                  'خيارات مختارة بناءً على التقييمات، الاستجابة، وسرعة التنفيذ.',
                badge: 'Verified',
                accent: 'from-emerald-400/30 to-teal-500/10',
                icon: <Shield size={20} />,
              },
            ].map((item, index) => (
              <article
                key={item.title}
                className="glass-card fade-up overflow-hidden p-5"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div
                  className={cn(
                    'rounded-[1.35rem] border border-white/10 bg-gradient-to-br p-4',
                    item.accent
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="icon-shell text-white">{item.icon}</div>
                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[11px] text-white/75">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* OFFERS */}
        <section id="offers" className="scroll-mt-28 pt-12 sm:pt-16">
          <SectionHeader
            eyebrow="Offers & Discounts"
            title="عروض جاهزة لدفع القرار بسرعة"
            subtitle="مساحات ترويجية واضحة، أنيقة، ومناسبة لتحسين النقر والتحويل دون تشويش بصري أو ازدحام لوني."
          />

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="glass-card fade-up overflow-hidden p-6 sm:p-7">
              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,128,0,0.22),rgba(255,255,255,0.05))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                    Limited Offer
                  </span>
                  <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs text-orange-100">
                    تحويل أعلى
                  </span>
                </div>
                <h3 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  خصم 15% على أول طلب
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-white/72 sm:text-base">
                  فعّل تجربة الشراء أو الخدمة الأولى مع مزايا شحن أسرع ودعم مباشر.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="cta-button">
                    استخدم الكود SAHAR15
                  </button>
                  <button type="button" className="secondary-button">
                    استكشف المزيد
                  </button>
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              {[
                {
                  title: 'باقة المنزل الذكي',
                  subtitle: 'اشترِ مصباح Aura + تركيب خلال 48 ساعة.',
                  cta: 'عرض مركب',
                  accent: 'from-sky-500/20 to-cyan-400/10',
                },
                {
                  title: 'خدمة عاجلة للشركات',
                  subtitle: 'استجابة أسرع ودعم مخصص للأعمال الناشئة.',
                  cta: 'احجز أولوية',
                  accent: 'from-violet-500/20 to-indigo-400/10',
                },
              ].map((offer, index) => (
                <article
                  key={offer.title}
                  className="glass-card fade-up p-5"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className={cn('rounded-[1.35rem] border border-white/10 bg-gradient-to-br p-5', offer.accent)}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="icon-shell text-white">
                        <Tag size={20} />
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[11px] text-white/75">
                        Offer
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/70">{offer.subtitle}</p>
                    <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white">
                      {offer.cta}
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" className="scroll-mt-28 pt-12 sm:pt-16">
          <SectionHeader
            eyebrow="Store Highlights"
            title="عناصر الثقة التي يجب أن تظهر دائمًا"
            subtitle="هذه الطبقة مهمة جدًا في أي واجهة بيع احترافية: توصيل، أمان، تحقق، ومساندة واضحة للمستخدم."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'دفع آمن', subtitle: 'حماية عالية للمدفوعات والبيانات', icon: <Shield size={20} /> },
              { title: 'توصيل سريع', subtitle: 'تنفيذ وشحن بوضوح كامل', icon: <Truck size={20} /> },
              { title: 'بائعون موثقون', subtitle: 'تقييمات حقيقية وخيارات مختارة', icon: <CheckCircle2 size={20} /> },
              { title: 'دعم مباشر', subtitle: 'مساعدة سريعة قبل وبعد الطلب', icon: <Headphones size={20} /> },
            ].map((item, index) => (
              <article
                key={item.title}
                className="glass-card fade-up p-5 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="icon-shell mx-auto text-cyan-300">{item.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/58">{item.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER MINI */}
        <footer id="footer" className="scroll-mt-28 pt-12 sm:pt-16">
          <div className="glass-card fade-up overflow-hidden p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Mini Footer</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  SAHAR SHOP — واجهة أنظف، قرار أسرع، وثقة أعلى.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-8 text-white/60">
                  تم تحسين الصفحة الرئيسية بالكامل مع تصميم زجاجي احترافي، توزيع واضح، ظلال ناعمة،
                  إضاءات دقيقة، وتجربة سلسة على الموبايل والديسكتوب بدون كسر أي جزء أساسي من الواجهة.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => scrollToSection('products', 'products')}
                >
                  ابدأ التسوق
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => scrollToSection('services', 'services')}
                >
                  اطلب خدمة
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav lg:hidden">
        {[
          { id: 'hero', label: 'الرئيسية', icon: <Sparkles size={20} /> },
          { id: 'products', label: 'منتجات', icon: <Package size={20} /> },
          { id: 'services', label: 'خد مات', icon: <Briefcase size={20} /> },
          { id: 'offers', label: 'عروض', icon: <Tag size={20} /> },
          { id: 'footer', label: 'المزيد', icon: <Shield size={20} /> },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className="flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium text-white/45 transition duration-300 hover:text-white"
          >
            <span className="transition">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
