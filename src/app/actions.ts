import axios from 'axios'

// @ts-ignore
const apiURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000/'
  : 'http://51.15.131.96:30627/'

const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

// When we receive a 'someMsg' message we take the data of the message and the state
// Then we return a new state after doing some computations
export const actions = {
  'init': async () => {
    const currentUser = await (async () => {
      try {
        return (await axios({
          method: 'get',
          url: apiURL + 'user/login',
          withCredentials: true
        })).data
      } catch (e) {
        console.error('There is an error when trying to log in')

        return {
          session: '',
          type: '',
          _id: ''
        }
      }
    })()

    const isSessionActive = currentUser.session !== ''

    // Get the ads if the user has the credentials
    const ads = isSessionActive && ['admin'].includes(currentUser.type)
      ? (await axios({
        method: 'get',
        url: apiURL + 'ad/all',
        withCredentials: true
      })).data
      : []

    // Get the answer data if the user has the credentials
    const answers = isSessionActive && ['admin'].includes(currentUser.type)
      ? (await axios({
        method: 'get',
        url: apiURL + 'answer',
        withCredentials: true
      })).data
      : []

    const accounts = isSessionActive && ['admin'].includes(currentUser.type)
      ? (await axios({
        method: 'get',
        url: apiURL + 'user',
        withCredentials: true
      })).data
      : []

    return {
      latestNotification: '',
      location: isSessionActive ? 'ads/active' : 'login',
      user: currentUser,
      newLogin: {
        email: '',
        password: ''
      },
      ads,
      answers,
      accounts,
      newAccount: {
        email: '',
        password: '',
        name: '',
        type: 'admin',
        status: 'active',
        timezone: '',
        exclusiveTo: ''
      },
      updateAccount: {},
      newAd: {
        question: 'Write your question here',
        video: '',
        minWidth: '',
        minHeight: '',
        banner: '',
        logo: '',
        startsAt: 5,
        canSkip: false,
        type: 'multiple',
        options: [

        ],
        correctAnswer: 1
      },
      updateAd: {}
    }
  },

  // Here we include all the other action names
  'changeLocation': (msg, state) => {
    const newLocation = msg.detail.target

    // Hide all ad editors
    document.querySelectorAll('.ad-editor-container').forEach(ad => {
      ;(ad as any).style.display = 'none'
    })

    // Merge the data with the state and return it
    return {
      ...state,
      location: newLocation
    }
  },

  // Update the new add state with the new data
  'newAdField': (msg, state) => {
    state.newAd[msg.detail.field] = msg.detail.value

    return state
  },

  'newAdFieldOption': (msg, state) => {
    state.newAd.options[msg.detail.field] = msg.detail.value

    return state
  },

  // Update the new add state with the new data
  'updateAdField': (msg, state) => ({
    ...state,
    updateAd: {
      ...state.updateAd,
      ...msg.detail
    }
  }),

  'createAd': async (msg, state) => {
    // Send the data to the API
    const response = (await axios({
      method: 'post',
      url: apiURL + 'ad',
      data: state.newAd,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    // Add the new ad to the state
    state.ads.unshift(response)

    // Send a notification about the added ad
    state.latestNotification = 'The ad was published'

    // Change page
    state.location = 'ads/paused'

    // Reset all the newAd fields
    state.newAd = {
      question: 'Write your question here',
      video: '',
      minWidth: '',
      minHeight: '',
      banner: '',
      logo: '',
      startsAt: 5,
      canSkip: false,
      option1: 'Option 1',
      option2: 'Option 2',
      option3: 'Option 3',
      option4: 'Option 4',
      correctAnswer: 1
    }

    // Update state
    return state
  },

  'removeNotification': (msg, state) => {
    state.latestNotification = false

    return state
  },

  'removeAd': async (msg, state) => {
    ;(await axios({
      method: 'delete',
      url: apiURL + 'ad',
      params: {
        _id: msg.detail._id
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    const newState = {
      ...state,
      ads: state.ads.filter(ad => msg.detail._id !== ad._id),
      latestNotification: 'The ad was removed'
    }

    return newState
  },

  'updateAd': async (msg, state) => {

    // Send the data to the API
    const updated = (await axios({
      method: 'put',
      url: apiURL + 'ad',
      params: {
        _id: msg.detail._id
      },
      data: state.updateAd,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    // Send a notification about the updated ad
    state.latestNotification = 'The ad was updated'

    // Add the update to the list of ads in the state
    const indexOfUpdate = state.ads.findIndex(ad => ad._id === msg.detail._id)
    state.ads[indexOfUpdate] = updated

    // Hide the editor
    ;(document.querySelector('#id' + msg.detail._id) as any).style.display = 'none'

    // Restore the defaults of the update ad state
    state.updateAd = {}

    return state
  },

  'publishAd': async (msg, state) => {
    // Send the data to the API
    (await axios({
      method: 'put',
      url: apiURL + 'ad',
      params: {
        _id: msg.detail._id
      },
      data: {
        status: 'active'
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    const publishedAd = state.ads.findIndex(ad => ad._id === msg.detail._id)
    state.ads[publishedAd].status = 'active'
    state.location = 'ads/active'

    // Send a notification about the published ad
    state.latestNotification = 'The ad was published'

    ;(document.querySelector('#id' + msg.detail._id) as any).style.display = 'none'

    return state
  },

  'unpublishAd': async (msg, state) => {
    // Send the data to the API
    (await axios({
      method: 'put',
      url: apiURL + 'ad',
      params: {
        _id: msg.detail._id
      },
      data: {
        status: 'paused'
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    const publishedAd = state.ads.findIndex(ad => ad._id === msg.detail._id)
    state.ads[publishedAd].status = 'paused'
    state.location = 'ads/paused'

    // Send a notification about the published ad
    state.latestNotification = 'The ad was unpublished'

    ;(document.querySelector('#id' + msg.detail._id) as any).style.display = 'none'

    return state
  },

  'getFullAnswer': (msg, state) => {

    const answerDetails: any = document.querySelector('#ID' + msg.detail._id)

    if (answerDetails.style.display === 'none') {
      answerDetails.style.display = 'block'
    } else {
      answerDetails.style.display = 'none'
    }

    return state
  },

  'uploadNewAdFile': async (msg, state) => {
    // Upload file and get the URL
    const filename = (await axios({
      url: apiURL + 'file',
      method: 'POST',
      data: msg.detail.content,
      onUploadProgress: p => {
        (document.querySelector('.video-upload-progress') as any).value = (p.loaded / p.total) * 100
      },
      withCredentials: true
    })).data

    // Put the URL in the state
    state.newAd[msg.detail.name] = apiURL + 'file?file=' + filename

    return state
  },

  uploadUpdateAdFile: async (msg, state) => {
    // Upload file and get the URL
    const filename = await (await fetch(apiURL + 'fileupload', {
      method: 'POST',
      body: msg.detail.content
    })).json()

    // Put the URL in the state
    state.updateAd[msg.detail.name] = apiURL + 'getfile?file=' + filename

    return state
  },

  newLogin: (msg, state) => {
    state.newLogin[msg.detail.field] = msg.detail.value

    return state
  },

  login: async (msg, state) => {

    try {
      (await axios({
        method: 'POST',
        url: apiURL + 'user/login',
        data: {
          email: state.newLogin.email,
          password: state.newLogin.password
        },
        headers: {
          'content-type': 'application/json'
        },
        withCredentials: true
      }))

      state.location = 'ads/active'
      state.latestNotification = ''
      state.newLogin = {
        email: '',
        password: ''
      }

    } catch (e) {
      if (e.response.status === 401) {
        state.latestNotification = 'The email or password is incorrect'
      } else {
        state.latestNotification = 'Unknown server error'
      }
    }

    return state
  },

  'removeAccount': async (msg, state) => {
    ;(await axios({
      method: 'delete',
      url: apiURL + 'user',
      params: {
        _id: msg.detail._id
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    const newState = {
      ...state,
      accounts: state.accounts.filter(account => msg.detail._id !== account._id),
      latestNotification: 'The account was removed'
    }

    return newState
  },

  updateAccountField: (msg, state) => {
    state.updateAccount[msg.detail.name] = msg.detail.value

    return state
  },

  newAccountField: (msg, state) => {
    state.newAccount[msg.detail.name] = msg.detail.value

    if (msg.detail.name === 'password') {
      if (!strongPassword.test(msg.detail.value)) {
        state.latestNotification = 'Password not strong enough'

        ;(document.querySelector('#createaccountbutton') as any).style.display = 'none'
      } else {
        state.latestNotification = ''
        ;(document.querySelector('#createaccountbutton') as any).style.display = 'block'
      }
    }

    return state
  },

  createAccount: async (msg, state) => {
    // Send the data to the API
    const response = (await axios({
      method: 'post',
      url: apiURL + 'user',
      data: state.newAccount,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    console.log(response)

    // Add the new ad to the state
    state.accounts.unshift(response)

    // Send a notification about the added ad
    state.latestNotification = 'The user account was created'

    // Change page
    state.location = 'accounts/active'

    console.log(state)

    // Reset all the newAd fields
    state.newAccount = {
      email: '',
      password: '',
      name: '',
      type: 'admin',
      status: 'active',
      timezone: '',
      exclusiveTo: ''
    }

    // Update state
    return state
  },

  updateAccount: async (msg, state) => {
    // Send the data to the API
    const updated = (await axios({
      method: 'put',
      url: apiURL + 'user',
      params: {
        _id: msg.detail._id
      },
      data: state.updateAccount,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    // Send a notification about the updated ad
    state.latestNotification = 'The account was updated'

    // Add the update to the list of ads in the state
    const indexOfUpdate = state.accounts.findIndex(account => account._id === msg.detail._id)
    state.accounts[indexOfUpdate] = updated

    // Hide the editor if not editing oneself data
    if (state.location !== 'settings') {
      ;(document.querySelector('#id' + msg.detail._id) as any).style.display = 'none'
    }

    // Restore the defaults of the update ad state
    state.updateAccount = {}

    return state
  },

  'logout': async(msg, state) => {

    try {
      await axios({
        method: 'delete',
        url: apiURL + 'user/logout',
        withCredentials: true
      })

      state.location = 'login'
      state.latestNotification = ''
    } catch (e) {
      state.latestNotification = 'Error trying to log out'
    }

    return state
  },

  activateAccount: async (msg, state) => {
    // Send the data to the API
    (await axios({
      method: 'put',
      url: apiURL + 'user',
      params: {
        _id: msg.detail._id
      },
      data: {
        status: 'active'
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    const activatedAccount = state.accounts.findIndex(account => account._id === msg.detail._id)
    state.accounts[activatedAccount].status = 'active'
    state.location = 'accounts/active'

    // Send a notification about the published ad
    state.latestNotification = 'The account was activated'

    ;(document.querySelector('#id' + msg.detail._id) as any).style.display = 'none'

    return state
  },

  deactivateAccount: async (msg, state) => {
    // Send the data to the API
    (await axios({
      method: 'put',
      url: apiURL + 'user',
      params: {
        _id: msg.detail._id
      },
      data: {
        status: 'paused'
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })).data

    const deactivatedAccount = state.accounts.findIndex(account => account._id === msg.detail._id)
    state.accounts[deactivatedAccount].status = 'paused'
    state.location = 'accounts/paused'

    ;(await axios({
      method: 'put',
      url: apiURL + 'ad',
      params: {
        client_id: state.msg.detail._id
      },
      data: {
        status: 'client paused'
      },
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    }))

    // Send a notification about the published ad
    state.latestNotification = 'The account was paused'

    ;(document.querySelector('#id' + msg.detail._id) as any).style.display = 'none'

    return state
  },

  'recoverpassword': (msg, state) => {
    // Send the password to the email in the field
    try {
      axios({
        method: 'post',
        url: apiURL + 'recovery',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          email: state.newLogin.email
        }
      })

      state.latestNotification = 'Account recovery link was sent to ' + state.newLogin.email
    } catch (e) {
      state.latestNotification = 'There was an error trying to recover this account.'
    }

    return state
  }
}
