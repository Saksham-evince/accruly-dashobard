import { html } from 'lit-html'
import { send } from '../../lib/message'
import { NavLink } from './nav-link'

// Template for the secondary navigation
export const SubNav = options => {
  switch (options.path[0]) {
    case 'analytics':
      return html`
        <h1>Analytics</h1>
      `

    case 'ads':
      return html`
        <nav class="sub-nav">
          ${NavLink({ text: 'Active', target: 'ads/active', isActive: options.path[1] === 'active' })}
          ${NavLink({ text: 'Paused', target: 'ads/paused', isActive: options.path[1] === 'paused' })}
          ${NavLink({ text: 'Create', target: 'ads/create', isActive: options.path[1] === 'create' })}
        </nav>
      `

    case 'answers':
      return html`
        <h1>Answers</h1>
      `

    case 'accounts':
      return html`
        <nav class="sub-nav">
          ${NavLink({ text: 'Active', target: 'accounts/active', isActive: options.path[1] === 'active' })}
          ${NavLink({ text: 'Paused', target: 'accounts/paused', isActive: options.path[1] === 'paused' })}
          ${NavLink({ text: 'Create', target: 'accounts/create', isActive: options.path[1] === 'create' })}
        </nav>
      `
  }
}
