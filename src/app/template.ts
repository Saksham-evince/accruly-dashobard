import { html } from 'lit-html'
import { send } from './lib/message'

// Pages
import { ActiveAds, PausedAds, CreateAd } from './templates/pages/ads'
import { Analytics } from './templates/pages/analytics'
import { Answers } from './templates/pages/answers'
import { AccountSettings, ActiveAccounts, PausedAccounts, CreateAccount } from './templates/pages/accounts'
import { Login } from './templates/pages/login'
import { RecoverPassword } from './templates/pages/recoverpassword'

// UI Components
import { Notification } from './templates/components/notification'
import { SubNav } from './templates/components/nav-subnav'
import { MainNav } from './templates/components/nav-main'
import { NavLink } from './templates/components/nav-link'

export const template = state => {
  const currentPath = state.location.split('/')

  switch (currentPath[0]){
    case 'login':
      return html`
      ${state.latestNotification !== '' ? Notification({description: state.latestNotification}) : ''}

      ${Login()}`

    case 'recoverpassword':
      return html`
        ${state.latestNotification !== '' ? Notification({description: state.latestNotification}) : ''}

        ${RecoverPassword()}
      `

    default:
      return html`
        ${MainNav({path: currentPath, state})}

        <main class="main-content">
          <section class="user-menu">
            Welcome back, <strong>${state.user.name}</strong>.

            <nav class="user-options">
              ${NavLink({ text: 'Settings', target: 'settings', isActive: state.location === 'settings' })}
              <a @click=${() => send('logout')}>Log Out</a>
            </nav>
          </section>

          <container>
            ${state.latestNotification ? Notification({description: state.latestNotification}) : ''}

            ${SubNav({path: currentPath})}

            ${MainContent({path: currentPath, state})}
          </container>
        </main>
      `
  }
}

// Main content
const MainContent = options => {

  switch (options.path[0]) {
    case 'analytics':
      return Analytics(options)

    case 'ads':
      switch (options.path[1]) {
        case 'active':
          return ActiveAds(options)

        case 'paused':
          return PausedAds(options)

        case 'create':
          return CreateAd(options)
      }

    case 'answers':
      return Answers(options)

    case 'accounts':
      switch (options.path[1]) {
        case 'active':
          return ActiveAccounts(options)

        case 'paused':
          return PausedAccounts(options)

        case 'create':
          return CreateAccount(options)
      }

    case 'settings':
      return AccountSettings(options)
  }
}
