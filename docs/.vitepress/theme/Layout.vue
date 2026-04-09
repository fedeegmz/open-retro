<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Landing from './Landing.vue'

const { frontmatter } = useData()
</script>

<template>
  <Landing v-if="frontmatter.layout === 'Landing'" />
  <DefaultTheme.Layout v-else />
</template>
