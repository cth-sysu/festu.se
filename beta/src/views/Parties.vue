<template>
  <div>
    <h2>Previous Kalas</h2>
    <div class="wall">
      <a v-for="party in parties" class="party" :href="party.cffc">
        <img :src="`/images/parties/${party._id}.jpg`">
        <div>{{ party.name }} {{ party.date | date }}</div>
      </a>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'parties',
  data() {
    return {
      parties: []
    };
  },
  async mounted () {
    const res = await fetch('/api/parties');
    this.parties = await res.json();
  },
  filters: {
    date: (date) => moment(date).format('YYYY'),
  },
}
</script>

<style scoped lang="scss">
.wall {
  display: flex;
  flex-wrap: wrap;
  padding: 3px;
}
.party {
  flex: 33%;
  min-width: 240px;
  margin: 3px;
  position: relative;
  & img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }
  & div {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 4px 8px;
    border-radius: 0 8px 0 8px;
    background: rgba(0, 0, 0, .5);
    color: white;
  }
}
</style>
