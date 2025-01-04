<script setup lang='ts' >
    const props = defineProps<{ label?: string, name: string, id?: string, placeholder?: string, disabled?: boolean, value: string }>()
    const emits = defineEmits<{ (e: 'change', value: string, event: Event): void  }>()

    const handleChange = (e: Event) => {
        emits('change', (e.target as HTMLInputElement).value, e)
    }

</script>

<template>
    <div class='container'>
        <label v-if='!!label' class='label' :for='props.id ?? props.name'>{{ label }}</label>
        <input class='input' :name='props.name' :id='props.id ?? props.name' :placeholder='props.placeholder' :disabled='props.disabled' v-model='props.value' @input='handleChange' />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    }

    .label {
        color: white;
        font-size: 20px;
        font-family: 'Oswald', sans-serif;

    }

    .input {
        border: 0;
        font-family: 'Oswald', sans-serif;
        font-size: 18px;
        padding: 4px 10px;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
    }
</style>
