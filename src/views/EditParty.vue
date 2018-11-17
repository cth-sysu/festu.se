<template>
  <div class="page" v-if="loading">Loading...</div>
  <form class="page" v-else @submit.prevent="save">
    <div class="group">
      <input type="text" v-model="name" required>
      <label>Name</label>
    </div>
    <div class="group">
      <input type="datetime-local" v-model="date" required>
      <label>Date</label>
    </div>
    <div class="group">
      <input type="file" accept="image/*" ref="poster">
      <label>Poster</label>
    </div>
    <div class="group">
      <textarea v-model="description" rows="8"></textarea>
      <label>Description</label>
    </div>
    <template v-if="!isNew">
      <div class="group">
        <input type="text" v-model.lazy="cffc">
        <label>CFFC</label>
      </div>
      <div class="group">
        <input type="text" v-model="studio">
        <label>Studio</label>
      </div>
      <div class="group images" v-if="images.length">
        <span v-for="(image, index) in images" :key="index"
            :class="{ selected: index === selectedImage }"
            @click="selectedImage = index">
          <img :src="image"/>
        </span>
      </div>
    </template>
    <div class="buttons">
      <button type="button" class="delete" @click.prevent="deleteParty">
        <i class="far fa-lg fa-trash-alt"></i>
      </button>
      <router-link to="/kalas" tag="button" type="button">Cancel</router-link>
      <button type="submit" class="save">Save</button>
    </div>
  </form>
</template>

<script>
import moment from 'moment';

export default {
  name: 'EditParty',
  data() {
    return {
      loading: false,
      name: null,
      date: null,
      description: null,
      cffc: null,
      studio: null,
      images: [],
      selectedImage: -1,
    };
  },
  created() {
    this.getParty();
  },
  watch: {
    cffc: 'getImages'
  },
  computed: {
    id() { return this.$route.params.id; },
    isNew() { return this.id === 'new'; },
    image() {
      if (this.selectedImage < 0 || !this.images.length) {
        return null;
      }
      const thumbnail = this.images[this.selectedImage];
      return thumbnail.replace('small', 'big');
    }
  },
  methods: {
    async getParty() {
      if (this.isNew) {
        return;
      }
      this.loading = true;
      const res = await fetch(`/api/parties/${this.id}`);
      if (res.ok) {
        const { name, date, description, cffc, studio } = await res.json();
        this.name = name;
        this.date = moment(date).format('YYYY-MM-DD[T]HH:mm');
        this.description = description;
        this.cffc = cffc;
        this.studio = studio;
        this.loading = false;
      } else {
        this.$router.push('/kalas');
      }
    },
    async getImages() {
      this.images = [];
      this.selectedImage = -1;
      if (!this.cffc) {
        return;
      }
      const res = await fetch(`/api/cffc?url=${encodeURIComponent(this.cffc)}`);
      if (res.ok) {
        const { images } = await res.json();
        this.images = images;
      }
    },
    save() {
      this.savePoster();
      if (this.isNew) {
        this.saveInfo('POST', `/api/parties`);
      } else {
        this.saveInfo('PUT', `/api/parties/${this.id}`);
      }
    },
    async saveInfo(method, url) {
      const { name, date, description, cffc, studio, image } = this;
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ name, date, cffc, studio, description, image }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        this.$router.push('/kalas');
      }
    },
    async savePoster() {
      const { files } = this.$refs.poster;
      if (files.length === 0) {
        return;
      }
      const body = new FormData();
      body.append('poster', files[0]);
      await fetch(`/api/parties/${this.id}/poster`, { method: 'PUT', body });
    },
    async deleteParty() {
      const res = await fetch(`/api/parties/${this.id}`, { method: 'DELETE' });
      if (res.ok) {
        this.$router.push('/kalas');
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '../assets/edit-style.scss';
</style>
