<template>
  <main class="register-page" aria-labelledby="register-title">
    <section class="register-page__visual" :aria-label="t('landing.auth.register.aria.visual')">
      <div class="register-page__brand register-page__top-action">
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

      <img class="register-page__mark" src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" decoding="async">

      <div class="register-page__visual-copy">
        <p>{{ t('landing.auth.register.hero.eyebrow') }}</p>
        <h2>{{ t('landing.auth.register.hero.title') }}</h2>
        <div class="register-page__steps" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>

    <section class="register-page__content" :aria-label="t('landing.auth.register.aria.content')">
      <div class="register-page__form-shell">
        <header class="register-page__heading">
          <p>{{ registerForm?.currentStepLabel }}</p>
          <h1 id="register-title">{{ registerForm?.currentStepTitle }}</h1>
          <p>
            {{ t('landing.auth.register.header.alreadyRegistered') }}
            <NuxtLink to="/login">{{ t('landing.auth.register.header.login') }}</NuxtLink>
          </p>
        </header>

        <RegisterForm ref="registerForm" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})

const { t } = useI18n()
const registerForm = ref()
</script>

<style lang="scss">
.register-page {
  --auth-viewport-min: 100svh;
  --auth-visual-ratio: 0.55;
  --auth-visual-width: calc(100% * var(--auth-visual-ratio));
  --auth-content-width: calc(100% - var(--auth-visual-width));
  --auth-content-max: calc(var(--unit) * 72);
  --auth-mark-size: min(calc(var(--unit) * 58), 58vw);
  --auth-inline-padding: clamp(var(--space-3), calc(var(--space-2) + 3vw), var(--space-10));
  --auth-title-font: calc(var(--unit) * 4);
  --auth-copy-font: calc(var(--unit) * 2);
  --auth-eyebrow-font: calc(var(--unit) * 1.5);
  --auth-step-width: calc(var(--unit) * 5);
  --auth-visual-bg: color-mix(in oklch, var(--color-bg) 74%, var(--color-accent));
  --auth-visual-overlay: color-mix(in oklch, var(--color-panel) 72%, var(--color-transparent));
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

.register-page__visual {
  position: relative;
  display: grid;
  align-content: end;
  min-height: var(--auth-viewport-min);
  padding: var(--space-5) var(--auth-inline-padding);
  background:
    linear-gradient(145deg, var(--auth-visual-overlay), var(--color-transparent)),
    radial-gradient(circle at 46% 8%, color-mix(in oklch, var(--color-accent) 46%, var(--color-transparent)), var(--color-transparent) 32%),
    linear-gradient(150deg, var(--auth-visual-bg), var(--color-bg));
  overflow: hidden;
}

.register-page__visual::before,
.register-page__visual::after {
  position: absolute;
  inset: auto;
  border: var(--border) solid color-mix(in oklch, var(--color-accent) 40%, var(--color-transparent));
  content: "";
  pointer-events: none;
}

.register-page__visual::before {
  right: calc(var(--space-12) * -1);
  bottom: calc(var(--space-16) * -1);
  width: calc(var(--unit) * 56);
  height: calc(var(--unit) * 28);
  transform: rotate(-18deg);
}

.register-page__visual::after {
  left: calc(var(--space-12) * -1);
  bottom: calc(var(--space-10) * 2);
  width: calc(var(--unit) * 34);
  height: calc(var(--unit) * 16);
  transform: skewX(-22deg);
}

.register-page__brand {
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

.register-page__mark {
  position: absolute;
  top: calc(var(--space-6) * -1);
  left: 50%;
  width: var(--auth-mark-size);
  height: var(--auth-mark-size);
  opacity: 0.42;
  transform: translateX(-50%);
  object-fit: contain;
}

.register-page__visual-copy {
  z-index: 1;
  display: grid;
  gap: var(--space-2);
  max-width: var(--landing-copy-max);
  align-self: end;
}

.register-page__visual-copy p,
.register-page__visual-copy h2,
.register-page__heading h1,
.register-page__heading p {
  margin: 0;
}

.register-page__visual-copy p {
  color: var(--auth-muted);
  font-size: var(--auth-eyebrow-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.register-page__visual-copy h2 {
  color: var(--color-text);
  font-size: var(--auth-title-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-title);
  overflow-wrap: anywhere;
}

.register-page__steps {
  display: flex;
  gap: var(--space-2);
  padding-top: var(--space-3);
  align-items: center;
}

.register-page__steps span {
  width: var(--auth-step-width);
  height: calc(var(--border) * 4);
  border-radius: var(--radius-round);
  background-color: color-mix(in oklch, var(--color-muted) 36%, var(--color-transparent));
}

.register-page__steps span:last-child {
  background-color: var(--color-text);
}

.register-page__content {
  position: relative;
  display: grid;
  align-items: center;
  min-height: var(--auth-viewport-min);
  padding: var(--space-5) var(--auth-inline-padding);
  background-color: var(--color-panel);
}

.register-page__top-action {
  position: absolute;
  top: var(--space-5);
  left: var(--auth-inline-padding);
}

.register-page__top-action :deep(.cus-link) {
  min-width: 0;
  border-color: var(--auth-panel-line);
  background: color-mix(in oklch, var(--color-surface) 82%, var(--color-transparent));
  color: var(--color-muted);
}

.register-page__form-shell {
  display: grid;
  gap: var(--space-5);
  width: min(100%, var(--auth-content-max));
  justify-self: center;
}

.register-page__heading {
  display: grid;
  gap: var(--space-1);
}

.register-page__heading h1 {
  color: var(--color-text);
  font-size: var(--auth-title-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  overflow-wrap: anywhere;
}

.register-page__heading p,
.register-page__heading a {
  font-size: var(--auth-copy-font);
  line-height: var(--line-base);
}

.register-page__heading p {
  color: var(--auth-quiet);
}

.register-page__heading a {
  color: var(--color-muted);
  font-weight: var(--font-weight-semibold);
  text-decoration-color: currentColor;
  text-decoration-thickness: calc(var(--border) * 2);
  text-decoration-underline-offset: calc(var(--border) * 5);
}

.register-page a:focus-visible,
.register-page button:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 4);
}

@media (max-width: 56rem) {
  .register-page {
    --auth-visual-ratio: 1;
    grid-template-columns: minmax(0, 1fr);
  }

  .register-page__visual {
    min-height: calc(var(--unit) * 32);
  }

  .register-page__content {
    min-height: calc(var(--auth-viewport-min) - (var(--unit) * 32));
    padding-top: var(--space-10);
  }

  .register-page__top-action {
    position: static;
    align-self: start;
  }
}

@media (max-width: 36rem) {
  .register-page {
    --auth-title-font: calc(var(--unit) * 3.5);
    --auth-copy-font: calc(var(--unit) * 1.875);
  }

  .register-page__content {
    gap: var(--space-6);
  }
}
</style>
