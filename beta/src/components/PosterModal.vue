<template>
  <transition name="slide-down">
    <div class="poster-modal" @click="$emit('dismiss')">
      <img :src="`/images/parties/${poster}_small.jpg`" @error="error = true" v-if="!error">
      <h3 v-else>No poster available.</h3>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PosterModal',
  props: {
    poster: String
  },
  data() {
    return {
      error: false,
    };
  },
}
</script>

<style scoped lang="scss">
.poster-modal {
  color: white;
  position: fixed;
  max-height: calc(100vh - 80px);
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, .4) 80%, transparent);
  padding: 8px;
  & img { max-height: 100%; }
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: all .2s;
}
.slide-down-enter, .slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
