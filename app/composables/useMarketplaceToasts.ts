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

    contactOpened: (orderId: string, targetName: string) => add({
      title: 'Contact',
      desc: `${orderId} - message a ${targetName}`,
      icon: 'lucide:message-circle',
      variant: 'neutral',
    }),

    receiptRequested: (orderId: string) => add({
      title: 'Recu ouvert',
      desc: `${orderId} - le recu Stripe est disponible.`,
      icon: 'lucide:receipt-text',
      variant: 'success',
    }),

    receiptUnavailable: (orderId: string) => add({
      title: 'Recu indisponible',
      desc: `${orderId} - Stripe n a pas encore fourni de recu.`,
      icon: 'lucide:circle-alert',
      variant: 'warn',
    }),

    invoiceOpened: (orderId: string) => add({
      title: 'Facture ouverte',
      desc: `${orderId} - la facture Stripe est disponible.`,
      icon: 'lucide:file-text',
      variant: 'success',
    }),

    invoiceUnavailable: (orderId: string) => add({
      title: 'Facture indisponible',
      desc: `${orderId} - aucun document facture n est genere pour ce paiement.`,
      icon: 'lucide:circle-alert',
      variant: 'warn',
    }),

    paymentDocumentFailed: () => add({
      title: 'Document indisponible',
      desc: 'Impossible de recuperer le document de paiement pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    sellerUpdateOpened: (orderId: string) => add({
      title: 'Mise a jour vendeur',
      desc: `${orderId} - ajout d une information de suivi`,
      icon: 'lucide:send',
      variant: 'neutral',
    }),

    disputeOpened: (orderId: string) => add({
      title: 'Litige ouvert',
      desc: `${orderId} - le dossier litige est enregistre.`,
      icon: 'lucide:flag',
      variant: 'success',
    }),

    disputeAlreadyOpened: (orderId: string) => add({
      title: 'Litige deja ouvert',
      desc: `${orderId} - un dossier litige existe deja.`,
      icon: 'lucide:flag',
      variant: 'warn',
    }),

    disputeFailed: () => add({
      title: 'Litige non cree',
      desc: 'Impossible d ouvrir un litige pour cette commande.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    refundProposed: (orderId: string) => add({
      title: 'Remboursement propose',
      desc: `${orderId} - le client est informe.`,
      icon: 'lucide:rotate-ccw',
      variant: 'success',
    }),

    refundAlreadyProposed: (orderId: string) => add({
      title: 'Remboursement deja propose',
      desc: `${orderId} - une proposition existe deja.`,
      icon: 'lucide:rotate-ccw',
      variant: 'warn',
    }),

    refundProposalFailed: () => add({
      title: 'Remboursement non propose',
      desc: 'Impossible de proposer ce remboursement.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),

    reviewCreated: (orderId: string) => add({
      title: 'Avis publie',
      desc: `${orderId} - merci pour ton retour.`,
      icon: 'lucide:star',
      variant: 'success',
    }),

    reviewFailed: () => add({
      title: 'Avis non publie',
      desc: 'Impossible de publier cet avis pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    }),
  }

  return {
    services,
    orders,
  }
}
