# Vegoons

*[Link to current deploy](https://vegoons.netlify.app/)*

## Concept

Vegoons is an imagination of the user flow of choosing something to eat. It's based on my personal considerations: I'm vegan and think there are too many steps and options in something like Yelp. Usually, whether I'm looking for a restaurant or a recipe, I choose something based on a cuisine-craving. I also don't care about restaurants that are closed.

Before any user input, the app detects a user's location and time to provide timely suggestions.

Then the UX flow is cut into three steps: 

1) The user chooses whether he's staying in or going out, 
2) he can choose from a list of cuisines (the ones I usually consider) or search for something,
3) then he's presented with a list of restaurants, with an additional list of recipes if he chose to stay in.

I chose the font and styles to be fun yet relaxed since I think eating shouldn't be too much of a formal affair; playfulness and informality reduce pressure and incentivize the user to choose something, or at least it does so for me. This is an important part of UX.

## Technical points

The initial challenges with this app were state management, using a css-in-js design library, then of course calling and displaying API data.

Before development, I researched several state management methods, including Redux. Based on its own suggestion to *not* use it for everything, I looked at React contexts before realzing simple prop passing would suffice. So the structure is simple: The app has a collection of user inputs which can be updated from each of the app's routes.

The app was originally to be created with Gatsby and make use of GraphQL data. To pick the tools needed for the specific task at hand, I realized a simple SPA and rest APIs would be more expedient. While Yelp has a beta endpoint for GraphQL as well as a Rest endpoint, Edamam only provides regular Rest APIs, so it was also be easier to take in all API data in Rest format. 

During development, an unexpected challenge was displaying list data. Formatting varying data, as well as incorporating page logic was unexpectedly buggy at first. My thought was to call 20 results at a time, then make another call every 2 pages (with 10 results per page). Doing this takes state management, chunking data into 10 item lists, and programming when to make a new API call.

The UI library used is Microsoft's experimental version of fluentUI, [@fluentui/react-northstar](https://github.com/microsoft/fluentui).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
