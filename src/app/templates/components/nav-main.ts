import { html } from 'lit-html'
import { send } from '../../lib/message'
import { NavLink } from './nav-link'

export const MainNav = options => {
  return html`
    <nav class="main-nav">
        <h1 class="logo">Accruly</h1>
        ${['admin', 'publisher', 'client'].includes(options.state.user.type) ? NavLink({ text: 'Analytics', target: 'analytics', isActive: options.path[0] === 'analytics' }) : ''}
        ${['admin', 'client', 'editor'].includes(options.state.user.type) ? NavLink({ text: 'Ads', target: 'ads/active', isActive: options.path[0] === 'ads' }) : ''}
        ${['admin'].includes(options.state.user.type) ? NavLink({ text: 'Answers', target: 'answers', isActive: options.path[0] === 'answers' }) : ''}
        ${['admin'].includes(options.state.user.type) ? NavLink({ text: 'Accounts', target: 'accounts/active', isActive: options.path[0] === 'accounts' }) : ''}
      </nav>
    `
}
