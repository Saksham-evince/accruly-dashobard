import { html } from 'lit-html'
import { send } from '../../lib/message'
import { NavLink } from '../components/nav-link'

export const Login = () => html`
  <section class="login-screen">
    <p>
      <label>
        <span>Email:</span>
        <input type="email" placeholder="example@mail.com" @input=${function () {
          send('newLogin', { field: 'email', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>Password:</span>
        <input type="password" placeholder="password" @input=${function () {
          send('newLogin', { field: 'password', value: this.value })
        }}>
      </label>
    </p>

    <p>
      ${NavLink({ text: 'Forgot your password?', target: 'recoverpassword' })}
    </p>

    <p class="-text-right">
      <button @click=${() => send('login')}>Log in</button>
    </p>
  </section>
`
