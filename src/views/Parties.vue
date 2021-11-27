<template>
  <div class="wall">
    <Party v-for="party in parties.filter(p => p.date < (new Date()).toISOString())" :key="party._id" :party="party"
        @show-poster="poster = party._id"/>
    <PosterModal v-if="poster" :poster="poster" @dismiss="poster = null"/>
  </div>
</template>

<script>
import Party from '@/components/Party.vue';
import PosterModal from '@/components/PosterModal.vue';

export default {
  name: 'parties',
  components: {
    Party,
    PosterModal
  },
  data() {
    return {
      parties: [],
      poster: null,
    };
  },
  async mounted () {
    const res = await fetch('/api/parties?cffc=true');
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
</style>
