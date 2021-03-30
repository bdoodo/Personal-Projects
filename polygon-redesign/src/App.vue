<template>
  <v-app>
    <v-main class='primary pb-16'>
      <v-container fluid>
        <nav-menu/>
        <section id='intro' 
          class='d-flex flex-column align-center text-center pb-6'
        >
          <v-img 
            src='./assets/super-poly.svg' 
            lazy-src='./assets/super-poly.svg' 
            max-width='350'
          />
          <v-img 
            src='./assets/logo.svg' 
            lazy-src='./assets/logo.svg' 
            max-width='200'
          />
          <div class='text-h1 mt-16 mb-8'>
            Discover your difference, harness your strengths.
          </div>
          <div class='text-subtitle-1 mb-10'>
            Tele-assessments and support for learning differences.
          </div>
          <get-started-btn/>
        </section>
        <section id='services' class='mt-14'>
          <div class='mx-auto'>
            <v-row justify='center' class='flex-column flex-md-row'>
              <v-img id='curious-poly'
                src='./assets/curious-poly.svg' 
                lazy-src='./assets/curious-poly.svg'
                class='d-none d-lg-block'
              />
              <v-col 
                v-for='service in services'
                :key='service.title' 
                :service='service' 
              >
                <service-card :service='service'/>
              </v-col>
            </v-row>
          </div>
        </section>
        <section id='mission' 
          class='d-flex flex-column align-center text-center py-16 my-16'
        >
          <div class='text-h1 mb-10'>Our Mission</div>
          <div class='text-body-1'>
            At Polygon, our aim is to change both the 
            outcomes and the perceptions of people with 
            learning differences. We think shapes are 
            a great way to think about these conditions 
            — rewriting the narrative to focus on 
            differences, not disabilities. After all, 
            no one sees a square as inferior to a 
            circle while recognizing they have distinct 
            characteristics.
          </div>
          <get-started-btn class='my-16'/>
          <v-img 
            src='./assets/poly-friends.svg' 
            lazy-src='./assets/poly-friends.svg' 
            max-width='100%' 
          />
        </section>
        <section id='faq' 
          class='d-flex flex-column align-center'
        >
          <div class='text-h1 mb-13'>More about us</div>
          <faq-panels :faqs='faqs'/>
          <get-started-btn class='mt-10'/>
        </section>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import serviceCard from './components/ServiceCard.vue'
import getStartedBtn from './components/GetStartedBtn.vue'
import faqPanels from './components/FaqPanels.vue';
import navMenu from './components/NavMenu.vue'

export default {
  name: 'App',

  components: {
    'service-card': serviceCard,
    'get-started-btn': getStartedBtn,
    'faq-panels': faqPanels,
    'nav-menu': navMenu,
  },

  data: () => ({
    //service cards
    services: [
      {
        title: 'Learning Differences Assessment',
        body: 'Comprehensive assessment for dyslexia, dyscalculia, and other learning differences in reading, math, and writing.'
      },
      {
        title: 'Attention differences Assessment',
        body: 'Comprehensive assessment for ADHD. Available as an add-on to a specific learning differences assessment.'
      },
      {
        title: 'Follow-up Support',
        body: 'Ongoing support appointments with your psychologist. Available as an assessment add-on.'
      }
    ]
  })
}
</script>

<style>
/**text variables in src/scss/variables.scss */
/**theme colors in vuetify.js */

/**intro */
#intro .text-h1 {
  max-width: 15em;
}
@media screen and (max-width: 600px) {
  #intro .text-h1 {
    font-size: 4.2em !important;
  }
}

/**services */
#services {
  position: relative;
}
#services > div {
  max-width: 90em; 
  width: fit-content;
}
#curious-poly {
  position: absolute; 
  left: 10%; 
  bottom: 0;
}

/**mission */
#mission {
  background-color: white;
  clip-path: polygon(0 0,100% 2%,100% 100%,0 98%);
}
#mission .text-body-1 {
  max-width: 30em;
}
</style>