<template>
  <v-app>
    <v-main class='primary pb-16'>
      <v-container fluid>
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
          <v-btn 
            color='accent' 
            depressed 
            x-large
            class='text-button'
          >
            Get Started
          </v-btn>
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
          <v-btn 
            color='accent' 
            depressed 
            x-large 
            class='my-16 text-button'
          >
            Get Started
          </v-btn>
          <v-img 
            src='./assets/poly-friends.svg' 
            lazy-src='./assets/poly-friends.svg' 
            max-width='573' 
            contain
          />
        </section>
        <section id='faq' 
          class='d-flex flex-column align-center'
        >
          <div class='text-h1 mb-13'>More about us</div>
          <v-expansion-panels mandatory flat tile>
            <v-expansion-panel
              v-for='faq in faqs'
              :key='faq.question'
            >
              <v-expansion-panel-header class='text-h2'>
                {{faq.question}}
              </v-expansion-panel-header>
              <v-expansion-panel-content class='text-body-1'>
                <template v-for='answer in faq.answers'>
                  <div :key='answer' class='faq-answer'>
                    <span class='faq-header'>
                      {{answer.header}}
                    </span> 
                    {{answer.content}}
                  </div>
                </template>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn 
            color='accent' 
            depressed 
            x-large 
            class='mt-10 text-button'
          >
            Get Started
          </v-btn>
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
        answers: {
          answer1: {header: "An assessment with a Polygon psychologist is appropriate for anyone age 8 or older."},
          answer2: {content: "As soon as you suspect a learning or attention difference, you should consider an assessment. Interventions are most successful when learning differences are diagnosed early in life. Still, an evaluation at any age can be an important step toward receiving proper support."}
        }
      },
      {
        question: "How does it work?",
        answers: {
          answer1: {
            header: '1',
            content: "In your complimentary consultation, a referral specialist will answer all your questions. If you’re a good fit for an assessment, we’ll get a full history and schedule your appointment."
          },
          answer2: {
            header: '2',
            content: "Meet your psychologist from the comfort of your home. Our licensed PhD/PsyD psychologists have years of experience and use widely-accepted, gold-standard assessment procedures."
          },
          answer3: {
            header: '3',
            content: "Your report — with an official diagnosis and tailored recommendations — is valid for eligibility determinations for an IEP, testing accommodations, and other services.",
          },
          answer4: {
            header: '4',
            content: "After your assessment, book ongoing appointments. Your psychologist can help with general support and, if needed, school IEP and learning plan advocacy sessions."
          }
        }
      },
      {
        question: "Why 'Polygon'?",
        answers: {
          answer1: {header: "The world is not designed for people with learning differences."},
          answer2: {content: "From schools to career paths, the prevailing systems have been built for the 'average' person — the perfect circle."},
          answer3: {content: "However, people with learning differences are anything but average. Often, they have distinct weaknesses paired with undeniable strengths. They may be the slowest reader in the classroom but also the quickest to grasp big-picture concepts. They are polygons in a world created for circles."},
          answer4: {content: "Polygon is on a mission to give every person with a learning difference the full range of tools they need to thrive — from diagnosis to support. We believe that by helping people discover their differences, they can harness their strengths."}
        }
      }
    ]
  }),
};
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

/**mission */
#mission {
  background-color: white;
  clip-path: polygon(0 0,100% 2%,100% 100%,0 98%);
}
#mission .text-body-1 {
  max-width: 30em;
}

/**about us */
.v-expansion-panels {
  max-width: 80em !important;
}
.v-expansion-panel:not(:first-child) {
  margin-top: 16px;
}
.faq-header {
  color: #3c3d49;
  font-weight: 700;
}
.faq-answer:not(:first-child) {
  margin-top: 16px
}
</style>