import type { MarketplaceServiceStatus } from '~/plugins/marketplace-api'
import type { AddToastOptions } from '~/types/toast'

type MarketplaceOrderActionToastInput = {
  title: string
  desc: string
  icon: string
  urgent?: boolean
}

const getServiceStatusUpdatedTitle = (status: MarketplaceServiceStatus) => {
  if (status === 'PUBLISHED') return 'Service publie'
  if (status === 'ARCHIVED') return 'Service desactive'
  return 'Service mis a jour'
}

export const useMarketplaceToasts = () => {
  const toast = useToast()
  const add = (options: AddToastOptions) => toast.add(options)

  const services = {
    saved: (isEditMode: boolean) => add({
      title: isEditMode ? 'Service modifie' : 'Service propose',
      desc: isEditMode ? 'La fiche service est a jour.' : 'Ta fiche est publiee sur la marketplace.',
      icon: isEditMode ? 'lucide:pencil' : 'lucide:store',
      variant: 'success',
    }),

    saveFailed: (isEditMode: boolean) => add({
      title: isEditMode ? 'Service non modifie' : 'Service non envoye',
      desc: isEditMode ? 'Impossible de modifier ce service pour le moment.' : 'Impossible de publier ce service pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    statusUpdated: (serviceName: string, status: MarketplaceServiceStatus) => add({
      title: getServiceStatusUpdatedTitle(status),
      desc: `${serviceName} a ete mis a jour.`,
      variant: 'success',
    }),

    statusUpdateFailed: () => add({
      title: 'Mise a jour impossible',
      desc: 'Le statut du service n a pas pu etre modifie.',
      variant: 'error',
    }),

    deleted: (serviceName: string) => add({
      title: 'Service supprime',
      desc: `${serviceName} a ete retire de la marketplace.`,
      icon: 'lucide:trash-2',
      variant: 'success',
    }),

    deleteFailed: () => add({
      title: 'Suppression impossible',
      desc: 'Le service n a pas pu etre supprime.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    contactRequestSent: (sellerName: string, serviceName: string) => add({
      title: 'Demande de contact envoyee',
      desc: `${sellerName} pourra te repondre a propos de ${serviceName}.`,
      icon: 'lucide:message-circle',
      variant: 'success',
    }),

    linkCopied: () => add({
      title: 'Lien copie',
      desc: 'Le lien du service a ete copie.',
      icon: 'lucide:share-2',
      variant: 'success',
    }),

    shareFailed: () => add({
      title: 'Partage indisponible',
      desc: 'Impossible de partager ce service pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),
  }

  const orders = {
    paymentPreparationFailed: () => add({
      title: 'Paiement indisponible',
      desc: 'Impossible de preparer le paiement Stripe pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    paymentConfirmed: () => add({
      title: 'Paiement confirme',
      desc: 'Ta commande est confirmee.',
      icon: 'lucide:badge-check',
      variant: 'success',
    }),

    paymentFailed: (message?: string) => add({
      title: 'Paiement impossible',
      desc: message || 'Stripe a refuse le paiement.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    actionInfo: (input: MarketplaceOrderActionToastInput) => add({
      title: input.title,
      desc: input.desc,
      icon: input.icon,
      variant: input.urgent ? 'warn' : 'info',
    }),

    statusUpdated: (orderId: string, ctaLabel: string, icon: string) => add({
      title: 'Commande mise a jour',
      desc: `${orderId} - ${ctaLabel}`,
      icon,
      variant: 'success',
    }),

    statusUpdateFailed: () => add({
      title: 'Action impossible',
      desc: 'La commande n a pas pu etre mise a jour.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    conversationOpened: (orderId: string) => add({
      title: 'Conversation',
      desc: `${orderId} - messagerie de commande`,
      icon: 'lucide:message-circle',
      variant: 'neutral',
    }),
  }

  return {
    services,
    orders,
  }
}
