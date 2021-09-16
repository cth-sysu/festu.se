<template>
  <transition name="fade">
    <div class="party" v-show="!loading" @click="show_links = !show_links">
      <img :src="image" @load="done">
      <transition name="flip">
        <div v-if="!show_links" key="name">{{ party.name }} {{ party.date | year }}</div>
        <div v-else class="links" key="links">
          <h3>{{ party.name }} {{ party.date | year }}</h3>
          <a :href="party.cffc">Photos</a>
          <a :href="party.studio" v-if="party.studio">Studio</a>
          <a @click="$emit('show-poster')">Poster</a>
        </div>
      </transition>
    </div>
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
      show_links: false,
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
    year: (date) => moment(date).format('YYYY'),
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
    object-fit: cover;
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
  & .links {
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    & a {
      padding: 8px 16px;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
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
.links.flip-enter-active, .links.flip-leave-active {
  transition: all .3s;
}
.links.flip-enter, .links.flip-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}

</style>
