import { Text, mergeStyles, DefaultEffects } from '@fluentui/react'

const card = mergeStyles({
  boxShadow: DefaultEffects.elevation4,
  marginTop: 30
})

const Onboarding = ({hours}) => {
  return (
    <>
      <Text>Vegoons</Text>
      <h2>What's for {hours <= 11 ? 'breakfast'
        : hours <= 16 ? 'lunch' 
        : 'dinner'}?</h2>
      <div className={card}>
        <h1>hi</h1>
      </div>
    </>
  )
}

export default Onboarding