<template>
  <footer class="landing-footer">
    <div class="landing-footer__inner">
      <section class="landing-footer__top">
        <LandingFooterBrand />
        <LandingFooterColumn titleId="footer-solutions" :items="config.menus.landing.footer.solutions">
          <template #title>{{ t('landing.layout.footer.sections.solutions.title') }}</template>
        </LandingFooterColumn>
        <LandingFooterColumn titleId="footer-product" :items="config.menus.landing.footer.product">
          <template #title>{{ t('landing.layout.footer.sections.product.title') }}</template>
        </LandingFooterColumn>
        <LandingFooterColumn titleId="footer-company" :items="config.menus.landing.footer.company">
          <template #title>{{ t('landing.layout.footer.sections.company.title') }}</template>
        </LandingFooterColumn>
        <LandingFooterColumn titleId="footer-links" :items="config.menus.landing.footer.links">
          <template #title>{{ t('landing.layout.footer.sections.usefulLinks.title') }}</template>
        </LandingFooterColumn>
      </section>

      <div class="landing-footer__separator" aria-hidden="true" />

      <section class="landing-footer__bottom">
        <LandingFooterLegal :items="config.menus.landing.footer.legal" />
        <LandingFooterSocial :items="config.menus.landing.footer.social" />
      </section>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const config = useConfig()
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-footer {
  background-color: var(--landing-color-footer-bg);
  color: var(--landing-color-footer-text);
  font-family: var(--font-ui);
  position: relative;
  width: 100%;
}

.landing-footer *,
.landing-footer *::before,
.landing-footer *::after {
  letter-spacing: 0;
  min-width: 0;
  box-sizing: border-box;
}

.landing-footer__inner {
  width: min(calc(100% - (var(--space-fluid) * 2)), calc(var(--unit) * 56));
  padding: var(--space-10) 0;
  margin: 0 auto;
}

.landing-footer__top {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5) var(--space-4);
  align-items: start;
}

.landing-footer__separator {
  height: var(--border);
  margin: var(--space-7) 0 var(--space-4);
  background-color: var(--landing-color-footer-line);
}

.landing-footer__bottom {
  display: grid;
  gap: var(--space-4);
  justify-items: center;
  text-align: center;
}

.landing-footer a:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 4);
}

@include breakpoint-below-sm {
  .landing-footer__top {
    grid-template-columns: minmax(0, 1fr);
  }
}

@include breakpoint-md {
  .landing-footer__inner {
    width: min(calc(100% - (var(--space-fluid) * 2)), calc(var(--unit) * 80));
  }

  .landing-footer__top {
    gap: var(--space-7);
  }
}

@include breakpoint-lg {
  .landing-footer__inner {
    width: min(calc(100% - (var(--space-fluid) * 2)), var(--landing-footer-inner-max));
    padding: var(--space-12) 0 var(--space-10);
  }

  .landing-footer__top {
    grid-template-columns: minmax(min(100%, var(--landing-footer-brand-min)), 1.35fr) repeat(auto-fit, minmax(min(100%, var(--landing-footer-column-min)), 1fr));
  }

  .landing-footer__separator {
    margin: var(--space-10) 0 var(--space-5);
  }

  .landing-footer__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }
}
</style>
