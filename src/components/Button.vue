<script setup lang="ts">
const props = defineProps<{ class?: string }>()
const emit = defineEmits(['click'])

const handleClick = () => {
    emit('click')
}

</script>
<template>
    <button class="button" :class="props.class" @click="handleClick">
        <slot />
    </button>
</template>
<style scoped>
.button {
    border: 1px solid white;
    border-radius: 4px;
    padding: 4px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    justify-content: center;
    font-size: 20px;
    font-family: 'Oswald', sans-serif;
    cursor: pointer;
}
</style>
