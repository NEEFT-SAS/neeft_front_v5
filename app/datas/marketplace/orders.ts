import type { MarketplaceOrderPresenter, MarketplaceOrderStatus as MarketplaceApiOrderStatus, MarketplaceServiceReviewPresenter } from '~/plugins/marketplace-api'
import { formatMarketplacePrice, getMarketplaceServiceBySlug, type MarketplaceService } from './services'

export type MarketplaceOrderRole = 'buyer' | 'seller'
export type MarketplaceOrderStatus = 'requires_action' | 'in_progress' | 'waiting_partner' | 'review' | 'completed' | 'cancelled' | 'refused'
export type MarketplaceOrderTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
export type MarketplaceTimelineState = 'done' | 'current' | 'upcoming'
export type MarketplaceDeliverableStatus = 'ready' | 'pending' | 'approved'

export type MarketplaceOrderParticipant = {
  id?: string | null
  name: string
  slug?: string | null
  role: string
  description?: string | null
  profilePicture?: string | null
}

export type MarketplaceOrderAction = {
  title: string
  description: string
  ctaLabel: string
  icon: string
  urgent?: boolean
  disabled?: boolean
}

export type MarketplaceOrderMilestone = {
  title: string
  description: string
  date: string
  state: MarketplaceTimelineState
}

export type MarketplaceOrderDeliverable = {
  title: string
  description: string
  status: MarketplaceDeliverableStatus
  url?: string
  mimeType?: string
  size?: number
}

export type MarketplaceOrderMessage = {
  author: string
  role: MarketplaceOrderRole | 'system'
  excerpt: string
  date: string
  unreadFor?: MarketplaceOrderRole[]
}

export type MarketplaceOrder = {
  id: string
  apiStatus?: MarketplaceApiOrderStatus
  serviceId: string | null
  serviceSlug: string
  serviceTitle: string
  serviceIcon: string
  serviceCoverImage: string
  buyer: MarketplaceOrderParticipant
  seller: MarketplaceOrderParticipant
  status: MarketplaceOrderStatus
  progress: number
  amount: number
  billingLabel: string
  orderedAt: string
  dueAt: string
  updatedAt: string
  scope: string
  nextCheckpoint: string
  nextActions: Record<MarketplaceOrderRole, MarketplaceOrderAction>
  milestones: MarketplaceOrderMilestone[]
  deliverables: MarketplaceOrderDeliverable[]
  review: MarketplaceServiceReviewPresenter | null
  messages: MarketplaceOrderMessage[]
  disputeOpenedAt?: string | null
  disputeReason?: string | null
  disputeDetails?: string | null
  sellerAcceptanceDeadlineAt?: string | null
  acceptedAt?: string | null
  deliveredAt?: string | null
  buyerValidationDeadlineAt?: string | null
  completedAt?: string | null
  autoCompletedAt?: string | null
  refundStatus?: MarketplaceOrderPresenter['refundStatus']
  refundProposedAt?: string | null
  refundReason?: string | null
  refundedAt?: string | null
}

export type MarketplaceOrderStatusFilter = MarketplaceOrderStatus | 'all'

export const marketplaceOrderStatusMeta: Record<MarketplaceOrderStatus, {
  label: string
  shortLabel: string
  icon: string
  tone: MarketplaceOrderTone
}> = {
  requires_action: {
    label: 'Action requise',
    shortLabel: 'Action',
    icon: 'lucide:circle-alert',
    tone: 'warning'
  },
  in_progress: {
    label: 'En cours',
    shortLabel: 'En cours',
    icon: 'lucide:activity',
    tone: 'primary'
  },
  waiting_partner: {
    label: 'En attente',
    shortLabel: 'Attente',
    icon: 'lucide:clock',
    tone: 'neutral'
  },
  review: {
    label: 'A valider',
    shortLabel: 'Validation',
    icon: 'lucide:clipboard-check',
    tone: 'danger'
  },
  completed: {
    label: 'Terminee',
    shortLabel: 'Terminee',
    icon: 'lucide:circle-check',
    tone: 'success'
  },
  cancelled: {
    label: 'Annulee',
    shortLabel: 'Annulee',
    icon: 'lucide:circle-x',
    tone: 'neutral'
  },
  refused: {
    label: 'Refusee',
    shortLabel: 'Refusee',
    icon: 'lucide:x-circle',
    tone: 'danger'
  }
}

export const marketplaceOrderStatusFilters: Array<{
  value: MarketplaceOrderStatusFilter
  label: string
  icon: string
}> = [
  { value: 'all', label: 'Toutes', icon: 'lucide:list-filter' },
  { value: 'requires_action', label: 'Action requise', icon: marketplaceOrderStatusMeta.requires_action.icon },
  { value: 'in_progress', label: 'En cours', icon: marketplaceOrderStatusMeta.in_progress.icon },
  { value: 'waiting_partner', label: 'En attente', icon: marketplaceOrderStatusMeta.waiting_partner.icon },
  { value: 'review', label: 'A valider', icon: marketplaceOrderStatusMeta.review.icon },
  { value: 'completed', label: 'Terminees', icon: marketplaceOrderStatusMeta.completed.icon },
  { value: 'refused', label: 'Refusees', icon: marketplaceOrderStatusMeta.refused.icon },
  { value: 'cancelled', label: 'Annulees', icon: marketplaceOrderStatusMeta.cancelled.icon }
]

const marketplaceDateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const marketplaceDateTimeFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const formatMarketplaceDate = (value: string, withTime = false) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return withTime ? marketplaceDateTimeFormatter.format(date) : marketplaceDateFormatter.format(date)
}

const marketplaceApiStatusProgress: Record<MarketplaceApiOrderStatus, number> = {
  PENDING: 15,
  ACCEPTED: 35,
  IN_PROGRESS: 62,
  DELIVERED: 86,
  COMPLETED: 100,
  CANCELLED: 100,
  REJECTED: 100
}

const mapMarketplaceOrderStatus = (status: MarketplaceApiOrderStatus, role: MarketplaceOrderRole): MarketplaceOrderStatus => {
  if (status === 'PENDING') return role === 'seller' ? 'requires_action' : 'waiting_partner'
  if (status === 'ACCEPTED' || status === 'IN_PROGRESS') return 'in_progress'
  if (status === 'DELIVERED') return role === 'buyer' ? 'review' : 'waiting_partner'
  if (status === 'REJECTED') return 'refused'
  if (status === 'CANCELLED') return 'cancelled'
  return 'completed'
}

const getMarketplaceOrderParticipant = (profile: MarketplaceOrderPresenter['buyer'], fallback: string): MarketplaceOrderParticipant => ({
  id: profile?.id || null,
  name: profile?.username || fallback,
  slug: profile?.slug || null,
  role: 'Profil Neeft',
  description: profile?.description || null,
  profilePicture: profile?.profilePicture || null
})

const getMarketplaceOrderAction = (order: MarketplaceOrderPresenter, role: MarketplaceOrderRole): MarketplaceOrderAction => {
  if (order.status === 'PENDING') {
    return role === 'seller'
      ? { title: 'Commande a accepter', description: 'La commande vient d arriver. Confirme le perimetre pour demarrer le suivi.', ctaLabel: 'Accepter la commande', icon: 'lucide:reply', urgent: true }
      : { title: 'Attente vendeur', description: 'Le vendeur doit accepter la commande avant demarrage.', ctaLabel: 'Voir le brief', icon: 'lucide:hourglass' }
  }

  if (order.status === 'ACCEPTED') {
    return role === 'seller'
      ? { title: 'Demarrer la mission', description: 'La commande est acceptee. Lance la production quand tu es pret.', ctaLabel: 'Demarrer', icon: 'lucide:play' }
      : { title: 'Commande acceptee', description: 'Le vendeur a accepte le brief et prepare le demarrage.', ctaLabel: 'Voir le suivi', icon: 'lucide:circle-check' }
  }

  if (order.status === 'IN_PROGRESS') {
    return role === 'seller'
      ? { title: 'Production en cours', description: 'Livraison a transmettre.', ctaLabel: 'Marquer comme livre', icon: 'lucide:package-check', urgent: true }
      : { title: 'Production en cours', description: 'Le vendeur travaille sur la commande.', ctaLabel: 'Voir les messages', icon: 'lucide:activity' }
  }

  if (order.status === 'DELIVERED') {
    return role === 'buyer'
      ? { title: 'Livraison a valider', description: 'Le vendeur a livre. Valide uniquement si le service correspond a la commande.', ctaLabel: 'Valider la livraison', icon: 'lucide:clipboard-check', urgent: true }
      : { title: 'Attente validation', description: 'La livraison est envoyee. Le prochain mouvement vient du client.', ctaLabel: 'Voir la livraison', icon: 'lucide:hourglass' }
  }

  if (order.status === 'CANCELLED' || order.status === 'REJECTED') {
    return { title: 'Commande fermee', description: 'Cette commande n est plus active.', ctaLabel: 'Voir le recap', icon: 'lucide:archive', disabled: true }
  }

  return { title: 'Commande terminee', description: 'La commande est validee et archivee.', ctaLabel: 'Voir le recap', icon: 'lucide:archive' }
}

const getMarketplaceOrderMilestones = (status: MarketplaceApiOrderStatus): MarketplaceOrderMilestone[] => {
  const statusIndex: Record<MarketplaceApiOrderStatus, number> = { PENDING: 0, ACCEPTED: 1, IN_PROGRESS: 2, DELIVERED: 3, COMPLETED: 4, CANCELLED: 4, REJECTED: 4 }
  const steps = [
    { title: 'Commande recue', description: 'Paiement securise et brief disponible.' },
    { title: 'Brief accepte', description: 'Le vendeur valide le perimetre.' },
    { title: 'Production', description: 'La prestation est en cours.' },
    { title: 'Livraison', description: 'Le resultat est transmis au client.' },
    { title: 'Validation', description: 'Le client confirme la livraison et cloture la commande.' }
  ]
  const currentIndex = statusIndex[status]

  return steps.map((step, index) => ({
    ...step,
    date: index === 0 ? 'Depart' : `Etape ${index + 1}`,
    state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
  }))
}

const getMarketplaceOrderDeliverables = (order: MarketplaceOrderPresenter): MarketplaceOrderDeliverable[] => {
  const status: MarketplaceDeliverableStatus = order.status === 'COMPLETED' ? 'approved' : order.status === 'DELIVERED' ? 'ready' : 'pending'
  const latestDelivery = [...(order.deliveries || [])].sort((left, right) => right.version - left.version)[0]

  if (latestDelivery?.files?.length) {
    return latestDelivery.files.map(file => ({
      title: file.fileName,
      description: latestDelivery.message || `Livraison version ${latestDelivery.version}`,
      status,
      url: file.url,
      mimeType: file.mimeType,
      size: file.size
    }))
  }

  return [
    {
      title: order.serviceLineName || order.serviceLine?.name || 'Prestation',
      description: order.serviceLine?.description || 'Livrable associe a la commande.',
      status
    }
  ]
}

const getMarketplaceOrderMessages = (order: MarketplaceOrderPresenter, role: MarketplaceOrderRole): MarketplaceOrderMessage[] => {
  const messages: MarketplaceOrderMessage[] = [
    { author: order.buyer?.username || 'Client', role: 'buyer', excerpt: order.brief, date: formatMarketplaceDate(order.createdAt, true), unreadFor: role === 'seller' && order.status === 'PENDING' ? ['seller'] : undefined }
  ]

  if (order.statusNote) {
    messages.unshift({ author: 'Systeme', role: 'system', excerpt: order.statusNote, date: formatMarketplaceDate(order.updatedAt, true) })
  }

  if (order.disputeOpenedAt) {
    messages.unshift({
      author: 'Systeme',
      role: 'system',
      excerpt: order.disputeReason ? `Litige ouvert: ${order.disputeReason}` : 'Litige ouvert sur cette commande.',
      date: formatMarketplaceDate(order.disputeOpenedAt, true),
      unreadFor: role === 'buyer' ? ['buyer'] : ['seller']
    })
  }

  return messages
}

export const toMarketplaceOrder = (order: MarketplaceOrderPresenter, role: MarketplaceOrderRole): MarketplaceOrder => {
  const action = getMarketplaceOrderAction(order, role)
  const serviceName = order.serviceName || order.service?.name || 'Service marketplace'
  const serviceSlug = order.service?.slug || order.serviceId || ''

  return {
    id: order.id,
    apiStatus: order.status,
    serviceId: order.serviceId,
    serviceSlug,
    serviceTitle: serviceName,
    serviceIcon: 'lucide:briefcase-business',
    serviceCoverImage: order.service?.bannerUrl || '',
    buyer: getMarketplaceOrderParticipant(order.buyer, 'Client marketplace'),
    seller: getMarketplaceOrderParticipant(order.seller, 'Vendeur marketplace'),
    status: mapMarketplaceOrderStatus(order.status, role),
    progress: marketplaceApiStatusProgress[order.status],
    amount: Number(order.amount) || 0,
    billingLabel: order.currency || 'EUR',
    orderedAt: formatMarketplaceDate(order.createdAt),
    dueAt: order.deadline === 'flexible' ? 'Delai flexible' : order.deadline === 'week' ? 'Sous 7 jours' : order.deadline === 'two-weeks' ? 'Sous 2 semaines' : 'Dans le mois',
    updatedAt: formatMarketplaceDate(order.updatedAt, true),
    scope: order.brief || 'Aucune information complementaire renseignee.',
    nextCheckpoint: action.description,
    nextActions: {
      buyer: getMarketplaceOrderAction(order, 'buyer'),
      seller: getMarketplaceOrderAction(order, 'seller')
    },
    milestones: getMarketplaceOrderMilestones(order.status),
    deliverables: getMarketplaceOrderDeliverables(order),
    review: order.review || null,
    messages: getMarketplaceOrderMessages(order, role),
    disputeOpenedAt: order.disputeOpenedAt,
    disputeReason: order.disputeReason,
    disputeDetails: order.disputeDetails,
    sellerAcceptanceDeadlineAt: order.sellerAcceptanceDeadlineAt,
    acceptedAt: order.acceptedAt,
    deliveredAt: order.deliveredAt,
    buyerValidationDeadlineAt: order.buyerValidationDeadlineAt,
    completedAt: order.completedAt,
    autoCompletedAt: order.autoCompletedAt,
    refundStatus: order.refundStatus,
    refundProposedAt: order.refundProposedAt,
    refundReason: order.refundReason,
    refundedAt: order.refundedAt
  }
}

export const toMarketplaceOrders = (orders: MarketplaceOrderPresenter[], role: MarketplaceOrderRole) => {
  return orders.map(order => toMarketplaceOrder(order, role))
}

export const marketplaceOrderRoleContent: Record<MarketplaceOrderRole, {
  eyebrow: string
  title: string
  description: string
  listTitle: string
  detailTitle: string
  counterpartLabel: string
  emptyTitle: string
  emptyDescription: string
  amountMetricLabel: string
  activeMetricLabel: string
  reviewMetricLabel: string
  otherRoleLabel: string
  otherRoleTo: string
}> = {
  buyer: {
    eyebrow: 'Compte marketplace',
    title: 'Commandes achetees',
    description: 'Suivi des services commandes a des vendeurs: brief, production, livraison, validation et historique.',
    listTitle: 'Mes achats',
    detailTitle: 'Suivi de commande',
    counterpartLabel: 'Vendeur',
    emptyTitle: 'Aucun achat trouve',
    emptyDescription: 'Modifie la recherche ou le filtre pour retrouver une commande.',
    amountMetricLabel: 'Total engage',
    activeMetricLabel: 'Achats actifs',
    reviewMetricLabel: 'Livraisons a valider',
    otherRoleLabel: 'Commandes recues',
    otherRoleTo: '/marketplace/sales'
  },
  seller: {
    eyebrow: 'Compte marketplace',
    title: 'Commandes recues',
    description: 'Pilotage des commandes passees sur tes services: priorites, brief client, livrables et prochaines echeances.',
    listTitle: 'Mes ventes',
    detailTitle: 'Commande client',
    counterpartLabel: 'Client',
    emptyTitle: 'Aucune vente trouvee',
    emptyDescription: 'Modifie la recherche ou le filtre pour retrouver une commande.',
    amountMetricLabel: 'Montant suivi',
    activeMetricLabel: 'Ventes ouvertes',
    reviewMetricLabel: 'Livraisons a traiter',
    otherRoleLabel: 'Commandes achetees',
    otherRoleTo: '/marketplace/orders'
  }
}

const requireService = (slug: string): MarketplaceService => {
  const service = getMarketplaceServiceBySlug(slug)
  if (!service) throw new Error(`Missing marketplace service ${slug}`)
  return service
}

const serviceSnapshot = (slug: string) => {
  const service = requireService(slug)

  return {
    serviceId: service.id ?? service.slug,
    serviceSlug: service.slug,
    serviceTitle: service.title,
    serviceIcon: service.icon,
    serviceCoverImage: service.coverImage,
    billingLabel: service.billingLabel
  }
}

export const marketplaceBuyerOrders: MarketplaceOrder[] = [
  {
    id: 'CMD-2408',
    ...serviceSnapshot('coach-performance-competitive'),
    buyer: { name: 'Kenan D.', role: 'Joueur Valorant' },
    seller: { name: 'Noe Lambert', role: 'Coach performance' },
    status: 'in_progress',
    progress: 58,
    amount: 85,
    orderedAt: '6 juin 2026',
    dueAt: '10 juin 2026',
    updatedAt: '9 juin 2026, 10:20',
    scope: 'Review VOD individuelle avec objectifs de routine et preparation ranked.',
    nextCheckpoint: 'Session live planifiee le 10 juin 2026 a 20:30.',
    nextActions: {
      buyer: {
        title: 'Session planifiee',
        description: 'Le brief est valide. Le prochain point est la session live avec le coach.',
        ctaLabel: 'Ouvrir le brief',
        icon: 'lucide:calendar-clock'
      },
      seller: {
        title: 'Preparer la session',
        description: 'Les VOD sont disponibles et la session doit etre cadre avant le live.',
        ctaLabel: 'Voir les VOD',
        icon: 'lucide:play-square',
        urgent: true
      }
    },
    milestones: [
      { title: 'Commande payee', description: 'Paiement securise et vendeur notifie.', date: '6 juin', state: 'done' },
      { title: 'Brief valide', description: 'Objectifs, role et VOD confirmes.', date: '7 juin', state: 'done' },
      { title: 'Session coaching', description: 'Review live et priorites de progression.', date: '10 juin', state: 'current' },
      { title: 'Synthese livree', description: 'Plan 7 jours et checklist routines.', date: '11 juin', state: 'upcoming' }
    ],
    deliverables: [
      { title: 'Analyse de deux parties', description: 'Deux VOD selectionnees et annotees.', status: 'ready' },
      { title: 'Plan d entrainement', description: 'Routine 7 jours apres la session.', status: 'pending' },
      { title: 'Debrief ecrit', description: 'Synthese concise apres le live.', status: 'pending' }
    ],
    messages: [
      { author: 'Noe Lambert', role: 'seller', excerpt: 'J ai bien recu les VOD, on garde le focus sur les decisions post-plant.', date: '9 juin' },
      { author: 'Systeme', role: 'system', excerpt: 'Brief valide par le vendeur.', date: '7 juin' }
    ]
  },
  {
    id: 'CMD-2411',
    ...serviceSnapshot('montage-video-highlights'),
    buyer: { name: 'Kenan D.', role: 'Joueur Valorant' },
    seller: { name: 'Mila Gerard', role: 'Video editor' },
    status: 'review',
    progress: 86,
    amount: 120,
    orderedAt: '4 juin 2026',
    dueAt: '9 juin 2026',
    updatedAt: '9 juin 2026, 08:45',
    scope: 'Montage vertical de highlights Valorant pour annonce de profil joueur.',
    nextCheckpoint: 'Livraison disponible, validation client attendue avant le 11 juin 2026.',
    nextActions: {
      buyer: {
        title: 'Livraison a valider',
        description: 'La premiere version est prete. Tu peux valider ou demander un retour precise.',
        ctaLabel: 'Consulter la livraison',
        icon: 'lucide:clipboard-check',
        urgent: true
      },
      seller: {
        title: 'Attente du retour client',
        description: 'La livraison est envoyee. Le prochain mouvement vient du client.',
        ctaLabel: 'Voir la livraison',
        icon: 'lucide:hourglass'
      }
    },
    milestones: [
      { title: 'Commande payee', description: 'Paiement securise et fichiers demandes.', date: '4 juin', state: 'done' },
      { title: 'Clips recus', description: 'Clips et references de rythme ajoutes.', date: '5 juin', state: 'done' },
      { title: 'Version 1 livree', description: 'Export vertical et miniature disponibles.', date: '9 juin', state: 'current' },
      { title: 'Validation finale', description: 'Validation ou retours client.', date: '11 juin', state: 'upcoming' }
    ],
    deliverables: [
      { title: 'Video verticale', description: 'Export 1080x1920 pret a publier.', status: 'ready' },
      { title: 'Miniature simple', description: 'Vignette fournie avec le pack.', status: 'ready' },
      { title: 'Retours inclus', description: 'Deux cycles de correction disponibles.', status: 'pending' }
    ],
    messages: [
      { author: 'Mila Gerard', role: 'seller', excerpt: 'Version 1 envoyee. J ai garde le rythme plus lisible sur les clutchs.', date: '9 juin', unreadFor: ['buyer'] },
      { author: 'Kenan D.', role: 'buyer', excerpt: 'Je veux une version tres claire pour recruteurs, pas trop surchargee.', date: '5 juin' }
    ]
  },
  {
    id: 'CMD-2403',
    ...serviceSnapshot('community-manager-esport'),
    buyer: { name: 'Kenan D.', role: 'Capitaine collectif' },
    seller: { name: 'Camille Moreau', role: 'Community strategist' },
    status: 'waiting_partner',
    progress: 42,
    amount: 490,
    orderedAt: '1 juin 2026',
    dueAt: '30 juin 2026',
    updatedAt: '8 juin 2026, 18:10',
    scope: 'Pilotage Discord et calendrier social pour un collectif Rocket League.',
    nextCheckpoint: 'Point hebdomadaire vendeur attendu le 12 juin 2026.',
    nextActions: {
      buyer: {
        title: 'Suivi sans action',
        description: 'Le vendeur prepare le point de progression hebdomadaire.',
        ctaLabel: 'Voir les messages',
        icon: 'lucide:message-circle'
      },
      seller: {
        title: 'Envoyer le point hebdo',
        description: 'Le client attend une synthese courte sur Discord et le planning.',
        ctaLabel: 'Envoyer une mise a jour',
        icon: 'lucide:send',
        urgent: true
      }
    },
    milestones: [
      { title: 'Commande payee', description: 'Mission mensuelle demarree.', date: '1 juin', state: 'done' },
      { title: 'Canaux audites', description: 'Discord et reseaux passes en revue.', date: '3 juin', state: 'done' },
      { title: 'Production en cours', description: 'Calendrier social et moderation active.', date: '8 juin', state: 'current' },
      { title: 'Bilan hebdo', description: 'Synthese de progression partagee.', date: '12 juin', state: 'upcoming' }
    ],
    deliverables: [
      { title: 'Planning social mensuel', description: 'Structure de publication en cours.', status: 'ready' },
      { title: 'Moderation communaute', description: 'Routine active sur Discord.', status: 'ready' },
      { title: 'Reporting performance', description: 'Premier bilan attendu cette semaine.', status: 'pending' }
    ],
    messages: [
      { author: 'Camille Moreau', role: 'seller', excerpt: 'La moderation est stable, je prepare le premier bilan vendredi.', date: '8 juin' },
      { author: 'Kenan D.', role: 'buyer', excerpt: 'Priorite sur Discord cette semaine, Instagram peut attendre.', date: '3 juin' }
    ]
  },
  {
    id: 'CMD-2396',
    ...serviceSnapshot('analyste-data-matchs'),
    buyer: { name: 'Kenan D.', role: 'Assistant coach' },
    seller: { name: 'Elena Rossi', role: 'Performance analyst' },
    status: 'completed',
    progress: 100,
    amount: 180,
    orderedAt: '24 mai 2026',
    dueAt: '30 mai 2026',
    updatedAt: '31 mai 2026, 14:05',
    scope: 'Rapport tactique sur cinq matchs Valorant et patterns adverses.',
    nextCheckpoint: 'Commande terminee et livrables archives.',
    nextActions: {
      buyer: {
        title: 'Commande terminee',
        description: 'Le rapport final est valide et reste accessible dans les livrables.',
        ctaLabel: 'Telecharger le rapport',
        icon: 'lucide:download'
      },
      seller: {
        title: 'Commande archivee',
        description: 'Le client a valide la livraison finale.',
        ctaLabel: 'Voir le recap',
        icon: 'lucide:archive'
      }
    },
    milestones: [
      { title: 'Commande payee', description: 'VOD et objectifs transmis.', date: '24 mai', state: 'done' },
      { title: 'Analyse livree', description: 'Rapport tactique partage.', date: '29 mai', state: 'done' },
      { title: 'Validation client', description: 'Livraison approuvee.', date: '31 mai', state: 'done' }
    ],
    deliverables: [
      { title: 'Analyse de 5 matchs', description: 'Sequences recurrentes annotees.', status: 'approved' },
      { title: 'Synthese tactique', description: 'Priorites staff et exercices.', status: 'approved' }
    ],
    messages: [
      { author: 'Elena Rossi', role: 'seller', excerpt: 'Rapport final envoye avec priorite sur les retakes B.', date: '29 mai' },
      { author: 'Kenan D.', role: 'buyer', excerpt: 'Valide pour moi, tres clair pour le staff.', date: '31 mai' }
    ]
  }
]

export const marketplaceSellerOrders: MarketplaceOrder[] = [
  {
    id: 'CMD-2502',
    ...serviceSnapshot('manager-equipe-tournois'),
    buyer: { name: 'Nina V.', role: 'Manager roster' },
    seller: { name: 'Kenan D.', role: 'Service management' },
    status: 'requires_action',
    progress: 18,
    amount: 690,
    orderedAt: '9 juin 2026',
    dueAt: '9 juillet 2026',
    updatedAt: '9 juin 2026, 16:30',
    scope: 'Organisation du roster, inscriptions tournois et routine de disponibilites.',
    nextCheckpoint: 'Brief client a lire et a confirmer avant le 10 juin 2026.',
    nextActions: {
      buyer: {
        title: 'Attente vendeur',
        description: 'Le vendeur doit confirmer le brief et proposer le premier cadre.',
        ctaLabel: 'Voir le brief',
        icon: 'lucide:hourglass'
      },
      seller: {
        title: 'Brief a accepter',
        description: 'La commande vient d arriver. Confirme le perimetre ou demande une precision.',
        ctaLabel: 'Repondre au brief',
        icon: 'lucide:reply',
        urgent: true
      }
    },
    milestones: [
      { title: 'Commande recue', description: 'Paiement securise et brief disponible.', date: '9 juin', state: 'current' },
      { title: 'Cadrage mission', description: 'Validation du planning et des canaux.', date: '10 juin', state: 'upcoming' },
      { title: 'Routine active', description: 'Suivi roster et inscriptions.', date: '12 juin', state: 'upcoming' }
    ],
    deliverables: [
      { title: 'Calendrier competitif', description: 'A cadrer apres acceptation.', status: 'pending' },
      { title: 'Tableau disponibilites', description: 'Structure a proposer au client.', status: 'pending' },
      { title: 'Compte rendu hebdomadaire', description: 'Premier point attendu semaine 1.', status: 'pending' }
    ],
    messages: [
      { author: 'Nina V.', role: 'buyer', excerpt: 'On veut surtout eviter les oublis d inscription et cadrer les scrims.', date: '9 juin', unreadFor: ['seller'] },
      { author: 'Systeme', role: 'system', excerpt: 'Nouvelle commande recue.', date: '9 juin', unreadFor: ['seller'] }
    ]
  },
  {
    id: 'CMD-2498',
    ...serviceSnapshot('partenariats-sponsoring-equipe'),
    buyer: { name: 'Owen R.', role: 'Fondateur club' },
    seller: { name: 'Kenan D.', role: 'Service croissance' },
    status: 'in_progress',
    progress: 64,
    amount: 390,
    orderedAt: '3 juin 2026',
    dueAt: '17 juin 2026',
    updatedAt: '9 juin 2026, 12:15',
    scope: 'Deck partenaire et ciblage de prospects pour un club amateur ambitieux.',
    nextCheckpoint: 'Version 1 du deck attendue le 11 juin 2026.',
    nextActions: {
      buyer: {
        title: 'Production en cours',
        description: 'Le vendeur travaille sur la premiere version du deck.',
        ctaLabel: 'Voir le recap',
        icon: 'lucide:activity'
      },
      seller: {
        title: 'Envoyer le deck v1',
        description: 'Les actifs du club sont complets, la prochaine etape est la premiere livraison.',
        ctaLabel: 'Ajouter un livrable',
        icon: 'lucide:upload',
        urgent: true
      }
    },
    milestones: [
      { title: 'Commande recue', description: 'Brief et actifs transmis.', date: '3 juin', state: 'done' },
      { title: 'Offre structuree', description: 'Packages et contreparties cadrees.', date: '8 juin', state: 'done' },
      { title: 'Deck v1', description: 'Premiere version a livrer.', date: '11 juin', state: 'current' },
      { title: 'Ciblage prospects', description: 'Liste de contacts priorisee.', date: '15 juin', state: 'upcoming' }
    ],
    deliverables: [
      { title: 'Deck partenariat', description: 'Version 1 en preparation.', status: 'pending' },
      { title: 'Grille de packages', description: 'Structure de valeur deja cadree.', status: 'ready' },
      { title: 'Liste de prospects', description: 'A finaliser apres validation deck.', status: 'pending' }
    ],
    messages: [
      { author: 'Kenan D.', role: 'seller', excerpt: 'J ai verrouille les trois niveaux de packages, je passe au deck.', date: '9 juin' },
      { author: 'Owen R.', role: 'buyer', excerpt: 'On prefere peu de prospects mais tres qualifies.', date: '7 juin' }
    ]
  },
  {
    id: 'CMD-2491',
    ...serviceSnapshot('coach-performance-competitive'),
    buyer: { name: 'Yanis M.', role: 'Joueur dueliste' },
    seller: { name: 'Kenan D.', role: 'Coach Valorant' },
    status: 'waiting_partner',
    progress: 30,
    amount: 85,
    orderedAt: '5 juin 2026',
    dueAt: '13 juin 2026',
    updatedAt: '8 juin 2026, 20:10',
    scope: 'Review VOD focalisee sur prise d espace et timing utilitaire.',
    nextCheckpoint: 'VOD client attendue pour lancer la preparation.',
    nextActions: {
      buyer: {
        title: 'VOD a envoyer',
        description: 'Le vendeur attend les fichiers pour preparer la session.',
        ctaLabel: 'Ajouter les VOD',
        icon: 'lucide:upload',
        urgent: true
      },
      seller: {
        title: 'Attente client',
        description: 'Aucune action vendeur tant que les VOD ne sont pas ajoutees.',
        ctaLabel: 'Relancer le client',
        icon: 'lucide:bell'
      }
    },
    milestones: [
      { title: 'Commande recue', description: 'Paiement securise.', date: '5 juin', state: 'done' },
      { title: 'Brief ouvert', description: 'Questions envoyees au client.', date: '6 juin', state: 'done' },
      { title: 'Fichiers client', description: 'VOD et objectifs attendus.', date: '13 juin', state: 'current' }
    ],
    deliverables: [
      { title: 'Analyse VOD', description: 'En attente des fichiers.', status: 'pending' },
      { title: 'Plan individuel', description: 'Prepare apres review.', status: 'pending' }
    ],
    messages: [
      { author: 'Kenan D.', role: 'seller', excerpt: 'Envoie deux VOD completes et ton objectif principal.', date: '6 juin' },
      { author: 'Systeme', role: 'system', excerpt: 'Relance automatique planifiee le 10 juin.', date: '8 juin' }
    ]
  },
  {
    id: 'CMD-2460',
    ...serviceSnapshot('community-manager-esport'),
    buyer: { name: 'Lena P.', role: 'Team owner' },
    seller: { name: 'Kenan D.', role: 'Community service' },
    status: 'completed',
    progress: 100,
    amount: 490,
    orderedAt: '1 mai 2026',
    dueAt: '31 mai 2026',
    updatedAt: '31 mai 2026, 18:45',
    scope: 'Calendrier social mensuel et moderation Discord pour lancement roster.',
    nextCheckpoint: 'Commande terminee et livrables archives.',
    nextActions: {
      buyer: {
        title: 'Commande terminee',
        description: 'Tous les livrables ont ete valides.',
        ctaLabel: 'Voir les livrables',
        icon: 'lucide:archive'
      },
      seller: {
        title: 'Commande archivee',
        description: 'Le client a valide la mission mensuelle.',
        ctaLabel: 'Voir le recap',
        icon: 'lucide:archive'
      }
    },
    milestones: [
      { title: 'Commande recue', description: 'Mission demarree.', date: '1 mai', state: 'done' },
      { title: 'Execution', description: 'Calendrier et moderation actifs.', date: '15 mai', state: 'done' },
      { title: 'Validation finale', description: 'Bilan approuve par le client.', date: '31 mai', state: 'done' }
    ],
    deliverables: [
      { title: 'Planning social mensuel', description: 'Calendrier livre.', status: 'approved' },
      { title: 'Reporting performance', description: 'Bilan final valide.', status: 'approved' }
    ],
    messages: [
      { author: 'Lena P.', role: 'buyer', excerpt: 'Bilan valide, on relancera pour le prochain roster.', date: '31 mai' },
      { author: 'Kenan D.', role: 'seller', excerpt: 'Merci, les fichiers restent dans la commande.', date: '31 mai' }
    ]
  }
]

export const getMarketplaceOrdersByRole = (role: MarketplaceOrderRole) => {
  return role === 'buyer' ? marketplaceBuyerOrders : marketplaceSellerOrders
}

export const getMarketplaceOrderByRoleAndId = (role: MarketplaceOrderRole, id: string) => {
  return getMarketplaceOrdersByRole(role).find(order => order.id === id)
}

export const getMarketplaceOrderAmountLabel = (order: Pick<MarketplaceOrder, 'amount'>) => {
  return formatMarketplacePrice(order.amount)
}
