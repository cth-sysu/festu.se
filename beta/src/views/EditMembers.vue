<template>
  <div class="page">
    <div class="header">
      <div>
        <router-link to="/orv/new" tag="button">
          <i class="fas fa-plus"></i>
          <span>Orv</span>
        </router-link>
      </div>
      <div>
        <input v-model.trim="filter.text" required>
        <label>Search</label>
      </div>
      <div>
        <select v-model="filter.post">
          <option value>All</option>
          <option v-for="post in posts" :value="post.symbol">{{ post.symbol }}</option>
        </select>
      </div>
      <div>
        <button @click="openMail">
          <i class="fas fa-envelope"></i>
          <span>Email</span>
        </button>
      </div>
    </div>
    <EditMemberListItem v-for="member in filteredMembers" :key="member._id" :member="member"/>
  </div>
</template>

<script>
import EditMemberListItem from '@/components/EditMemberListItem.vue';

export default {
  name: 'EditMembers',
  components: {
    EditMemberListItem
  },
  data() {
    return {
      members: [],
      posts: [],
      filter: { text: '', post: '' },
    };
  },
  computed: {
    filteredMembers() {
      return this.members.filter(member => !member.deceased && this.memberMatch(member));
    }
  },
  created() {
    this.getPosts();
    this.getMembers();
  },
  methods: {
    memberMatch({ name = '', mail = '', post: { symbol = '' } = {}}) {
      const { text, post } = this.filter;
      const nameMatch = name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      const mailMatch = mail.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      return (nameMatch || mailMatch) && (!post || symbol === post);
    },
    async getPosts() {
      const res = await fetch('/api/posts');
      this.posts = await res.json();
    },
    async getMembers() {
      const res = await fetch('/api/members');
      this.members = await res.json();
      this.members.sort((lhs, rhs) => {
        const score = member => member.year * 6 - (member.post ? ['6','66','$','‰','A','X'].indexOf(member.post.symbol) : 0);
        return score(rhs) - score(lhs);
      });
    },
    openMail() {
      const adresses = this.filteredMembers.filter(member => member.mail).map(member => member.mail);
      window.open(`mailto:?bcc=${adresses.join(',')}`, '_blank');
    }
  }
}
</script>
