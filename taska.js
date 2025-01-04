<template>
  <div v-if="loading" class="loader-big">
    <v-progress-circular indeterminate color="#503CC3" />
  </div>
  <div v-else>
    <div class="actions-header">
      <h1 class="actions-header_title">
        Акции
      </h1>
      <div>
        <span class="actions-header_option" :class="filter === 'active' && 'active'" @click="filter = 'active'">Действующие</span>
        <span> / </span>
        <span class="actions-header_option" :class="filter === 'upcoming' && 'active'" @click="filter = 'upcoming'">Анонс</span>
      </div>
    </div>
    <div ref="actions" class="actions" :style="{height: getHeight()}">
      <div v-for="action in ACTIONS[filter]" :key="action.id" class="actions_item" @click="goOnPage(action)">
        <v-img :src="action.imageUrl || require('@/assets/img/noImg.png')" alt="action" class="actions_img" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      filter: 'active'
    }
  },
  computed: {
    ...mapGetters({
      ACTIONS: 'Actions/STATE',
      GEO: 'GEO/STATE'
    })
  },
  created () {
    this.$eventBus.$on('change-city', (id) => {
      this.setValues(id)
    })
  },
  mounted () {
    this.setValues()
  },
  methods: {
    ...mapActions({
      GET_ALL: 'Actions/GET_ALL'
    }),
    async setValues (cityId) {
      this.loading = true
      await this.GET_ALL(cityId || this.$cookies.get('cityId'))
      this.loading = false
    },
    getHeight () {
      if (process.client) {
        const width = window.innerWidth
        if (width > 600) {
          const height = width * 0.40
          return height + 'px'
        }
      }
      return '100%'
    },
    goOnPage (data) {
      if (data.category) {
        this.$router.push(`/${this.GEO.activeShop.route}/collection/${this.$translit(data.category.name)}-${data.category.id}`)
      }
      if (data.product) {
        this.$router.push(`/product/${this.$translit(data.product.name)}-${data.product.id}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";

.actions_img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

@media (max-width: 600px) {
  .actions_img {
    height: 200px;
  }
}
</style>
