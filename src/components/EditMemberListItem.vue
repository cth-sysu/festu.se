<template>
  <div class="list-item" @click="$router.push(editLink)">
    <div class="content">
      <span class="post">{{ member.post ? member.post.symbol : '?' }}</span>
      <div>
        <div>{{ member.name }}</div>
        <div class="secondary">{{ member.adress }}</div>
      </div>
    </div>
    <div class="action">{{ member.year | year }}</div>
  </div>
</template>

<script>
export default {
  name: 'EditMemberListItem',
  props: {
    member: Object
  },
  computed: {
    editLink() { return { name: 'orv-edit', params: { id: this.member._id }}; },
  },
  filters: {
    year: (year) => `${year.toString().substr(-2)}/${(year + 1).toString().substr(-2)}`,
    x({ year, post}) {
      if (post) {
        const now = new Date();
        return 'x'.repeat(now.getFullYear() - new Date(year, 0, 1).getFullYear() - (now.getMonth() < 7)) + post.symbol;
      }
    },
  },
}
</script>

<style scoped lang="scss">
.post {
  width: 32px;
  height: 32px;
  margin-right: 8px;
  line-height: 32px;
  font-size: 18px;
  text-align: center;
  color: white;
  background: gray;
  border-radius: 100%;
  user-select: none;
}
</style>
