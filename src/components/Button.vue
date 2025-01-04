<script setup lang="ts">
const props = defineProps<{ class?: string, disabled?: boolean, variant?: 'secondary' }>()
const emit = defineEmits(['click'])

const handleClick = () => {
    emit('click')
}

</script>
<template>
    <button class="button" :class="props.class" @click="handleClick" :disabled='props.disabled' :data-variant='props.variant'>
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
    background-color: white;
    color: black;
}

.button[data-variant='secondary'] {
    background-color: black;
    color: white;
}

.button:disabled {
    background-color: #c2c2c2;
    border: 1px solid #c2c2c2;
    color: black;
    cursor: default;

}
</style>
