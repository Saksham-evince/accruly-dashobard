import { html } from 'lit-html'
import { send } from '../../lib/message'

export const RecoverPassword = () => html`
  <section class="login-screen">
    <p>
      <label>
        <span>Email:</span>
        <input type="email" placeholder="example@mail.com" @input=${function () {
          send('newLogin', { field: 'email', value: this.value })
        }}>
      </label>
    </p>

    <p class="-text-right">
      <button @click=${() => send('recoverpassword')}>Recover Password</button>
    </p>
  </section>
`
