<script setup lang='ts'>
const props = defineProps<{ variant?: 'title', class?: string }>()

</script>

<template>
    <h1 v-if="props.variant === 'title'" class='text title' :class="[props.class]">
        <slot />
    </h1>
    <span v-if="!props.variant" class='text' :class="[{ title: props.variant === 'title' }, props.class]">
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
