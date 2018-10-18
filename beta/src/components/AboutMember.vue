<template>
  <div class="about-member">
    <div class="post">
      <div class="image">
        <img :src="image">
        <div class="avatar" @click="poke(member.post.symbol)">{{ member.post.symbol }}</div>
      </div>
      <div>{{ member.post.name }}</div>
      <div><a :href="`mailto:${ member.post.mail }`">{{ member.post.mail }}</a></div>
    </div>
    <div class="header">
      <div class="h4">{{ member.name }}</div>
      <div class="h5">{{ programme }}</div>
      <p>{{ member.post.description }}</p>
      <p>{{ member.description }}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'AboutMember',
  props: {
    member: Object
  },
  data() {
    return { pokes: 0 };
  },
  computed: {
    image() {
      return this.member.has_image ? `/images/members/${this.member._id}.jpg`
                                   : `/images/members/fallback.png`;
    },
    programme() {
      const { name, year } = this.member.programme;
      return `${name}${year.toString().substr(-2)}`;
    },
  },
  methods: {
    poke(member) {
      if (++this.pokes === 3) {
        const post = this.member.post.symbol.toLowerCase();
        window.location.href = `http://${post}.festu.se`;
      }
    }
  },
}
</script>

<style scoped lang="scss">
.about-member {
  display: flex;
  max-width: 400px;
}
.post {
  flex: 1 120px;
  padding: 8px;
  text-align: center;
  font-size: 14px;
}
.image {
  position: relative;
  & img { width: 100%; }
}
.avatar {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  background-color: rgba(128, 0, 0, 0.8);
  border-radius: 50%;
  font-size: 24px;
  color: white;
  text-align: center;
}
.header {
  flex: 2;
  padding: 8px;
  font-size: 14px;
}
</style>
