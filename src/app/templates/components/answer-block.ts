import { html } from 'lit-html'
import { send } from '../../lib/message'

export const AnswerBlock = (answer, state) => {

  // Get all the metadata from the answer
  const metadata = (Object as any).entries(answer).map(entry => ({
    property: entry[0],
    value: entry[1]
  })).filter(entry => !['_id', '$loki', 'meta'].includes(entry.property))

  // Get the ad for this answer
  const ad = state.ads.find(ad => ad._id === answer.ad_id)

  const answerContent = ad && ['option' + answer.answer]

  return html`
    <li class="answer-block" @click=${() => send('getFullAnswer', {_id: answer._id})}>
      <p class=${answer.answer === ad.correctAnswer ? '-correct': '-incorrect'}>${ad.question} - ${answerContent}</p>

      <section class="answer-details" style="display: none" id=${'ID' + answer._id}>
        <ul>
          ${metadata.map(x => html`<li><strong>${x.property}</strong>: ${x.value}</li>`)}
        </ul>
      </section>
    </li>
  `
}



