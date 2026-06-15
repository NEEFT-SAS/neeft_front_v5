<template>
  <BaseProfileSection
    :title="counterpartLabel"
    eyebrow="Profil"
    compact
    id="marketplace-order-counterpart"
  >
    <div class="marketplace-order-counterpart-widget">
      <div class="marketplace-order-counterpart-widget__identity">
        <CustomAvatar
          :src="config.profile.getUserAvatarUrl(counterpart.profilePicture)"
          :name="counterpart.name"
          :alt="`Avatar de ${counterpart.name}`"
          size="lg"
          theme="app"
          color="primary"
        />
        <strong>{{ counterpart.name }}</strong>
      </div>

      <p v-if="description">{{ description }}</p>

      <CustomLink
        v-if="profilePath"
        label="Voir le profil"
        :to="profilePath"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
      />
    </div>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceOrder, MarketplaceOrderRole } from '~/datas/marketplace/orders'

const props = defineProps<{
  order: MarketplaceOrder
  role: MarketplaceOrderRole
  counterpartLabel: string
}>()

const config = useConfig()
const counterpart = computed(() => props.role === 'buyer' ? props.order.seller : props.order.buyer)
const profilePath = computed(() => counterpart.value.slug ? `/players/${encodeURIComponent(counterpart.value.slug)}` : '')
const description = computed(() => {
  if (counterpart.value.description) return counterpart.value.description

  return props.role === 'buyer'
    ? 'Ce vendeur assure la livraison et le suivi de cette prestation.'
    : ''
})
</script>

<style scoped>
.marketplace-order-counterpart-widget {
  display: grid;
  gap: var(--orders-space-3);
}

.marketplace-order-counterpart-widget__identity {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--orders-space-2);
  align-items: center;
}

.marketplace-order-counterpart-widget__identity strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-body);
  font-weight: 700;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-counterpart-widget p {
  margin: 0;
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

.marketplace-order-counterpart-widget :deep(.cus-link) {
  width: 100%;
  min-width: 0;
}
</style>
