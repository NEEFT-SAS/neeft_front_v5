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

        <section class="header-wallet-menu__withdrawal" aria-label="Retrait vendeur">
          <template v-if="connectStatus?.payoutsEnabled">
            <CustomInputText v-model="withdrawalAmount" label="Montant du retrait" label-position="inside" placeholder="10,00" size="sm" />
            <CustomButton :label="isWithdrawing ? 'Retrait...' : 'Retirer vers Stripe'" left-icon="lucide:landmark" theme="app" variant="filled" color="primary" size="sm" :disabled="isWithdrawing || parsedWithdrawalAmount < 10 || parsedWithdrawalAmount > availableBalance" @click="withdraw" />
          </template>
          <CustomButton v-else :label="isConnecting ? 'Ouverture...' : connectStatus?.connected ? 'Terminer la configuration Stripe' : 'Configurer les retraits Stripe'" left-icon="lucide:badge-euro" theme="app" variant="outlined" color="secondary" size="sm" :disabled="isConnecting" @click="openConnectOnboarding" />
          <p v-if="actionMessage">{{ actionMessage }}</p>
        </section>
      </div>
    </HeaderPopup>
  </div>
</template>

<script setup lang="ts">
import type { BillingConnectStatusPresenter, BillingWalletPresenter } from '~/plugins/billing-api'

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
const isConnecting = ref(false)
const isWithdrawing = ref(false)
const connectStatus = ref<BillingConnectStatusPresenter | null>(null)
const withdrawalAmount = ref('')
const withdrawalRequestKey = ref('')
const actionMessage = ref('')

const availableBalance = computed(() => Number(wallet.value?.availableBalance ?? 0))
const pendingBalance = computed(() => Number(wallet.value?.pendingBalance ?? 0))
const currency = computed(() => wallet.value?.currency || 'EUR')
const parsedWithdrawalAmount = computed(() => Number(withdrawalAmount.value.replace(',', '.')) || 0)

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
    const [nextWallet, nextConnectStatus] = await Promise.all([$billingAPI.wallet.get(), $billingAPI.connect.get()])
    wallet.value = nextWallet
    connectStatus.value = nextConnectStatus
  } catch {
    wallet.value = wallet.value ?? null
  } finally {
    isLoading.value = false
  }
}

const openConnectOnboarding = async () => {
  isConnecting.value = true
  actionMessage.value = ''
  try {
    const link = await $billingAPI.connect.onboarding()
    window.location.href = link.url
  } catch {
    actionMessage.value = 'Impossible d ouvrir la configuration Stripe.'
  } finally {
    isConnecting.value = false
  }
}

const withdraw = async () => {
  if (parsedWithdrawalAmount.value < 10 || parsedWithdrawalAmount.value > availableBalance.value) return
  isWithdrawing.value = true
  actionMessage.value = ''
  withdrawalRequestKey.value ||= crypto.randomUUID()
  try {
    await $billingAPI.wallet.withdraw(parsedWithdrawalAmount.value, withdrawalRequestKey.value)
    actionMessage.value = 'Retrait transmis a Stripe.'
    withdrawalRequestKey.value = ''
    withdrawalAmount.value = ''
    await loadWallet()
  } catch {
    actionMessage.value = 'Retrait non finalise. Une nouvelle tentative reutilisera la meme operation.'
  } finally {
    isWithdrawing.value = false
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

.header-wallet-menu__withdrawal {
  display: grid;
  gap: var(--header-user-actions-gap-1);
  padding: var(--header-user-actions-gap-2) var(--header-user-actions-gap-1);
  border-top: var(--header-user-actions-border) solid var(--header-user-actions-color-line);
}

.header-wallet-menu__withdrawal p {
  margin: 0;
  color: var(--header-user-actions-color-muted);
  font-size: var(--font-eyebrow);
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
