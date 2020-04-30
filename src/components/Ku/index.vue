<template>
  <div>
    <svg-icon icon-class="download" @click="handleDownload"/>
  </div>
</template>

<script>
export default {
  name: 'Ku',
  data() {
    return {
      url: ''
    }
  },
  methods: {
    handleDownload() {
      window.open(this.url)
    }
  }
}
</script>