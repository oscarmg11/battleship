<script setup lang='ts'>
    import { GameMessageVm } from '@/types/GameMessageVm.js'
    import Loader from '@/components/Loader.vue'
    import Text from '@/components/Text.vue'
    import { onMounted, ref, watch } from 'vue'

    const AnimationTime = 300
    const AnimationDelayTime = 2000

    const props = defineProps<{ gameMessage: GameMessageVm, hasNextMessage: boolean }>()
    const gameMessage = props.gameMessage

    const emits = defineEmits<{ (e: 'onFinish'): void }>()

    const shouldHideMessage = ref(false)
    const shouldHideMessageImmediately = ref(false)

    onMounted(() => {
        if(!gameMessage.lastUntilNewMessage || props.hasNextMessage) {
            shouldHideMessage.value = true
            setTimeout(() => {
                emits('onFinish')
            }, AnimationDelayTime + AnimationTime)
        }
    })

    watch(() => props.hasNextMessage,() => {
        if(gameMessage.lastUntilNewMessage || props.hasNextMessage) {
            shouldHideMessageImmediately.value = true
            setTimeout(() => {
                emits('onFinish')
            }, AnimationTime)
        }
    })

    const createAnimations = () => {
        let animation = `${AnimationTime}ms ease forwards showMessage`
        if(shouldHideMessage.value) animation += `, ${AnimationTime}ms ease ${AnimationDelayTime}ms forwards hideMessage`
        if(shouldHideMessageImmediately.value) animation += `, ${AnimationTime}ms ease forwards hideMessage`
        return animation
    }

</script>

<template>
    <div class="gameMessage" :style='{ animation: createAnimations() }'>
        <Loader :size='20' :text="gameMessage.message"  v-if='gameMessage.loader'  />
        <Text  v-if='!gameMessage.loader'>{{ gameMessage.message }}</Text>
    </div>
</template>

<style>
.gameMessage {
    position: relative;
    top: -30px;
}

@keyframes showMessage {
    from {
        top: -30px
    }
    to {
        top: 0px
    }
}

@keyframes hideMessage {
    from {
        top: 0px
    }
    to {
        top: 30px
    }
}
</style>
