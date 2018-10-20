<template>
  <div class="next-party card">
    <div class="header">
      <div class="h3">{{ party.name }}</div>
      <div class="h4">{{ party.date | start }}-{{ party.date | end }}</div>
    </div>
    <div class="poster">
      <img :src="`/images/parties/${party._id}_small.jpg`">
    </div>
    <div class="description">{{ party.description }}</div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'NextParty',
  props: {
    party: Object
  },
  filters: {
    start: (date) => moment(date).format('MMMM D, YYYY HH:mm'),
    end: (date) => moment(date).add(6, 'hours').format('HH:mm')
  },
}
</script>

<style scoped lang="scss">
.next-party {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.header {
  flex: 100%;
  margin: 8px;
}
.poster {
  flex: 0 1 180px;
  margin: 8px;
  & img { width: 100%; }
}
.description {
  flex: 1 400px;
  margin: 8px;
  text-align: initial;
  white-space: pre-wrap;
  overflow: hidden;
}
</style>
