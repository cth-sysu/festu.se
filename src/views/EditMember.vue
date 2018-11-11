<template>
  <div class="page" v-if="loading">Loading...</div>
  <form class="page" v-else @submit.prevent="save">
    <div class="row">
      <div class="group flex">
        <input type="text" v-model="name" required>
        <label>Name</label>
      </div>
      <div class="group">
        <select v-model="post">
          <option v-for="post in posts" :key="post._id" :value="post._id">{{ post.symbol }}</option>
        </select>
      </div>
      <div class="group">
        <input type="number" v-model="year" required>
      </div>
    </div>
    <div class="row">
      <div class="group flex">
        <input type="tel" v-model="phone" required>
        <label>Phone</label>
      </div>
      <div class="group flex email">
        <input type="email" v-model="email" required>
        <label>Email</label>
      </div>
    </div>
    <div class="group">
      <textarea v-model="adress" rows="4"></textarea>
      <label>Adress</label>
    </div>
    <div class="row">
      <div class="group flex">
        <input type="tel" v-model="programme.name" required>
        <label>Programme</label>
      </div>
      <div class="group">
        <input type="number" v-model="programme.year" required>
        <label>Year</label>
      </div>
    </div>
    <div class="group">
      <input type="file" accept="image/*" ref="image">
      <label>Image</label>
    </div>
    <div class="buttons">
      <button v-if="!deceased && !isNew" type="button" class="deceased"
          @click.prevent="markDeceased">
        Deceased
      </button>
      <!-- <button type="button" class="delete" @click.prevent="deleteMember">
        <i class="far fa-lg fa-trash-alt"></i>
      </button> -->
      <router-link to="/orv" tag="button" type="button">Cancel</router-link>
      <button type="submit" class="save">Save</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'EditMember',
  data() {
    return {
      loading: false,
      posts: [],
      name: null,
      post: null,
      year: new Date().getFullYear(),
      phone: null,
      email: null,
      adress: null,
      programme: {},
      deceased: false,
    };
  },
  created() {
    this.getPosts();
    this.getMember();
  },
  computed: {
    id() { return this.$route.params.id; },
    isNew() { return this.id === 'new'; },
  },
  methods: {
    async getPosts() {
      const res = await fetch('/api/posts');
      this.posts = await res.json();
      if (!this.post) {
        this.post = this.posts[0]._id;
      }
    },
    async getMember() {
      if (this.isNew) {
        return;
      }
      this.loading = true;
      const res = await fetch(`/api/members/${this.id}`);
      if (res.ok) {
        const member = await res.json();
        const { name, post, year, phone, adress, mail, programme, deceased } = member;
        this.name = name;
        this.post = post;
        this.year = year;
        this.phone = phone;
        this.email = mail;
        this.adress = adress;
        this.programme = programme;
        this.deceased = deceased;
        this.loading = false;
      } else {
        this.$router.push('/orv');
      }
    },
    save() {
      this.saveImage();
      if (this.isNew) {
        this.saveInfo('POST', `/api/members`);
      } else {
        this.saveInfo('PUT', `/api/members/${this.id}`);
      }
    },
    markDeceased() {
      this.deceased = true;
      this.saveInfo('PUT', `/api/members/${this.id}`);
    },
    async saveInfo(method, url) {
      const { name, post, year, phone, adress, email: mail, programme, deceased } = this;
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ name, post, year, phone, adress, mail, programme, deceased }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        this.$router.push('/orv');
      }
    },
    async saveImage() {
      const { files } = this.$refs.image;
      if (files.length === 0) {
        return;
      }
      const body = new FormData();
      body.append('image', files[0]);
      await fetch(`/api/members/${this.id}/image`, { method: 'PUT', body });
    },
    async deleteMember() {
      const res = await fetch(`/api/members/${this.id}`, { method: 'DELETE' });
      if (res.ok) {
        this.$router.push('/orv');
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '../assets/edit-style.scss';
</style>
