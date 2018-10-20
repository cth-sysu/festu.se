<template>
  <div class="home">
    <div class="description">
      <h2>Festkommittén FestU</h2>
      <span>The FestU committee arranges huge parties in the Chalmers Student Union building. Valborgskalaset is the biggest one and counts as one of the biggest reccuring indoor parties in northen Europe.</span>
    </div>
    <div v-if="loading" class="placeholder card">
      <div class="loader"></div>
    </div>
    <NextParty v-else-if="party" :party="party"/>
    <div v-else class="placeholder card">Check back soon for the upcoming party</div>
  </div>
</template>

<script>
import NextParty from '@/components/NextParty.vue';

export default {
  name: 'home',
  components: {
    NextParty
  },
  data() {
    return {
      loading: true,
      party: null,
    };
  },
  async mounted () {
    const res = await fetch('/api/parties/next');
    this.party = await res.json();
    this.loading = false;
  },
}
</script>

<style scoped lang="scss">
.home {
  min-height: calc(100vh - 83px);
  box-sizing: border-box;
  background: url(../assets/home-background.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 8px;
}
.description {
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 24px;
  color: white;
  & h2 { margin: 8px 0; }
}
.next-party, .placeholder {
  margin: 0 auto;
}
</style>
