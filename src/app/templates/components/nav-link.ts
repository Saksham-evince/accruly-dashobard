import { html } from 'lit-html'
import { send } from '../../lib/message'

// Template for navigation links
export const NavLink = options => html`
  <a @click=${() => send('changeLocation', {target: options.target})} class="${options.isActive ? '-active': ''}">${options.text}</a>
`
