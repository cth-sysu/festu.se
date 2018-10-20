<template>
  <a class="party" :href="party.cffc">
    <img :src="`/images/parties/${party._id}.jpg`">
    <div>{{ party.name }} {{ party.date | date }}</div>
  </a>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Party',
  props: {
    party: Object
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
</style>
