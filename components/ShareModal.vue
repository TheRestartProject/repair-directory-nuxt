<template>
  <b-modal
    id="shareModal"
    v-model="showModal"
    :title="$t('share') + ' ' + name"
    title-class="rd-primary-font"
    size="lg"
  >
    <template slot="default">
      <div class="buttons rd-primary-font">
        <div class="d-flex justify-content-between flex-wrap mt-3">
          <social-sharing
            :url="url"
            :title="'Sharing ' + name"
            hashtags="repair"
            inline-template
          >
            <network network="facebook">
              <b-btn
                variant="secondary"
                size="lg"
                class="facebook mt-1 mb-1 text-nowrap"
              >
                <v-icon name="brands/facebook" class="rd-icon-white" /> Facebook
              </b-btn>
            </network>
          </social-sharing>
          <social-sharing
            :url="url"
            :title="'Sharing ' + name"
            hashtags="repair"
            inline-template
          >
            <network network="twitter">
              <b-btn
                variant="secondary"
                size="lg"
                class="twitter mt-1 mb-1 text-nowrap"
              >
                <v-icon name="brands/twitter" class="rd-icon-white" /> Twitter
              </b-btn>
            </network>
          </social-sharing>
          <social-sharing
            :url="url"
            :title="'Sharing ' + name"
            hashtags="repair"
            inline-template
          >
            <network network="email">
              <b-btn
                variant="primary"
                size="lg"
                class="gmail mt-1 mb-1 text-nowrap"
              >
                <v-icon name="envelope" class="rd-icon-white" />
                {{ $t('email') }}
              </b-btn>
            </network>
          </social-sharing>
          <social-sharing
            :url="url"
            :title="'Sharing ' + name"
            hashtags="repair"
            inline-template
          >
            <network network="whatsapp">
              <b-btn
                variant="primary"
                size="lg"
                class="whatsapp mt-1 mb-1 text-nowrap"
              >
                <v-icon name="brands/whatsapp" class="rd-icon-white" /> Whatsapp
              </b-btn>
            </network>
          </social-sharing>
          <div ref="container">
            <b-btn
              variant="info"
              size="lg"
              class="mt-1 mb-1 text-nowrap"
              @click="doCopy"
            >
              <v-icon v-if="copied" name="check" class="rd-icon-white" />
              <v-icon v-else name="copy" class="rd-icon-white" />
              {{ $t('copy') }}
            </b-btn>
          </div>
        </div>
      </div>
    </template>
    <template slot="modal-footer">
      <b-button variant="secondary" @click="close">
        {{ $t('close') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      copied: false,
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    close() {
      this.showModal = false
    },
    async doCopy() {
      await this.$copyText(this.url, this.$refs.container)
      this.copied = true
    },
  },
}
</script>
<style scoped lang="scss">
@import 'assets/css/colours.scss';

::v-deep .facebook {
  background-color: $color-facebook !important;
  color: white;
}

::v-deep .twitter {
  background-color: $color-twitter !important;
  color: white;
}

::v-deep .whatsapp {
  background-color: $color-whatsapp !important;
}

::v-deep .gmail {
  background-color: $color-gmail !important;
}

::v-deep .buttons button {
  width: 145px;
}
</style>
