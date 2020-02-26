import { html } from 'lit-html'
import { send } from '../../lib/message'
import { AdPublisher } from '../components/ad-publisher'
import { AdBlock } from '../components/ad-block'
import { AdPreview } from '../components/ad-preview'

export const ActiveAds = options => {

  return html`
    <section class="main-section">
      <ul>
        ${options.state.ads.filter(x => x.status === 'active').map(ad => AdBlock({ad, state: options.state}))}
      </ul>
    </section>
  `
}

export const PausedAds = options => {

  return html`
    <section class="main-section">
      <ul>
        ${options.state.ads.filter(x => x.status === 'paused' || x.status === 'client paused').map(ad => AdBlock({ad, state: options.state}))}
      </ul>
    </section>
  `
}

export const CreateAd = options => {
  return html`
    <section class="main-section create-ad">

      <progress class="video-upload-progress" style="width: 100%" max="100" value="0"></progress>

      ${options.state.newAd.video !== '' ? AdPreview(options.state.newAd) : ''}

      ${AdPublisher(options.state.newAd)}

      <button @click=${() => send('createAd')}>Create Ad</button>
    </section>
  `
}
