// Global mixin so that every component can access the logged in state and user.
import Vue from 'vue'
import { REGION_LONDON, REGION_WALES } from '@/regions'

Vue.mixin({
  computed: {
    tagline() {
      let ret

      switch (this.region) {
        case REGION_WALES: {
          ret = this.$t('findBusinessWales')
          break
        }
        default: {
          ret = this.$t('findBusinessLondon')
        }
      }

      return ret
    },
    region() {
      return this.$store.getters['config/get']('region')
    },
    domain() {
      return this.$store.getters['config/get']('domain')
    },
    language() {
      return this.$store.getters['config/get']('language')
    },
  },
  methods: {
    async setConfig() {
      // Check if we've been passed some key info in URL parameters.  If so, record that in the store so that
      // it's accessible everywhere.
      //
      // This method is called by the fetch method in the page mixin, or manually if that's overriden.
      await this.$store.dispatch('config/set', {
        key: 'region',
        value: this.$route.query.rd_region || REGION_LONDON,
      })

      await this.$store.dispatch('config/set', {
        key: 'domain',
        value: this.$route.query.rd_parenturl || 'https://map.restarters.net',
      })

      if (this.$route.query.rd_language) {
        // Set the requested language.
        await this.$i18n.setLocale(this.$route.query.rd_language)
      }

      await this.$store.dispatch('config/set', {
        key: 'language',
        value: this.$route.query.rd_language || null,
      })
    },
    waitForRef(name, callback) {
      // When a component is conditional using a v-if, it sometimes takes more than one tick for it to appear.  So
      // we have a bit of a timer.
      if (this.$refs[name]) {
        callback.apply(this)
      } else {
        setTimeout(() => {
          this.waitForRef(name, callback)
        }, 100)
      }
    },
    trackOutboundLink(url) {
      this.$ga.event('outbound', 'click_' + this.region, url)
    },
    buildHead(title, description, image) {
      const meta = [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },

        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
      ]

      const retImage = image || require('~/static/logo.png')

      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: retImage,
      })

      meta.push({
        hid: 'og:url',
        property: 'og:url',
        content: process.env.USER_SITE + this.$route.fullPath,
      })

      meta.push({
        hid: 'twitter:image',
        property: 'twitter:image',
        content: retImage,
      })

      return {
        title,
        meta,
      }
    },
  },
})
