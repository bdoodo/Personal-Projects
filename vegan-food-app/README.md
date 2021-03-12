# Vegoons

Version 0.2.0

*[Link to current staging deploy](https://staging--vegoons.netlify.app/)*

## Concept

Vegoons is an imagination of the user flow of choosing something to eat. It's based on my personal considerations: I'm vegan and think there are too many steps and options in something like Yelp. Usually, whether I'm looking for a restaurant or a recipe, I choose something based on a cuisine-craving. I also don't care about restaurants that are closed.

Before any user input, the app detects a user's location and time to provide timely suggestions.

Then the UX flow is cut into three steps: 

1) The user chooses whether he's staying in or going out, 
2) he can choose from a list of cuisines (the ones I usually consider) or search for something,
3) then he's presented with a list of restaurants, with an additional list of recipes if he chose to stay in.

I chose the font and styles to be fun yet relaxed since I think eating shouldn't be too much of a formal affair; playfulness and informality reduce pressure and incentivize the user to choose something, or at least it does so for me. This is an important part of UX.

## Technical points

To source data, I call a custom API that returns data from Yelp or Edamam (for recipes). The app is serverless and the custom API is built with netlify (serverless) functions, which runs on AWS. 

The UI library used is Microsoft's experimental version of fluentUI, [@fluentui/react-northstar](https://github.com/microsoft/fluentui).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).