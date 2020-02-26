import { html } from 'lit-html'
import { send } from '../../lib/message'
import { AdEditor } from './ad-editor'
import { AdPreview } from './ad-preview'

export const AdBlock = options => html`
  <li class="ad-block">
    <p class="question">${options.ad.question}</p>
    <p class="-no-margin">
      <small class="ad-metadata">by <strong>Alan Hirsch</strong></small>
      <button class="button-plain -red" @click=${() => send('removeAd', {_id: options.ad._id})}>Remove</button>
      <button class="button-plain" @click=${() => {
        const editorContainer: any = document.querySelector('#id' + options.ad._id)
        editorContainer.style.display = 'block'
      }}>Edit</button>
    </p>

    <section class="ad-editor-container" id=${'id' + options.ad._id}>
      ${AdPreview(options.ad)}

      ${AdEditor(options.ad)}

      <button @click=${() => send('updateAd', {_id: options.ad._id})}>Update</button>

      ${options.ad.status === 'pending'
          ? html `<button @click=${() => send('publishAd', {_id: options.ad._id})}>Publish</button>`
          : html `<button @click=${() => send('unpublishAd', {_id: options.ad._id})}>Unpublish</button>`
      }

    </section>

  </li>
`
