<template>
  <BaseProfileSection
    title="Suivi de commande"
    eyebrow="Suivi"
    surface="plain"
    id="marketplace-order-tracking"
  >
    <div class="marketplace-order-tracking-widget__current">
      <h3>{{ currentMilestone?.title || order.nextCheckpoint }}</h3>
    </div>

    <ol class="marketplace-order-tracking-widget__steps">
      <li v-for="milestone in timeline" :key="milestone.id" :data-state="milestone.state">
        <span class="marketplace-order-tracking-widget__marker" aria-hidden="true">
          <Icon :name="milestone.state === 'current' ? 'lucide:circle-dot' : 'lucide:check'" />
        </span>
        <div class="marketplace-order-tracking-widget__content">
          <header>
            <strong>{{ milestone.title }}</strong>
            <small>{{ milestone.date }}</small>
          </header>
          <p>{{ milestone.description }}</p>
        </div>
      </li>
    </ol>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceOrder } from '~/datas/marketplace/orders'
import type { MarketplaceOrderEventPresenter } from '~/plugins/marketplace-api'

const props = defineProps<{
  order: MarketplaceOrder
  events?: MarketplaceOrderEventPresenter[]
}>()

const statusLabels: Record<string, string> = {
  PENDING: 'Commande recue',
  ACCEPTED: 'Commande acceptee',
  IN_PROGRESS: 'Production demarree',
  DELIVERED: 'Livraison envoyee',
  COMPLETED: 'Commande terminee',
  CANCELLED: 'Commande annulee',
  REJECTED: 'Commande refusee'
}

const eventLabels: Record<string, string> = {
  PAYMENT_CONFIRMED: 'Paiement confirme',
  DELIVERY_FILES_UPLOADED: 'Fichiers ajoutes',
  DELIVERY_SUBMITTED: 'Livraison envoyee',
  DELIVERY_REVISION_REQUESTED: 'Correction demandee',
  DISPUTE_OPENED: 'Litige ouvert',
  DISPUTE_RESOLVED: 'Litige resolu',
  REFUND_PROPOSED: 'Remboursement propose',
  REFUND_ACCEPTED: 'Remboursement accepte',
  REFUND_REJECTED: 'Remboursement refuse',
  AUTO_CANCELLED: 'Commande annulee automatiquement',
  AUTO_COMPLETED: 'Commande validee automatiquement'
}

const formatDate = (value: string) => new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(value))

const eventDescription = (event: MarketplaceOrderEventPresenter) => {
  const payload = event.payload || {}
  const detail = payload.note || payload.message || payload.reason || payload.details
  const actor = event.actor?.username || (event.actorType === 'SYSTEM' ? 'Automatisation Neeft' : event.actorType === 'ADMIN' ? 'Administration' : 'Participant')
  if (event.type === 'DELIVERY_FILES_UPLOADED' && payload.fileCount) {
    const fileCount = Number(payload.fileCount)
    return `${actor} - ${fileCount} fichier${fileCount > 1 ? 's' : ''} ajoute${fileCount > 1 ? 's' : ''}${detail ? ` - ${String(detail)}` : ''}`
  }
  return detail ? `${actor} - ${String(detail)}` : actor
}

const timeline = computed(() => {
  if (!props.events?.length) {
    return props.order.milestones.map((milestone, index) => ({
      ...milestone,
      id: `${props.order.id}-${index}`,
      state: props.order.apiStatus === 'COMPLETED' && milestone.state === 'current' ? 'done' as const : milestone.state,
    }))
  }

  return props.events.map((event, index) => ({
    id: event.id,
    title: event.type === 'STATUS_UPDATED'
      ? statusLabels[event.nextStatus || ''] || 'Statut mis a jour'
      : eventLabels[event.type] || event.type.replaceAll('_', ' ').toLocaleLowerCase('fr-FR'),
    description: eventDescription(event),
    date: formatDate(event.createdAt),
    state: index === props.events!.length - 1 && props.order.apiStatus !== 'COMPLETED'
      ? 'current' as const
      : 'done' as const,
  }))
})

const currentMilestone = computed(() => {
  return timeline.value.find(milestone => milestone.state === 'current')
    || [...timeline.value].reverse().find(milestone => milestone.state === 'done')
    || timeline.value[0]
})
</script>

<style scoped>
.marketplace-order-tracking-widget__current {
  display: grid;
  gap: var(--orders-space-3);
}

.marketplace-order-tracking-widget__current h3 {
  margin: 0;
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-tracking-widget__steps {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-order-tracking-widget__steps li {
  position: relative;
  display: grid;
  grid-template-columns: calc(var(--orders-unit) * 4) minmax(0, 1fr);
  gap: var(--orders-space-2);
  min-height: calc(var(--orders-unit) * 9);
}

.marketplace-order-tracking-widget__steps li::before {
  position: absolute;
  top: calc(var(--orders-unit) * 4);
  bottom: 0;
  left: calc(var(--orders-unit) * 2 - var(--orders-border));
  width: calc(var(--orders-border) * 2);
  background-color: color-mix(in oklch, var(--orders-color-line) 78%, var(--orders-color-transparent));
  content: "";
}

.marketplace-order-tracking-widget__steps li:last-child::before {
  display: none;
}

.marketplace-order-tracking-widget__steps li[data-state='done']::before {
  background-color: color-mix(in oklch, var(--orders-color-success) 62%, var(--orders-color-line));
}

.marketplace-order-tracking-widget__steps li[data-state='current']::before {
  background-color: var(--orders-color-accent);
}

.marketplace-order-tracking-widget__marker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  width: calc(var(--orders-unit) * 4);
  height: calc(var(--orders-unit) * 4);
  align-items: center;
  justify-content: center;
  border: calc(var(--orders-border) * 2) solid var(--orders-color-line);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-bg);
  color: var(--orders-color-subtle);
}

.marketplace-order-tracking-widget__marker svg {
  width: calc(var(--orders-unit) * 2);
  height: calc(var(--orders-unit) * 2);
}

.marketplace-order-tracking-widget__steps li[data-state='done'] .marketplace-order-tracking-widget__marker {
  border-color: var(--orders-color-success);
  background-color: var(--orders-color-success);
  color: var(--orders-color-bg);
}

.marketplace-order-tracking-widget__steps li[data-state='current'] .marketplace-order-tracking-widget__marker {
  border-color: var(--orders-color-accent);
  color: var(--orders-color-accent);
}

.marketplace-order-tracking-widget__content {
  display: grid;
  gap: calc(var(--orders-unit) * 0.75);
  padding: calc(var(--orders-unit) * 0.5) 0 var(--orders-space-4);
  border-bottom: var(--orders-border) solid color-mix(in oklch, var(--orders-color-line) 70%, var(--orders-color-transparent));
}

.marketplace-order-tracking-widget__steps li:last-child .marketplace-order-tracking-widget__content {
  border-bottom: 0;
}

.marketplace-order-tracking-widget__content header {
  display: flex;
  gap: var(--orders-space-2);
  align-items: baseline;
  justify-content: space-between;
}

.marketplace-order-tracking-widget__content strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 700;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-order-tracking-widget__content small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
  text-align: right;
  overflow-wrap: anywhere;
}

.marketplace-order-tracking-widget__content p {
  margin: 0;
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  overflow-wrap: anywhere;
}

@media (max-width: 46rem) {
  .marketplace-order-tracking-widget__content header {
    display: grid;
    gap: calc(var(--orders-unit) * 0.5);
  }

  .marketplace-order-tracking-widget__content small {
    text-align: left;
  }
}
</style>
