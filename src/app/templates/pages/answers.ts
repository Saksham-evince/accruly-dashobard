import { AnswerBlock } from '../components/answer-block'
import { html } from 'lit-html'
import { send } from '../../lib/message'

export const Answers = options => {

  return html`
    <section class="main-section">
      <ul>
        ${options.state.answers.map(answer => AnswerBlock(answer, options.state))}
      </ul>
    </section>
  `
}
