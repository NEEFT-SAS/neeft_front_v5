<template>
  <div class="header-user-menu-shell">
    <button
      :id="triggerId"
      class="header-user-actions__icon-button"
      type="button"
      aria-label="Ouvrir le wallet"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="emit('toggle')"
    >
      <Icon name="lucide:wallet" aria-hidden="true" />
    </button>
    <HeaderPopup
      :id="panelId"
      class="header-user-menu-popup"
      :open="open"
      :theme="theme"
      align="end"
      :labelledby-id="triggerId"
    >
      <div class="header-user-menu header-user-menu--wallet" role="none">
        <section class="header-wallet-menu__balance" aria-label="Solde disponible">
          <span>Solde disponible</span>
          <strong>{{ formatCurrency(availableBalance) }}</strong>
        </section>

        <dl class="header-wallet-menu__rows">
          <div>
            <dt>Solde en attente</dt>
            <dd>{{ formatCurrency(pendingBalance) }}</dd>
          </div>
        </dl>
      </div>
    </HeaderPopup>
  </div>
</template>

<script setup lang="ts">
import type { BillingWalletPresenter } from '~/plugins/billing-api'

type HeaderMenuTheme = 'landing' | 'app'

const props = withDefaults(defineProps<{
  open: boolean
  theme?: HeaderMenuTheme
  triggerId: string
  panelId: string
}>(), { theme: 'app' })

const emit = defineEmits<{
  toggle: []
}>()

const { $billingAPI } = useNuxtApp()
const wallet = ref<BillingWalletPresenter | null>(null)
const isLoading = ref(false)

const availableBalance = computed(() => Number(wallet.value?.availableBalance ?? 0))
const pendingBalance = computed(() => Number(wallet.value?.pendingBalance ?? 0))
const currency = computed(() => wallet.value?.currency || 'EUR')

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.value
  }).format(amount)
}

const loadWallet = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    wallet.value = await $billingAPI.wallet.get()
  } catch {
    wallet.value = wallet.value ?? null
  } finally {
    isLoading.value = false
  }
}

watch(() => props.open, (open) => {
  if (open) void loadWallet()
}, { immediate: true })
</script>

<style scoped>
.header-user-menu--wallet {
  width: calc(var(--unit) * 34);
  min-width: calc(var(--unit) * 34);
}

.header-wallet-menu__balance,
.header-wallet-menu__rows > div {
  display: grid;
  gap: calc(var(--unit) * 0.5);
}

.header-wallet-menu__balance {
  padding: var(--header-user-actions-gap-1) var(--header-user-actions-gap-1) var(--header-user-actions-gap-2);
}

.header-wallet-menu__balance span,
.header-wallet-menu__rows dt {
  color: var(--header-user-actions-color-muted);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--header-user-actions-line);
}

.header-wallet-menu__balance strong {
  color: var(--header-user-actions-color-text);
  font-size: calc(var(--unit) * 3.5);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-tight);
}

.header-wallet-menu__rows {
  display: grid;
  gap: var(--header-user-actions-gap-1);
  margin: 0;
  padding: var(--header-user-actions-gap-2) var(--header-user-actions-gap-1) var(--header-user-actions-gap-1);
  border-top: var(--header-user-actions-border) solid var(--header-user-actions-color-line);
}

.header-wallet-menu__rows > div {
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
}

.header-wallet-menu__rows dt,
.header-wallet-menu__rows dd {
  margin: 0;
}

.header-wallet-menu__rows dd {
  color: var(--header-user-actions-color-text);
  font-size: var(--header-user-actions-font-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--header-user-actions-line);
  text-align: right;
}
</style>
