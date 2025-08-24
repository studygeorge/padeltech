
<template>
  <!-- МОБИЛЬНАЯ ВЕРСИЯ -->
  <VideoBackgroundMobile 
    v-if="isMobile"
    :videoName="videoName"
    @video-ready="$emit('video-ready')"
  >
    <slot></slot>
  </VideoBackgroundMobile>
  
  <!-- ДЕСКТОПНАЯ ВЕРСИЯ -->
  <VideoBackgroundDesktop 
    v-else
    :videoName="videoName"
    @video-ready="$emit('video-ready')"
  >
    <slot></slot>
  </VideoBackgroundDesktop>
</template>

<script>
import { computed } from 'vue'
import { getLayoutType } from '@/utils/responsive'
import VideoBackgroundMobile from './VideoBackgroundMobile.vue'
import VideoBackgroundDesktop from './VideoBackgroundDesktop.vue'

export default {
  name: 'VideoBackground',
  components: {
    VideoBackgroundMobile,
    VideoBackgroundDesktop
  },
  props: {
    videoName: {
      type: String,
      required: true
    }
  },
  emits: ['video-ready'],
  setup() {
    const isMobile = computed(() => getLayoutType() === 'mobile')
    
    return {
      isMobile
    }
  }
}
</script>