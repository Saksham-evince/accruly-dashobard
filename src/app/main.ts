import { render } from 'lit-html'
import { template } from './template'
import { actions } from './actions'

/*

# General Introduction

The application is organized in two main components: actions and templates.

- The template contains the html that's going to be rendered.
- The actions are functions that update the state according to events. The first
action called 'init' is run once the app loads to generate the initial state.

The first thing that's defined is the state with the initial values in the init action.
Then that state is passed to the template function and finally rendered in the document.

Every action will listen for an event, such event can carry data that is then passed to the
matching action to produce a new state. Then that state is passed again to the template
function and rendered into the document.

*/

;(async () => {
  // The init action returns the initial state of the application
  // This will be updated every time
  let state: any = await actions.init()

  // Render the main template with the initial state
  render(template(state), document.body)

  // Actions handler
  // Here we take all the actions and attach an event to trigger
  // them. Once the action is performed it will return a new state,
  // that data is then merged to the current state and then
  // passed to the template function and rendered again
  for (const action in actions) {
    document.addEventListener(action, async (e) => {

      // Get the data from the action by passing the event data to it
      // The new state will be the same as the old state if the action
      // doesn't return anything
      state = await actions[action](e, state) || state

      // Reload state after successful login
      if (action === 'login' && state.latestNotification === '') {
        state = await actions.init()
      }

      console.log(state)

      // Render the template again
      render(template(state), document.body)
    })
  }
})()
