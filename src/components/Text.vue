<script setup lang='ts'>
const props = defineProps<{ variant?: 'title', class?: string }>()

</script>

<template>
    <span class='text' :class="[{ title: props.variant === 'title' }, props.class]">
        <slot />
    </span>
</template>

<style scoped>
    .text {
        font-size: 20px;
        font-family: 'Oswald', sans-serif;
        color: white;
    }

    .title {
        font-size: 24px;
        font-family: 'Oswald', sans-serif;
        color: white;
        font-weight: 600;
    }
</style>
