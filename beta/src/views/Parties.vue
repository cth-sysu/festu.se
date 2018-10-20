<template>
  <div>
    <h2>Previous Kalas</h2>
    <div class="wall">
      <Party v-for="party in parties" :key="party._id" :party="party"/>
    </div>
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
      parties: []
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
  display: flex;
  flex-wrap: wrap;
  padding: 3px;
}
</style>
