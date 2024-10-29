
<script setup>
import { translate } from '@/utils/text/translate.ts'
</script>

<template>
    <ul>
        <li>
            {{translate('Place each ship in any horizontal or vertical position.')}}
        </li>
        <li>
            {{translate('Drag ships to place them inside the board.')}}
        </li>
        <li>
            {{translate('Double click on the ships to rotate them.')}}
        </li>
        <li>
            {{translate('Press "Ready" button to start the game.')}}
        </li>
    </ul>
</template>

<style scoped>
ul {
    position: absolute;
    bottom: 5vh;
    left: 5vw;
    margin: 0;
    padding: 0
}
li {
    color: white;
    font-size: 16px;
    font-family: 'Oswald', sans-serif;
}
</style>
