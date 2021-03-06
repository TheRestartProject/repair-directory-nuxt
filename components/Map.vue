<template>
  <GmapMap
    ref="map"
    :center="{ lat: center[0], lng: center[1] }"
    map-type-id="roadmap"
    style="width: 100%; height: 100vh"
    :zoom.sync="zoom"
    @idle="idle"
  >
    <MapBusiness
      v-for="business in businesses"
      :key="'marker-' + business.uid"
      :business="business"
      :selected="selected"
      :map="map"
      :region="region"
      @select="select(business)"
    />
  </GmapMap>
</template>
<script>
import MapBusiness from '@/components/MapBusiness'
import { gmapApi } from 'vue2-google-maps'
import { BOUNDS_LONDON, BOUNDS_WALES, REGION_WALES } from '@/regions'

export default {
  components: { MapBusiness },
  props: {
    businesses: {
      type: Array,
      required: true,
    },
    center: {
      type: Array,
      required: true,
    },
    selected: {
      type: Number,
      required: false,
      default: null,
    },
    location: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      map: null,
      zoom: null,
      showModal: false,
      osmtile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
      bounds: null,
      lastBusinessesFitted: null,
    }
  },
  computed: {
    google: gmapApi,
  },
  watch: {
    businesses: {
      immediate: true,
      handler(newVal) {
        this.fitMarkers(newVal)
      },
    },
  },
  methods: {
    idle() {
      console.log('Idle, fit markers')

      // We only want to fit the map to the markers if the businesses have changed since last time we did this.
      if (
        !this.lastBusinessesFitted ||
        JSON.stringify(this.businesses) !== this.lastBusinessesFitted
      ) {
        this.lastBusinessesFitted = JSON.stringify(this.businesses)
        this.fitMarkers(this.businesses)
      } else {
        console.log('No change to businesses')
      }
    },
    select(business) {
      this.$emit('selected', business.uid)
    },
    fitMarkers(businesses) {
      console.log('fitMarkers')
      if (this.$refs.map) {
        console.log('Got ref')
        this.map = this.$refs.map

        this.$refs.map.$mapPromise.then((map) => {
          console.log('Got promise')
          if (!businesses.length) {
            // Nothing to show.
            console.log('Nothing to show')
            if (this.location) {
              // ...but zoom to the location to at least indicate that we searched.
              console.log('Got location')
              this.zoom = 14
            } else {
              // ...and no location specified - show the whole region.
              console.log('No location')
              let bounds = null

              switch (this.region) {
                case REGION_WALES: {
                  bounds = BOUNDS_WALES
                  break
                }
                default: {
                  bounds = BOUNDS_LONDON
                  break
                }
              }

              const mapbounds = new this.google.maps.LatLngBounds()
              mapbounds.extend(
                new this.google.maps.LatLng(bounds.sw.lat, bounds.sw.lng)
              )
              mapbounds.extend(
                new this.google.maps.LatLng(bounds.ne.lat, bounds.ne.lng)
              )

              map.fitBounds(mapbounds)
            }
          } else {
            // Got some businesses.
            console.log('Got some businesses')
            const bounds = new this.google.maps.LatLngBounds()

            if (this.location && this.center) {
              // Ensure we show the location we searched on.
              bounds.extend(
                new this.google.maps.LatLng({
                  lat: this.center[0],
                  lng: this.center[1],
                })
              )
            }

            // Ensure we show all the businesses.
            businesses.forEach((b) => {
              bounds.extend(
                // eslint-disable-next-line new-cap
                new this.google.maps.LatLng(
                  b.geolocation.latitude,
                  b.geolocation.longitude
                )
              )
            })

            if (businesses.length === 1) {
              // Ensure we're not too zoomed in - set a decent zoom and centre.
              console.log('...only 1')
              this.$store.dispatch('businesses/setCenter', {
                lat: businesses[0].geolocation.latitude,
                lng: businesses[0].geolocation.longitude,
              })

              this.zoom = 14
            } else {
              // Pad the map so the markers will show if they're at the edge.
              console.log('...multiple', bounds.toString())
              map.fitBounds(bounds, {
                padding: [30, 30],
              })
            }
          }
        })
      }
    },
  },
}
</script>
