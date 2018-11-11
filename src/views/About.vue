<template>
  <div class="about">
    <div class="description">
      <h2>About FestU</h2>
      <p>The FestU committee arranges huge parties in the Chalmers Student Union building. Valborgskalaset is the biggest one and counts as one of the biggest reccuring indoor parties in northen Europe. The committee consists of <a href="http://6.festu.se">six</a> dedicated students who strive for bigger and better parties at Chalmers University. You can read more about them below!</p>
      <p>FestU parties usually have thousands of visitors. At the parties you are most likely to encounter live acts, a lot of funny <a href="http://66.festu.se">toys</a>, a jumping castle and a lot of <a href="http://bacchus.festu.se">bars</a> and dance floors!</p>
      <p>FestU parties demands a lot of hard work and time, which is why FestU needs a lot of help from other committees from around the campus. Any student who wants can also help out by "Puffing", which will also grant them a <a href="http://cash.festu.se">free</a> ticket to the party!</p>
    </div>
    <div class="contact">
      <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffestuchalmers&tabs&width=340&height=154&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=299455150478039" width="340" height="154" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
      <div>
        <p>
          Festkommittén FestU<br>
          Chalmers Studentkår<br>
          Teknologgården 2<br>
          412 58 Göteborg
        </p>
        <a href="mailto:festu@festu.se">festu@festu.se</a>
      </div>
    </div>
    <h2>FestU {{ year | format }}</h2>
    <div v-if="loading" class="loader"></div>
    <div class="members" v-show="!loading">
      <AboutMember v-for="member in members" :key="member._id"
          :member="member" @load="--loading"/>
    </div>
  </div>
</template>

<script>
import AboutMember from '@/components/AboutMember.vue';
import moment from 'moment';

export default {
  name: 'about',
  components: {
    AboutMember
  },
  data() {
    const now = new Date();
    return {
      year: now.getMonth() < 6 ? moment(now).subtract(1, 'year') : moment(now),
      members: [],
      loading: 1,
    };
  },
  async mounted() {
    const res = await fetch('/api/members/current');
    this.members = await res.json();
    this.loading = this.members.length;
  },
  filters: {
    format: (date) => moment(date).format('YY') + '/' + moment(date).add(1, 'year').format('YY'),
  },
}
</script>

<style scoped lang="scss">
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 8px;
  text-align: initial;
}
.description {
  & p { font-size: 14px; }
  & a, & a:hover {
    color: inherit;
    text-decoration: none;
    cursor: text;
  }
}
.contact {
  display: flex;
  flex-wrap: wrap;
  & iframe {
    margin-right: 16px;
    max-width: 100%;
  }
}
h2 {
  font-weight: normal;
  margin: 8px 0;
}
.members {
  display: flex;
  flex-wrap: wrap;
}
</style>
