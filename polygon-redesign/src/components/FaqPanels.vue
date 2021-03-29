<template>
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
</template>

<script>
export default {
  name: 'FaqPanels',
  data: () => ({
    faqs: [
      //'headers' are shown in bold font, 'content' in regular. Each is optional for an answer
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
  })
}
</script>

<style scoped>
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