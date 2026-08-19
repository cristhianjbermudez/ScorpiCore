import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  RefreshCw,
  LogIn,
  LogOut,
  Search,
  ChevronRight,
  Zap,
  Upload,
  Download,
  ImagePlus,
  Lock,
  Unlock,
  LayoutDashboard,
  Settings,
  CreditCard,
  FolderOpen,
  MessageSquare,
  HelpCircle,
  Mail,
  FileText,
  Send,
  Briefcase,
  DollarSign,
  Layers,
  BarChart3,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock,
  Hash,
  Type,
  ToggleLeft,
  ListOrdered,
  Tag,
  ArrowRight,
  Shield,
  Smartphone,
  Palette,
  TrendingUp,
  Users,
  MailOpen,
  Reply,
  Archive,
  User,
  Building,
  Code2,
  Server,
  Wifi,
  Database,
  Cloud,
  Cpu,
  Monitor,
  Rocket,
  Target,
  Heart,
  Award,
  Coffee,
  Key,
  Bell,
  Compass,
  Map,
  ShoppingCart,
  FileCode,
  TestTube,
  Wrench,
  Scaling,
  Headphones,
  PenTool,
  Brush,
  Layout,
  Cog,
  PieChart,
  Activity,
  Copy,
  File,
  Folder,
  Image,
  Film,
  Music,
  Mic,
  Video,
  Camera,
  Printer,
  Link,
  ExternalLink,
  Share2,
  Flag,
  Bookmark,
  Inbox,
  Calendar,
  Timer,
  Hourglass,
  Flame,
  Sun,
  Moon,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Phone,
  AtSign,
  MapPin,
  Navigation,
} from 'lucide-react'
import { api } from '../lib/api'
import { clearSettingsCache } from '../lib/useSettings'
import Particles from '../components/Particles'
import { useToast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const SECTIONS = [
  {
    key: 'services',
    label: 'Servicios',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
    desc: 'Gestiona los servicios que ofreces',
  },
  {
    key: 'plans',
    label: 'Planes',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600',
    desc: 'Planes de precios y paquetes',
  },
  {
    key: 'projects',
    label: 'Portafolio',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    desc: 'Proyectos y trabajos realizados',
  },
  {
    key: 'testimonials',
    label: 'Testimonios',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
    desc: 'Opiniones de tus clientes',
  },
  {
    key: 'faqs',
    label: 'FAQs',
    icon: HelpCircle,
    color: 'from-cyan-500 to-sky-600',
    desc: 'Preguntas frecuentes',
  },
  {
    key: 'messages',
    label: 'Mensajes',
    icon: Send,
    color: 'from-rose-500 to-pink-600',
    desc: 'Mensajes de contacto',
  },
  {
    key: 'site_settings',
    label: 'Configuración del Sitio',
    icon: Settings,
    color: 'from-slate-500 to-slate-600',
    desc: 'Textos, datos de contacto y contenido del sitio',
    readOnly: true,
  },
]

const FIELD_ICONS = {
  title: Type,
  name: Users,
  description: FileText,
  features: ListOrdered,
  icon: Globe,
  color: Palette,
  visible: Eye,
  popular: Star,
  price: DollarSign,
  category: Tag,
  image: ImagePlus,
  link: ArrowRight,
  role: Briefcase,
  content: MessageSquare,
  rating: Star,
  question: HelpCircle,
  answer: FileText,
  email: Mail,
  phone: Smartphone,
  company: Briefcase,
  project_type: Briefcase,
  budget: DollarSign,
  status: Hash,
  plan: CreditCard,
}

const ICON_MAP = {
  Globe,
  Code2,
  Search,
  Shield,
  Zap,
  Palette,
  Smartphone,
  Server,
  Cloud,
  Cpu,
  Monitor,
  Rocket,
  Target,
  Heart,
  Award,
  Star,
  Lock,
  Key,
  Bell,
  Compass,
  Map,
  TrendingUp,
  ShoppingCart,
  Briefcase,
  CreditCard,
  Users,
  Wifi,
  Database,
  Mail,
  MessageSquare,
  Phone,
  AtSign,
  Send,
  FileText,
  Image,
  Layout,
  Settings,
  Cog,
  PieChart,
  Activity,
  BarChart3,
  Copy,
  Folder,
  Film,
  Music,
  Mic,
  Video,
  Camera,
  Printer,
  Link,
  ExternalLink,
  Share2,
  Flag,
  Bookmark,
  Tag,
  Inbox,
  Calendar,
  Clock,
  Timer,
  Hourglass,
  Flame,
  Sun,
  Moon,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MailOpen,
  Reply,
  Archive,
  User,
  Building,
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  LogIn,
  LogOut,
  ChevronRight,
  Upload,
  Download,
  ImagePlus,
  Unlock,
  LayoutDashboard,
  FolderOpen,
  HelpCircle,
  DollarSign,
  Layers,
  Type,
  ToggleLeft,
  ListOrdered,
  Hash,
  TestTube,
  Wrench,
  Scaling,
  Headphones,
  PenTool,
  Brush,
}

const ICON_GRID_NAMES = [
  'Globe',
  'Code2',
  'Search',
  'Shield',
  'Zap',
  'Palette',
  'Smartphone',
  'Server',
  'Cloud',
  'Cpu',
  'Monitor',
  'Rocket',
  'Target',
  'Heart',
  'Award',
  'Star',
  'Lock',
  'Key',
  'Bell',
  'Compass',
  'Map',
  'TrendingUp',
  'ShoppingCart',
  'Briefcase',
  'CreditCard',
  'Users',
  'Wifi',
  'Database',
  'FileCode',
  'Coffee',
  'Gem',
  'Sparkles',
  'Anchor',
  'BookOpen',
  'Brush',
  'Camera',
  'Crown',
  'Diamond',
  'Feather',
  'Flame',
  'Gift',
  'Glasses',
  'Headphones',
  'Image',
  'Inbox',
  'Landmark',
  'Laptop',
  'Link',
  'Megaphone',
  'Mic',
  'Moon',
  'Mountain',
  'Music',
  'Package',
  'Paperclip',
  'Pen',
  'Phone',
  'PieChart',
  'Pin',
  'Play',
  'Plug',
  'Power',
  'Printer',
  'Puzzle',
  'Rss',
  'Scan',
  'Share',
  'Shirt',
  'Signal',
  'Skull',
  'Speaker',
  'Sun',
  'Tablet',
  'Terminal',
  'ThumbsUp',
  'Timer',
  'Tv',
  'Umbrella',
  'Video',
  'Wallet',
  'Watch',
  'Wrench',
  'Cast',
  'Cherry',
  'Circle',
  'Code',
  'Disc',
  'Drama',
  'Film',
  'Flashlight',
  'Grid',
  'List',
  'Pointer',
  'QrCode',
  'Ratio',
  'Ruler',
  'Scissors',
  'Square',
  'Stamp',
  'StickyNote',
  'Underline',
  'Voicemail',
  'Webcam',
  'Wheat',
  'Wind',
  'Wine',
  'XCircle',
  'Youtube',
]
const ICON_OPTIONS = ICON_GRID_NAMES.filter((n) => ICON_MAP[n]).map((n) => ({
  name: n,
  Icon: ICON_MAP[n],
}))

const GRADIENT_OPTIONS = [
  { name: 'Azul', value: 'from-blue-500 to-blue-600' },
  { name: 'Índigo', value: 'from-blue-500 to-indigo-600' },
  { name: 'Violeta', value: 'from-violet-500 to-purple-600' },
  { name: 'Púrpura', value: 'from-purple-500 to-pink-600' },
  { name: 'Rosa', value: 'from-rose-500 to-pink-600' },
  { name: 'Rojo', value: 'from-red-500 to-rose-600' },
  { name: 'Naranja', value: 'from-orange-500 to-amber-600' },
  { name: 'Ámbar', value: 'from-amber-500 to-yellow-600' },
  { name: 'Verde', value: 'from-emerald-500 to-green-600' },
  { name: 'Teal', value: 'from-teal-500 to-cyan-600' },
  { name: 'Cyan', value: 'from-cyan-500 to-sky-600' },
  { name: 'Sky', value: 'from-sky-500 to-blue-600' },
  { name: 'Gris', value: 'from-slate-500 to-slate-600' },
  { name: 'Neutro', value: 'from-neutral-500 to-stone-600' },
  { name: 'Índigo-Púrpura', value: 'from-indigo-500 to-purple-600' },
  { name: 'Teal-Índigo', value: 'from-teal-500 to-indigo-600' },
]

function IconPicker({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [customName, setCustomName] = useState('')
  const filtered = ICON_OPTIONS.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  const matchedName = customName
    ? Object.keys(ICON_MAP).find((k) => k.toLowerCase() === customName.toLowerCase())
    : null
  const isValidCustom = !!matchedName
  const CustomIcon = isValidCustom ? ICON_MAP[matchedName] : null
  const isCustomSelected = matchedName && value === matchedName

  function handleCustomSelect() {
    if (customName) {
      const finalName = matchedName || customName.charAt(0).toUpperCase() + customName.slice(1)
      onChange(value === finalName ? '' : finalName)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar icono..."
          className="w-full rounded-xl border border-slate-200 bg-white/80 pl-9 pr-3 py-2 text-sm text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>
      <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto rounded-xl border border-slate-100 p-2">
        {filtered.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(value === name ? '' : name)}
            className={`group flex flex-col items-center gap-1 rounded-xl p-2 transition-all duration-200 ${
              value === name
                ? 'bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/30'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title={name}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] leading-none">{name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-6 py-4 text-center text-xs text-slate-400">Sin resultados</div>
        )}
      </div>

      {/* Input libre */}
      <div className="rounded-xl border border-dashed border-slate-200 p-3">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Otro icono de lucide-react
        </span>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ej: Gem, Anchor, Sparkles..."
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          {customName && (
            <div className="flex items-center gap-2">
              {isValidCustom ? (
                <button
                  type="button"
                  onClick={handleCustomSelect}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isCustomSelected
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  <CustomIcon className="h-4 w-4" />
                  {isCustomSelected ? 'Seleccionado' : 'Usar'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCustomSelect}
                  className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600 transition-all duration-200 hover:bg-amber-100"
                >
                  Usar como fallback
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GradientPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {GRADIENT_OPTIONS.map(({ name, value: gradient }) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(value === gradient ? '' : gradient)}
          className={`group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all duration-200 ${
            value === gradient
              ? 'bg-brand-primary/5 ring-2 ring-brand-primary/30'
              : 'hover:bg-slate-50'
          }`}
        >
          <div
            className={`h-8 w-full rounded-lg bg-gradient-to-br ${gradient} shadow-sm transition-transform duration-200 group-hover:scale-105`}
          />
          <span className="text-[10px] font-medium text-slate-500">{name}</span>
        </button>
      ))}
    </div>
  )
}

const FIELDS = {
  services: [
    { key: 'title', label: 'Título', type: 'text', required: true },
    { key: 'description', label: 'Descripción', type: 'textarea', required: true },
    { key: 'features', label: 'Características (una por línea)', type: 'list', required: true },
    { key: 'icon', label: 'Icono', type: 'icon_picker' },
    { key: 'color', label: 'Gradiente', type: 'gradient_picker' },
    { key: 'visible', label: 'Visible', type: 'toggle', default: true },
  ],
  plans: [
    { key: 'name', label: 'Nombre', type: 'text', required: true },
    { key: 'price', label: 'Precio', type: 'text', required: true, placeholder: '$899 USD' },
    { key: 'description', label: 'Descripción', type: 'text', required: true },
    { key: 'features', label: 'Características (una por línea)', type: 'list', required: true },
    { key: 'popular', label: 'Destacado', type: 'toggle' },
    { key: 'visible', label: 'Visible', type: 'toggle', default: true },
  ],
  projects: [
    { key: 'title', label: 'Título', type: 'text', required: true },
    {
      key: 'category',
      label: 'Categoría',
      type: 'select',
      options: ['Landing Page', 'Web Corporativa', 'Tienda Online', 'Software'],
    },
    { key: 'description', label: 'Descripción', type: 'textarea', required: true },
    { key: 'image', label: 'Imagen', type: 'image' },
    { key: 'link', label: 'URL proyecto', type: 'text', placeholder: 'https://...' },
    { key: 'visible', label: 'Visible', type: 'toggle', default: true },
  ],
  testimonials: [
    { key: 'name', label: 'Cliente', type: 'text', required: true },
    { key: 'role', label: 'Cargo / Empresa', type: 'text', required: true },
    { key: 'content', label: 'Testimonio', type: 'textarea', required: true },
    { key: 'rating', label: 'Calificación (1-5)', type: 'text', placeholder: '5' },
    { key: 'visible', label: 'Visible', type: 'toggle', default: true },
  ],
  faqs: [
    { key: 'question', label: 'Pregunta', type: 'text', required: true },
    { key: 'answer', label: 'Respuesta', type: 'textarea', required: true },
    { key: 'visible', label: 'Visible', type: 'toggle', default: true },
  ],
  services_section: [
    { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Servicios' },
    { key: 'heading', label: 'Título', type: 'text', placeholder: 'Soluciones que hacen crecer tu ' },
    { key: 'headingHighlight', label: 'Título resaltado', type: 'text', placeholder: 'empresa' },
    { key: 'subtitle', label: 'Subtítulo', type: 'textarea', placeholder: 'Cada servicio está diseñado con un objetivo...' },
  ],
  messages: [
    { key: 'name', label: 'Nombre', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Teléfono', type: 'text' },
    { key: 'company', label: 'Empresa', type: 'text' },
    { key: 'project_type', label: 'Tipo de proyecto', type: 'text' },
    { key: 'budget', label: 'Presupuesto', type: 'text' },
    { key: 'plan', label: 'Plan seleccionado', type: 'text' },
    { key: 'description', label: 'Mensaje', type: 'textarea' },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: ['nuevo', 'leido', 'respondido', 'archivado'],
    },
  ],
}

// ─── LOGIN ───────────────────────────────────────────────────────

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.login(username, password)
      onLogin()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-mesh px-4">
      <Particles />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary shadow-glow">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-secondary">ScorpiCore</h1>
          <p className="mt-2 text-sm text-slate-500">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 shadow-2xl">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-brand-secondary">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="admin"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-brand-secondary">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-12 text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────

function Dashboard({ stats, onSelect }) {
  if (!stats) return null
  const total = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-secondary">Dashboard</h1>
        <p className="mt-2 text-slate-500">Resumen de tu sitio web</p>
      </div>

      {total === 0 ? (
        <div className="glass flex flex-col items-center rounded-3xl border border-white/20 px-6 py-16 text-center shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
            <LayoutDashboard className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="mt-6 text-lg font-bold text-brand-secondary">Tu panel está vacío</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Comienza agregando contenido desde las secciones del menú. Cada sección alimenta una
            parte de tu landing page.
          </p>
          <button onClick={() => onSelect('services')} className="btn-primary mt-6">
            <Plus className="h-4 w-4" />
            Agregar primer servicio
          </button>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {SECTIONS.filter((s) => s.key !== 'site_settings').map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.key}
                  onClick={() => onSelect(s.key)}
                  className="glass group overflow-hidden rounded-2xl border border-white/20 p-5 text-left shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-card"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-md`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-brand-secondary">{stats[s.key] ?? 0}</div>
                  <div className="mt-1 text-xs text-slate-500">{s.label}</div>
                </button>
              )
            })}
          </div>

          {/* Section cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.key}
                  onClick={() => onSelect(s.key)}
                  className="glass group flex items-center gap-4 rounded-2xl border border-white/20 p-5 text-left shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-card"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-brand-secondary">{s.label}</div>
                    <div className="text-sm text-slate-500">{s.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.key !== 'site_settings' && (
                      <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold text-brand-primary">
                        {stats[s.key] ?? 0}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-primary" />
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ─── SECTION VIEW ────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20

function SectionView({
  section,
  items,
  loading,
  onBack,
  onEdit,
  onDelete,
  onToggle,
  onCreate,
  onRefresh,
  onMessageClick,
}) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const sectionInfo = SECTIONS.find((s) => s.key === section)
  const Icon = sectionInfo?.icon || Settings
  const isMessages = section === 'messages'

  const filtered = items.filter((i) => {
    if (!search) return true
    return JSON.stringify(i).toLowerCase().includes(search.toLowerCase())
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${sectionInfo?.color} shadow-md`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-brand-secondary">{sectionInfo?.label}</h1>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {items.length} elemento{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
            title="Actualizar"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {!sectionInfo?.readOnly && section !== 'messages' && (
            <button onClick={onCreate} className="btn-primary">
              <Plus className="h-4 w-4" />
              Nuevo
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={handleSearch}
            className="glass w-full rounded-2xl border border-white/20 py-3 pl-11 pr-4 text-sm text-brand-secondary placeholder-slate-400 transition-all duration-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md"
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {loading && items.length === 0 && (
          <div className="glass flex flex-col items-center justify-center rounded-3xl border border-white/20 py-20 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="mt-4 text-sm text-slate-500">Cargando...</p>
          </div>
        )}

        {!loading &&
          paginatedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => isMessages && onMessageClick?.(item)}
              className={`glass group flex items-center gap-4 rounded-2xl border border-white/20 p-4 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${isMessages ? 'cursor-pointer' : ''}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sectionInfo?.color} shadow-sm`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {item.popular && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                  {item.visible === 0 && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      Oculto
                    </span>
                  )}
                  {item.status && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.status === 'nuevo'
                          ? 'bg-blue-100 text-blue-600'
                          : item.status === 'leido'
                            ? 'bg-amber-100 text-amber-600'
                            : item.status === 'respondido'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.status === 'nuevo' && <MailOpen className="h-3 w-3" />}
                      {item.status === 'leido' && <CheckCircle className="h-3 w-3" />}
                      {item.status === 'respondido' && <Reply className="h-3 w-3" />}
                      {item.status === 'archivado' && <Archive className="h-3 w-3" />}
                      {item.status === 'nuevo'
                        ? 'Nuevo'
                        : item.status === 'leido'
                          ? 'Leído'
                          : item.status === 'respondido'
                            ? 'Respondido'
                            : 'Archivado'}
                    </span>
                  )}
                  <span className="truncate text-sm font-semibold text-brand-secondary">
                    {item.title || item.name || item.question || `Mensaje de ${item.name || '...'}`}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  {item.price && <span>{item.price}</span>}
                  {item.role && <span>{item.role}</span>}
                  {item.category && <span>{item.category}</span>}
                  {item.email && <span>{item.email}</span>}
                  {item.company && <span>{item.company}</span>}
                  {item.plan && (
                    <span className="text-brand-primary font-medium">Plan: {item.plan}</span>
                  )}
                  {isMessages && item.created_at && (
                    <span className="ml-auto">
                      {new Date(item.created_at).toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {isMessages ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggle(item.id, 'status')
                      }}
                      className="rounded-xl p-2 text-slate-400 transition-colors duration-300 hover:bg-brand-primary/10 hover:text-brand-primary"
                      title="Marcar como leído"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id)
                      }}
                      className="rounded-xl p-2 text-slate-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-500"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  !sectionInfo?.readOnly && (
                    <>
                      <button
                        onClick={() => onToggle(item.id, 'visible')}
                        className="rounded-xl p-2 text-slate-400 transition-colors duration-300 hover:bg-brand-primary/10 hover:text-brand-primary"
                        title={item.visible !== 0 ? 'Ocultar' : 'Mostrar'}
                      >
                        {item.visible !== 0 ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      {item.popular !== undefined && (
                        <button
                          onClick={() => onToggle(item.id, 'popular')}
                          className={`rounded-xl p-2 transition-colors duration-300 ${item.popular ? 'text-amber-500' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
                          title="Destacar"
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-xl p-2 text-slate-400 transition-colors duration-300 hover:bg-brand-primary/10 hover:text-brand-primary"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-xl p-2 text-slate-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="glass flex flex-col items-center justify-center rounded-3xl border border-white/20 py-20 shadow-lg">
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${sectionInfo?.color} opacity-50 shadow-md`}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm text-slate-500">
              {search ? 'No se encontraron resultados' : 'No hay elementos. Crea el primero.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page
            if (totalPages <= 5) {
              page = i + 1
            } else if (currentPage <= 3) {
              page = i + 1
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i
            } else {
              page = currentPage - 2 + i
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`glass flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'border-brand-primary bg-brand-primary text-white shadow-glow'
                    : 'border-white/20 text-slate-500 hover:border-brand-primary/30 hover:text-brand-primary'
                }`}
              >
                {page}
              </button>
            )
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── IMAGE UPLOAD ────────────────────────────────────────────────

function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const data = await api.upload(file)
      onChange(data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleRemove() {
    onChange('')
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md transition-colors hover:bg-red-50 hover:text-red-500"
            title="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 py-10 text-slate-500 transition-all hover:border-brand-primary hover:text-brand-primary"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <ImagePlus className="h-8 w-8" />
          )}
          <span className="text-sm font-medium">
            {uploading ? 'Subiendo...' : 'Click para subir imagen'}
          </span>
          <span className="text-xs text-slate-400">JPG, PNG, WebP, SVG (máx 5MB)</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── EDIT FORM ───────────────────────────────────────────────────

function EditForm({ section, editing, form, setForm, onSave, onCancel, loading }) {
  const sectionInfo = SECTIONS.find((s) => s.key === section)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-secondary/30 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/60 px-6 py-4 backdrop-blur-xl rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${sectionInfo?.color} shadow-md`}
            >
              {editing?.id ? (
                <Pencil className="h-4 w-4 text-white" />
              ) : (
                <Plus className="h-4 w-4 text-white" />
              )}
            </div>
            <h2 className="text-lg font-bold text-brand-secondary">
              {editing?.id ? 'Editar' : 'Nuevo'} {sectionInfo?.label?.slice(0, -1) || 'elemento'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 p-6">
          {(FIELDS[section] || []).map((field) => {
            const FieldIcon = FIELD_ICONS[field.key]
            return (
              <div key={field.key}>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-secondary">
                  {FieldIcon && <FieldIcon className="h-4 w-4 text-slate-400" />}
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : field.type === 'list' ? (
                  <textarea
                    rows={4}
                    value={
                      Array.isArray(form[field.key])
                        ? form[field.key].join('\n')
                        : form[field.key] || ''
                    }
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder="Una línea por cada elemento"
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-mono text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : field.type === 'toggle' ? (
                  <button
                    onClick={() => setForm({ ...form, [field.key]: form[field.key] ? 0 : 1 })}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      form[field.key] && form[field.key] !== 0
                        ? 'border-green-300 bg-green-50 text-green-600 shadow-md'
                        : 'border-slate-200 bg-white/80 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {form[field.key] && form[field.key] !== 0 ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                    {form[field.key] && form[field.key] !== 0 ? 'Visible en el sitio' : 'Oculto'}
                  </button>
                ) : field.type === 'select' ? (
                  <select
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-brand-secondary transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="">Selecciona...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'image' ? (
                  <ImageUpload
                    value={form[field.key] || ''}
                    onChange={(url) => setForm({ ...form, [field.key]: url })}
                  />
                ) : field.type === 'icon_picker' ? (
                  <IconPicker
                    value={form[field.key] || ''}
                    onChange={(val) => setForm({ ...form, [field.key]: val })}
                  />
                ) : field.type === 'gradient_picker' ? (
                  <GradientPicker
                    value={form[field.key] || ''}
                    onChange={(val) => setForm({ ...form, [field.key]: val })}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-brand-secondary placeholder-slate-400 transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Preview — only for services */}
        {section === 'services' && (form.icon || form.color) && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white/60 p-4">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vista previa
            </span>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${form.color || 'from-slate-500 to-slate-600'} shadow-md`}
              >
                {(() => {
                  if (!form.icon) return <Globe className="h-6 w-6 text-white" />
                  const matchName = Object.keys(ICON_MAP).find(
                    (k) => k.toLowerCase() === form.icon.toLowerCase()
                  )
                  if (matchName && ICON_MAP[matchName]) {
                    const Ico = ICON_MAP[matchName]
                    return <Ico className="h-6 w-6 text-white" />
                  }
                  return <Globe className="h-6 w-6 text-white" />
                })()}
              </div>
              <div>
                <div className="text-sm font-bold text-brand-secondary">
                  {form.title || 'Título del servicio'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  {form.icon}
                  {form.icon &&
                    !Object.keys(ICON_MAP).find(
                      (k) => k.toLowerCase() === form.icon.toLowerCase()
                    ) && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-600">
                        <AlertCircle className="h-2.5 w-2.5" /> No encontrado — se muestra Globe
                      </span>
                    )}
                </div>
                <div className="text-xs text-slate-400">{form.color || 'Sin gradiente'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/20 bg-white/60 px-6 py-4 backdrop-blur-xl rounded-b-3xl">
          <button onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {editing?.id ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MESSAGE DETAIL ─────────────────────────────────────────────

function MessageDetail({ message, onClose, onStatusChange, onDelete }) {
  if (!message) return null
  const statusColors = {
    nuevo: 'bg-blue-100 text-blue-600',
    leido: 'bg-amber-100 text-amber-600',
    respondido: 'bg-green-100 text-green-600',
    archivado: 'bg-slate-100 text-slate-500',
  }
  const statusLabels = {
    nuevo: 'Nuevo',
    leido: 'Leído',
    respondido: 'Respondido',
    archivado: 'Archivado',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-secondary/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/60 px-6 py-4 backdrop-blur-xl rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 shadow-md">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-secondary">Mensaje de {message.name}</h2>
              <p className="text-xs text-slate-400">{message.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-secondary">Estado:</span>
            <div className="flex gap-2">
              {['nuevo', 'leido', 'respondido', 'archivado'].map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(message.id, s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                    message.status === s
                      ? statusColors[s] + ' ring-2 ring-offset-1 ring-brand-primary/30'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
              <div className="text-xs font-medium text-slate-400">Nombre</div>
              <div className="mt-1 text-sm font-semibold text-brand-secondary">{message.name}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
              <div className="text-xs font-medium text-slate-400">Email</div>
              <div className="mt-1 text-sm font-semibold text-brand-secondary">{message.email}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
              <div className="text-xs font-medium text-slate-400">Teléfono</div>
              <div className="mt-1 text-sm font-semibold text-brand-secondary">
                {message.phone || '—'}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
              <div className="text-xs font-medium text-slate-400">Empresa</div>
              <div className="mt-1 text-sm font-semibold text-brand-secondary">
                {message.company || '—'}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
              <div className="text-xs font-medium text-slate-400">Tipo de proyecto</div>
              <div className="mt-1 text-sm font-semibold text-brand-secondary">
                {message.project_type || '—'}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
              <div className="text-xs font-medium text-slate-400">Presupuesto</div>
              <div className="mt-1 text-sm font-semibold text-brand-secondary">
                {message.budget || '—'}
              </div>
            </div>
            {message.plan && (
              <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-4 sm:col-span-2">
                <div className="text-xs font-medium text-brand-primary">Plan seleccionado</div>
                <div className="mt-1 text-sm font-bold text-brand-primary">{message.plan}</div>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5">
            <div className="text-xs font-medium text-slate-400 mb-2">Mensaje</div>
            <p className="text-sm text-brand-secondary leading-relaxed whitespace-pre-wrap">
              {message.description}
            </p>
          </div>

          {/* Date */}
          <div className="text-xs text-slate-400 text-right">
            {message.created_at &&
              new Date(message.created_at).toLocaleString('es-CO', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/20 bg-white/60 px-6 py-4 backdrop-blur-xl rounded-b-3xl">
          <a
            href={`mailto:${message.email}?subject=Re: Tu solicitud en ScorpiCore&body=Hola ${message.name},%0D%0A%0D%0AGracias por contactarnos.`}
            className="btn-secondary flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Responder por email
          </a>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(message.id)}
              className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
            <button onClick={onClose} className="btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SETTINGS FORM COMPONENT ──────────────────────────────────────

const LONG_FIELDS = [
  'subtitle',
  'description',
  'heading',
  'badge',
  'headingHighlight',
  'guaranteeText',
  'message',
]

function SettingsField({ label, value, onChange }) {
  if (value === null || value === undefined) return null

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
        <span className="text-sm font-medium text-brand-secondary">{label}</span>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-brand-primary' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'left-[22px]' : 'left-0.5'}`}
          />
        </button>
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-brand-secondary transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0 || typeof value[0] === 'string') {
      return (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            {label} (uno por línea)
          </label>
          <textarea
            rows={3}
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n'))}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm font-mono text-brand-secondary transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
      )
    }

    return (
      <div className="rounded-xl border border-slate-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <button
            type="button"
            onClick={() => onChange([...value, { ...value[0] }])}
            className="flex items-center gap-1 rounded-lg bg-brand-primary/10 px-2 py-1 text-xs font-medium text-brand-primary transition-colors hover:bg-brand-primary/20"
          >
            <Plus className="h-3 w-3" /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {value.map((item, i) => (
            <div key={i} className="relative rounded-lg border border-slate-100 bg-white/50 p-3">
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              {typeof item === 'object' ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(item).map(([k, v]) => (
                    <SettingsField
                      key={k}
                      label={k}
                      value={v}
                      onChange={(newVal) => {
                        const copy = [...value]
                        copy[i] = { ...copy[i], [k]: newVal }
                        onChange(copy)
                      }}
                    />
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const copy = [...value]
                    copy[i] = e.target.value
                    onChange(copy)
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-secondary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/20"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (typeof value === 'object') {
    return (
      <div className="rounded-xl border border-slate-100 p-3">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="space-y-2">
          {Object.entries(value).map(([k, v]) => (
            <SettingsField
              key={k}
              label={k}
              value={v}
              onChange={(newVal) => onChange({ ...value, [k]: newVal })}
            />
          ))}
        </div>
      </div>
    )
  }

  const isLong = LONG_FIELDS.includes(label) || (typeof value === 'string' && value.length > 60)
  if (isLong) {
    return (
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-brand-secondary transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>
    )
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-brand-secondary transition-colors focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      />
    </div>
  )
}

function SettingsForm({ data, onChange }) {
  if (!data || typeof data !== 'object') return null
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <SettingsField
          key={key}
          label={key}
          value={value}
          onChange={(newVal) => onChange({ ...data, [key]: newVal })}
        />
      ))}
    </div>
  )
}

// ─── SITE SETTINGS VIEW ──────────────────────────────────────────

const SETTINGS_LABELS = {
  hero: { label: 'Hero / Inicio', icon: Zap },
  stats: { label: 'Estadísticas', icon: BarChart3 },
  whyus: { label: 'Por qué ScorpiCore', icon: TrendingUp },
  process: { label: 'Proceso', icon: Settings },
  technologies: { label: 'Tecnologías', icon: Globe },
  contact: { label: 'Contacto', icon: Mail },
  footer: { label: 'Footer', icon: FileText },
  navbar: { label: 'Navbar', icon: Settings },
  whatsapp: { label: 'WhatsApp', icon: Smartphone },
  faq: { label: 'FAQ Section', icon: HelpCircle },
  services_section: { label: 'Sección Servicios', icon: Briefcase },
  portfolio_section: { label: 'Sección Portafolio', icon: Layers },
  pricing_section: { label: 'Sección Planes', icon: DollarSign },
  testimonials_section: { label: 'Sección Testimonios', icon: Users },
}

function SiteSettingsView({ onBack, onRefresh }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState(null)
  const [editData, setEditData] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const data = await api.getSettings()
      setSettings(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.saveSetting(editingKey, editData)
      setSettings({ ...settings, [editingKey]: editData })
      clearSettingsCache(editingKey)
      setEditingKey(null)
      toast.success('Configuración guardada')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scorpicore-settings-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Configuración exportada')
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        for (const [key, value] of Object.entries(imported)) {
          if (SETTINGS_LABELS[key]) {
            await api.saveSetting(key, value)
          }
        }
        clearSettingsCache()
        setSettings(imported)
        toast.success('Configuración importada')
      } catch (err) {
        toast.error('Archivo JSON inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-brand-secondary">Configuración del Sitio</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {Object.keys(SETTINGS_LABELS).length} secciones configurables
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label
            className="glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
            title="Importar"
          >
            <Upload className="h-4 w-4" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
            title="Exportar"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={loadSettings}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-slate-500 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
            title="Actualizar"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !settings ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl border border-white/20 py-20 shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <p className="mt-4 text-sm text-slate-500">Cargando configuración...</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SETTINGS_LABELS).map(([key, meta]) => {
            const Icon = meta.icon
            const value = settings?.[key]
            return (
              <div
                key={key}
                className="glass group rounded-2xl border border-white/20 p-4 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${SECTIONS.find((s) => s.key === 'site_settings')?.color || 'from-slate-500 to-slate-600'} shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-brand-secondary">{meta.label}</div>
                      <div className="text-xs text-slate-400">{key}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingKey(key)
                      setEditData(JSON.parse(JSON.stringify(value)))
                    }}
                    className="rounded-xl p-2 text-slate-400 transition-colors duration-300 hover:bg-brand-primary/10 hover:text-brand-primary"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                {value && (
                  <div className="mt-3 text-xs text-slate-500 line-clamp-2">
                    {typeof value === 'object'
                      ? Object.keys(value).join(', ')
                      : String(value).substring(0, 100)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* JSON Editor Modal */}
      {editingKey &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-secondary/30 p-4 backdrop-blur-sm"
            onClick={() => setEditingKey(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-3xl flex-col glass rounded-3xl border border-white/20 shadow-2xl"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/20 bg-white/60 px-6 py-4 backdrop-blur-xl rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 shadow-md`}
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-brand-secondary">
                    {SETTINGS_LABELS[editingKey]?.label || editingKey}
                  </h2>
                </div>
                <button
                  onClick={() => setEditingKey(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                <SettingsForm data={editData} onChange={setEditData} />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-white/20 bg-white/60 px-6 py-4 backdrop-blur-xl rounded-b-3xl">
                <button onClick={() => setEditingKey(null)} className="btn-secondary">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

// ─── MAIN ADMIN ──────────────────────────────────────────────────

export default function Admin({ onBack }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [section, setSection] = useState(null)
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [messageDetail, setMessageDetail] = useState(null)
  const toast = useToast()

  useEffect(() => {
    api
      .verify()
      .then((data) => {
        setAuthenticated(data.valid)
        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [])

  const loadSection = useCallback(async (key) => {
    setLoading(true)
    try {
      const data = await api.getAll(key)
      setItems(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      const [plans, services, testimonials, faqs, projects, messages] = await Promise.all([
        api.getAll('plans'),
        api.getAll('services'),
        api.getAll('testimonials'),
        api.getAll('faqs'),
        api.getAll('projects'),
        api.getAll('messages'),
      ])
      setStats({
        plans: plans.length,
        services: services.length,
        testimonials: testimonials.length,
        faqs: faqs.length,
        projects: projects.length,
        messages: messages.length,
      })
    } catch {
      setStats(null)
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      if (section) loadSection(section)
      else loadStats()
    }
  }, [authenticated, section, loadSection, loadStats])

  async function handleSave() {
    const fields = FIELDS[section] || []
    for (const f of fields.filter((f) => f.required)) {
      const val = form[f.key]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        toast.error(`El campo "${f.label}" es obligatorio`)
        return
      }
    }

    const processed = { ...form }
    fields.forEach((f) => {
      if (f.type === 'list' && typeof processed[f.key] === 'string') {
        processed[f.key] = processed[f.key]
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (f.type === 'toggle' && processed[f.key] === undefined) {
        processed[f.key] = f.default !== undefined ? f.default : true
      }
    })

    setLoading(true)
    try {
      if (editing?.id) await api.update(section, editing.id, processed)
      else await api.create(section, processed)
      await loadSection(section)
      setEditing(null)
      setForm({})
      toast.success(editing?.id ? 'Elemento actualizado' : 'Elemento creado')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    setConfirmDelete(id)
  }

  async function confirmDeleteItem() {
    const idToDelete = confirmDelete
    setConfirmDelete(null)
    setLoading(true)
    try {
      await api.remove(section, idToDelete)
      await loadSection(section)
      toast.success('Elemento eliminado')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleField(id, key) {
    try {
      if (section === 'messages' && key === 'status') {
        await api.updateMessage(id, { status: 'leido' })
        await loadSection(section)
        if (messageDetail?.id === id) setMessageDetail((prev) => ({ ...prev, status: 'leido' }))
        return
      }
      await api.toggle(section, id, key)
      await loadSection(section)
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function handleMessageStatus(id, status) {
    try {
      await api.updateMessage(id, { status })
      await loadSection(section)
      setMessageDetail((prev) => (prev?.id === id ? { ...prev, status } : prev))
      toast.success('Estado actualizado')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleLogout = async () => {
    await api.logout()
    setAuthenticated(false)
    setSection(null)
    setItems([])
    setStats(null)
  }

  if (checking) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-mesh">
        <Particles />
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden gradient-mesh">
      <Particles />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />

      {/* Top bar */}
      <div className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 hover:text-brand-primary"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all duration-300 group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 group-hover:shadow-md">
                <ArrowLeft className="h-4 w-4" />
              </div>
              Ver sitio
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 shadow-lg shadow-brand-primary/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-brand-secondary">Admin</span>
                <div className="text-[10px] text-slate-400">Panel de control</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        {!section ? (
          <Dashboard
            stats={stats}
            onSelect={(key) => {
              setSection(key)
              setEditing(null)
              setForm({})
            }}
          />
        ) : section === 'site_settings' ? (
          <SiteSettingsView
            onBack={() => {
              setSection(null)
            }}
          />
        ) : (
          <SectionView
            section={section}
            items={items}
            loading={loading}
            onBack={() => {
              setSection(null)
              setEditing(null)
              setForm({})
            }}
            onEdit={(item) => {
              setEditing(item)
              setForm({
                ...item,
                features: Array.isArray(item.features)
                  ? item.features.join('\n')
                  : item.features || '',
              })
            }}
            onDelete={handleDelete}
            onToggle={toggleField}
            onCreate={() => {
              setEditing({})
              setForm({})
            }}
            onRefresh={() => loadSection(section)}
            onMessageClick={(item) => setMessageDetail(item)}
          />
        )}
      </div>

      {/* Edit Modal */}
      {editing !== null && (
        <EditForm
          section={section}
          editing={editing}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => {
            setEditing(null)
            setForm({})
          }}
          loading={loading}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete !== null && (
        <ConfirmDialog
          title="¿Eliminar elemento?"
          message="Esta acción no se puede deshacer. El elemento será eliminado permanentemente."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={confirmDeleteItem}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Message Detail */}
      {messageDetail && (
        <MessageDetail
          message={messageDetail}
          onClose={() => setMessageDetail(null)}
          onStatusChange={handleMessageStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
