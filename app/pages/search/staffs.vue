<template>
  <ProfileSearchPage
    layout-theme="app"
    profile-kind="staffs"
    profile-path-prefix="/staffs"
    :eyebrow="t('app.search.staffs.hero.eyebrow')"
    :title="t('app.search.staffs.hero.title')"
    :description="t('app.search.staffs.hero.description')"
    :search-label="t('app.search.staffs.filters.searchLabel')"
    :search-placeholder="t('app.search.staffs.filters.searchPlaceholder')"
    :result-singular="t('app.search.staffs.results.singular')"
    :result-plural="t('app.search.staffs.results.plural')"
    :empty-message="t('app.search.staffs.results.empty')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const config = useConfig()
const pageConfig = config.search.staffs

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: () => t(pageConfig.seo.titleKey),
  description: () => t(pageConfig.seo.descriptionKey),
  ogTitle: () => t(pageConfig.seo.ogTitleKey || pageConfig.seo.titleKey),
  ogDescription: () => t(pageConfig.seo.ogDescriptionKey || pageConfig.seo.descriptionKey),
  ogImage: pageConfig.seo.ogImage,
  twitterCard: pageConfig.seo.twitterCard,
  twitterImage: pageConfig.seo.twitterImage
})
</script>
