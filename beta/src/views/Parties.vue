<template>
  <div class="wall">
    <Party v-for="party in parties" :key="party._id" :party="party"
        @show-poster="poster = party._id"/>
    <transition name="slide-down">
      <div v-if="poster" class="poster" @click="poster = null">
        <img :src="`/images/parties/${poster}_small.jpg`" @error="error = true" v-if="!error">
        <h3 v-else>No poster available.</h3>
      </div>
    </transition>
  </div>
</template>

<script>
import Party from '@/components/Party.vue';
import moment from 'moment';

export default {
  name: 'parties',
  components: {
    Party
  },
  data() {
    return {
      parties: [],
      poster: null,
      error: false,
    };
  },
  async mounted () {
    const res = await fetch('/api/parties');
    this.parties = await res.json();
  },
}
</script>

<style scoped lang="scss">
.wall {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 3px;
}
.poster {
  color: white;
  position: fixed;
  max-height: calc(100vh - 80px);
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, .4);
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
