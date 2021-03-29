<template>
  <v-card 
    tile 
    elevation='0' 
    class='pa-4'
    min-height='100%'
    max-width='60em'
  >
    <v-card-title class='text-h2 text-center mx-auto'>
      {{service.title}}
    </v-card-title>
    <v-card-text class='text-body-1 text-center'>
      {{service.body}}
    </v-card-text>
    <v-card-actions>
      <v-btn disabled block class='text-button'>
        Coming soon
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ServiceCard',
  props: {
    service: Object
  }
}
</script>

<style scoped>
.v-card__title {
  height: 116px; 
  align-items: start;
  max-width: 10em;
  justify-content: center;
}
.v-card div {
  word-break: normal;
}
@media screen and (max-width: 960px) {
  .v-card__title{
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>