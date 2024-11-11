<script setup lang='ts'>
    import Text from '@/components/Text.vue'

    const props = defineProps<{ size?: number, text?: string }>()
</script>

<template>
    <div class='loaderContainer'>
        <span class="loader" :style="{ height: (props.size ?? 30) + 'px', width: (props.size ?? 30) + 'px' }"></span>
        <Text v-if='!!props.text'>{{ props.text }}</Text>
    </div>
</template>

<style scoped>
.loaderContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

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
