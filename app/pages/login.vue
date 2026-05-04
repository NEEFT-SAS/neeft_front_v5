<template>
  <main class="login-page" aria-labelledby="login-title">
    <section class="login-page__visual" :aria-label="t('landing.auth.login.aria.visual')">
      <NuxtLink class="login-page__brand" to="/" :aria-label="t('landing.layout.header.aria.brand')">
        <div class="login-page__brand login-page__top-action">
          <CustomLink
            :label="t('common.actions.backToWebsite')"
            to="/"
            left-icon="lucide:arrow-left"
            theme="landing"
            variant="outlined"
            color="secondary"
            size="sm"
          />
        </div>
      </NuxtLink>

      <img class="login-page__mark" src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" decoding="async">

      <div class="login-page__visual-copy">
        <p>{{ t('landing.auth.login.hero.eyebrow') }}</p>
        <h2>{{ t('landing.auth.login.hero.title') }}</h2>
        <div class="login-page__steps" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>

    <section class="login-page__content" :aria-label="t('landing.auth.login.aria.content')">
      <div class="login-page__form-shell">
        <header class="login-page__heading">
          <h1 id="login-title">{{ t('landing.auth.login.header.title') }}</h1>
          <p>
            {{ t('landing.auth.login.header.notYetRegistered') }}
            <NuxtLink to="/register">{{ t('landing.auth.login.actions.register') }}</NuxtLink>
          </p>
        </header>

        <LoginForm />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

const { t } = useI18n()
</script>

<style lang="scss">
.login-page {
  --auth-viewport-min: 100svh;
  --auth-visual-ratio: 0.55;
  --auth-visual-width: calc(100% * var(--auth-visual-ratio));
  --auth-content-width: calc(100% - var(--auth-visual-width));
  --auth-content-max: calc(var(--unit) * 66);
  --auth-brand-logo: calc(var(--unit) * 6);
  --auth-mark-size: min(calc(var(--unit) * 58), 58vw);
  --auth-inline-padding: clamp(var(--space-3), calc(var(--space-2) + 3vw), var(--space-10));
  --auth-title-font: calc(var(--unit) * 4);
  --auth-copy-font: calc(var(--unit) * 2);
  --auth-eyebrow-font: calc(var(--unit) * 1.5);
  --auth-step-width: calc(var(--unit) * 5);
  --auth-visual-bg: color-mix(in oklch, var(--color-bg) 74%, var(--color-accent));
  --auth-visual-overlay: color-mix(in oklch, var(--color-panel) 72%, var(--color-transparent));
  --auth-content-bg: oklch(9.5% 0.014 264);
  --auth-panel-line: color-mix(in oklch, var(--color-line) 80%, var(--color-transparent));
  --auth-muted: color-mix(in oklch, var(--color-muted) 74%, var(--color-transparent));
  --auth-quiet: color-mix(in oklch, var(--color-muted) 58%, var(--color-transparent));
  display: grid;
  grid-template-columns: minmax(0, var(--auth-visual-width)) minmax(0, var(--auth-content-width));
  width: 100%;
  min-height: var(--auth-viewport-min);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  overflow: hidden;
}

.login-page__visual {
  position: relative;
  display: grid;
  grid-template-rows: auto auto;
  align-content: space-between;
  min-height: var(--auth-viewport-min);
  padding: var(--auth-top-offset) var(--auth-inline-padding);
  background:
    linear-gradient(145deg, var(--auth-visual-overlay), var(--color-transparent)),
    radial-gradient(circle at 46% 8%, color-mix(in oklch, var(--color-accent) 46%, var(--color-transparent)), var(--color-transparent) 32%),
    linear-gradient(150deg, var(--auth-visual-bg), var(--color-bg));
  overflow: hidden;
}

.login-page__visual::before,
.login-page__visual::after {
  position: absolute;
  inset: auto;
  border: var(--border) solid color-mix(in oklch, var(--color-accent) 40%, var(--color-transparent));
  content: "";
  pointer-events: none;
}

.login-page__visual::before {
  right: calc(var(--space-12) * -1);
  bottom: calc(var(--space-16) * -1);
  width: calc(var(--unit) * 56);
  height: calc(var(--unit) * 28);
  transform: rotate(-18deg);
}

.login-page__visual::after {
  left: calc(var(--space-12) * -1);
  bottom: calc(var(--space-10) * 2);
  width: calc(var(--unit) * 34);
  height: calc(var(--unit) * 16);
  transform: skewX(-22deg);
}

.login-page__brand {
  z-index: 1;
  display: inline-flex;
  gap: var(--space-1);
  width: fit-content;
  align-items: center;
  color: var(--landing-color-header-text);
  font-size: var(--font-card);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  text-decoration: none;
}

.login-page__brand img {
  width: var(--auth-brand-logo);
  height: var(--auth-brand-logo);
  object-fit: contain;
}

.login-page__mark {
  position: absolute;
  top: calc(var(--space-6) * -1);
  left: 50%;
  width: var(--auth-mark-size);
  height: var(--auth-mark-size);
  opacity: 0.42;
  transform: translateX(-50%);
  object-fit: contain;
}

.login-page__visual-copy {
  z-index: 1;
  display: grid;
  gap: var(--space-2);
  max-width: var(--landing-copy-max);
}

.login-page__visual-copy p,
.login-page__visual-copy h2,
.login-page__heading h1,
.login-page__heading p {
  margin: 0;
}

.login-page__visual-copy p {
  color: var(--auth-muted);
  font-size: var(--auth-eyebrow-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.login-page__visual-copy h2 {
  color: var(--color-text);
  font-size: var(--auth-title-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-title);
  overflow-wrap: anywhere;
}

.login-page__steps {
  display: flex;
  gap: var(--space-2);
  padding-top: var(--space-3);
  align-items: center;
}

.login-page__steps span {
  width: var(--auth-step-width);
  height: calc(var(--border) * 4);
  border-radius: var(--radius-round);
  background-color: color-mix(in oklch, var(--color-muted) 36%, var(--color-transparent));
}

.login-page__steps span:last-child {
  background-color: var(--color-text);
}

.login-page__content {
  position: relative;
  display: grid;
  align-items: center;
  min-height: var(--auth-viewport-min);
  padding: var(--space-5) var(--auth-inline-padding);
  background-color: var(--auth-content-bg);
}

.login-page__top-action {
  position: absolute;
  top: var(--space-5);
  left: var(--auth-inline-padding);
}

.login-page__top-action :deep(.cus-link) {
  min-width: 0;
  border-color: var(--auth-panel-line);
  background: color-mix(in oklch, var(--color-surface) 82%, var(--color-transparent));
  color: var(--color-muted);
}

.login-page__form-shell {
  display: grid;
  gap: var(--space-5);
  width: min(100%, var(--auth-content-max));
  justify-self: center;
}

.login-page__heading {
  display: grid;
  gap: var(--space-1);
}

.login-page__heading h1 {
  color: var(--color-text);
  font-size: var(--auth-title-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  overflow-wrap: anywhere;
}

.login-page__heading p,
.login-page__heading a {
  font-size: var(--auth-copy-font);
  line-height: var(--line-base);
}

.login-page__heading p {
  color: var(--auth-quiet);
}

.login-page__heading a {
  color: var(--color-muted);
  font-weight: var(--font-weight-semibold);
  text-decoration-color: currentColor;
  text-decoration-thickness: calc(var(--border) * 2);
  text-underline-offset: calc(var(--border) * 5);
}

.login-page a:focus-visible,
.login-page button:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 4);
}

@media (max-width: 56rem) {
  .login-page {
    --auth-visual-ratio: 1;
    grid-template-columns: minmax(0, 1fr);
  }

  .login-page__visual {
    min-height: calc(var(--unit) * 32);
  }

  .login-page__content {
    min-height: calc(var(--auth-viewport-min) - (var(--unit) * 32));
    padding-top: var(--space-10);
  }

  .login-page__top-action {
    position: static;
    align-self: start;
  }
}

@media (max-width: 36rem) {
  .login-page {
    --auth-title-font: calc(var(--unit) * 3.5);
    --auth-copy-font: calc(var(--unit) * 1.875);
  }

  .login-page__content {
    gap: var(--space-6);
  }
}
</style>
