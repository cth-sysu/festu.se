<template>
  <div class="list-item" @click="$router.push(editLink)">
    <div class="content">
      <span class="secondary">{{ party.date | date }}</span>
      <span>&nbsp;-&nbsp;{{ party.name }}</span>
    </div>
    <div class="action">
      <i v-if="isUpcoming" class="fas fa-globe-africa"></i>
      <i :class="cffcStyle" class="fas fa-camera"></i>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'EditPartyListItem',
  props: {
    party: Object
  },
  computed: {
    editLink() { return { name: 'kalas-edit', params: { id: this.party._id }}; },
    isUpcoming() { return moment(this.party.date).add(6, 'hours').isAfter(); },
    cffcStyle() { return { disabled: !this.party.cffc }; },
  },
  filters: {
    date: (date) => moment(date).format('YYYY-MM-DD'),
  },
}
</script>

<style scoped lang="scss">
.secondary {
  font-weight: bold;
}
</style>
