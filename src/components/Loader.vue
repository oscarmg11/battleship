<script setup lang='ts'>
    const props = defineProps<{ size?: number }>()
</script>

<template>
    <span class="loader" :style="{ height: (props.size ?? 30) + 'px', width: (props.size ?? 30) + 'px' }"></span>
</template>

<style scoped>
.loader {
    border: 2px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
