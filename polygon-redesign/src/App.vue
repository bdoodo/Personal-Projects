<template>
  <v-app>
    <v-main class='primary pb-16'>
      <v-container fluid>
        <v-row id='nav'>
          <v-spacer/>
          <v-btn 
            icon 
            x-large 
            class='mt-4 mr-6' 
            @click='drawer= !drawer'
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-row>
        <v-navigation-drawer
          v-model='drawer'
          right
          temporary
          absolute
          hide-overlay
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
          <v-list
          nav
          dense
          >
            <v-list-item-group
              v-model="group"
              active-class="deep-purple--text text--accent-4"
            >
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
        <section id='intro' 
          class='d-flex flex-column align-center text-center'
        >
          <v-img src='./assets/super-poly.svg' max-width='350'/>
          <v-img src='./assets/logo.svg' max-width='200'/>
          <div class='text-h1 mt-16 mb-8' style='max-width: 15em'>
            Discover your difference, harness your strengths.
          </div>
          <div class='text-subtitle-1 mb-10'>
            Tele-assessments and support for learning differences.
          </div>
          <v-btn color='accent' depressed x-large>Get Started</v-btn>
        </section>
        <section id='servcies'>
          <div class='text-h1 mb-14'>Services</div>
          <v-row justify='center' no-gutters>
            <v-img src='./assets/curious-poly.svg' max-width='90' contain/>
            <v-col 
              v-for='service in services'
              :key='service.title' 
              :service='service'
            >
              <v-card tile elevation='0' width='30em' class='pa-4'>
                <v-card-title class='text-h2'>{{service.title}}</v-card-title>
                <v-card-text class='text-body-1'>{{service.body}}</v-card-text>
                <v-card-actions>
                  <v-btn disabled block>Coming soon</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </section>
        <section id='mission' 
          class='d-flex flex-column align-center text-center py-16 my-16'
        >
          <div class='text-h1 mb-10'>Our Mission</div>
          <div class='text-body-1' style='max-width: 30em'>
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
          <v-btn 
            color='accent' 
            depressed 
            x-large 
            max-width='126'
            class='my-16'
          >
          Get Started</v-btn>
          <v-img src='./assets/poly-friends.svg' max-width='573'/>
        </section>
        <section id='faq' class='d-flex flex-column align-center'>
          <div class='text-h1'>Frequently asked questions</div>
          <v-expansion-panels mandatory flat tile>
            <v-expansion-panel
              v-for='faq in faqs'
              :key='faq.question'
            >
              <v-expansion-panel-header class='text-h2'>{{faq.question}}</v-expansion-panel-header>
              <v-expansion-panel-content class='text-body-1'>{{faq.answer}}</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn color='accent' depressed x-large max-width='126'>Get Started</v-btn>
        </section>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //nav drawer
    drawer: false,
    group: null,

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
    ],

    //faq panels
    faqs: [
      {
        question: "Who's it for?",
        answerShort: "An assessment with a Polygon psychologist is appropriate for anyone age 8 or older."
      },
      {
        question: "How does it work?"
      },
      {
        question: "How have others liked it?"
      },
      {
        question: "Why 'Polygon'?"
      }
    ]
  }),
};
</script>

<style>
  /**text variables in src/scss/variables.scss */
  /**theme colors in vuetify.js */


  .v-card div {
    word-break: normal;
  }

  #mission {
    background-color: white;
    clip-path: polygon(0 0,100% 2%,100% 100%,0 98%);
  }
</style>