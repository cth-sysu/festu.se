<template>
  <div class="page">
    <div class="header">
      <router-link to="/kalas/new" tag="button">
        <i class="fas fa-plus"></i>
        <span>Kalas</span>
      </router-link>
    </div>
    <EditPartyListItem v-for="party in parties" :key="party._id" :party="party"/>
  </div>
</template>

<script>
import EditPartyListItem from '@/components/EditPartyListItem.vue';

export default {
  name: 'EditParties',
  components: {
    EditPartyListItem
  },
  data() {
    return { parties: [] };
  },
  async created() {
    const res = await fetch('/api/parties');
    this.parties = await res.json();
  },
}
</script>
