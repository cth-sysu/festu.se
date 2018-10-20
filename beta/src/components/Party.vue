<template>
  <transition name="fade">
    <a class="party" :href="party.cffc" v-show="!loading">
      <img :src="image" @load="done">
      <div>{{ party.name }} {{ party.date | date }}</div>
    </a>
  </transition>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Party',
  props: {
    party: Object
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    image() {
      return `/images/parties/${this.party._id}.jpg`;
    }
  },
  methods: {
    done() {
      this.loading = false;
    },
  },
  filters: {
    date: (date) => moment(date).format('YYYY'),
  },
}
</script>

<style scoped lang="scss">
.party {
  width: calc(100% / 3);
  position: relative;
  box-sizing: border-box;
  padding: 3px;
  & img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }
  & div {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 3px;
    padding: 4px 8px;
    border-radius: 0 8px 0 8px;
    background: rgba(0, 0, 0, .5);
    color: white;
  }
}
@media (max-width: 720px) {
  .party { width: 50%; }
}
@media (max-width: 480px) {
  .party { width: 100%; }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
