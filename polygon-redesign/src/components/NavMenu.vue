<template>
  <div>
    <v-row id='menu'>
      <v-spacer/>
      <v-btn 
        aria-label='navigation menu'
        icon 
        x-large 
        class='mt-4 mr-6' 
        @click='drawer= !drawer'
        tabindex='0'
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-row>
    <v-navigation-drawer
      v-model='drawer'
      right
      temporary
      fixed
      hide-overlay
      bottom
      class='elevation-0'
    >
      <v-btn 
        @click='drawer = false' 
        depressed
        icon
        class='float-right mr-4 mt-4'
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-list nav class='mt-16 text-right'>
        <v-list-item
          v-for="item in navItems"
          :key="item"
          :href='item.tag'
        >
          <v-list-item-content>
            <v-list-item-title class='text-h2'>
              {{item.title}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
  data: () => ({
    drawer: false,
    group: null,
    
    //menu items
    navItems: [
      {
        title: 'Services',
        tag: '#services'
      },
      {
        title: 'Mission',
        tag: '#mission'
      },
      {
        title: 'More about us',
        tag: '#faq'
      }
    ],
  })
}
</script>

<style>

</style>