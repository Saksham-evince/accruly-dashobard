import { html } from 'lit-html'
import { send } from '../../lib/message'

export const Notification = options => html`
  <div class="notification">
    <p>${options.description}</p>
    <button class="notification-close" @click=${() => send('removeNotification')}>×</button>
  </div>

`
