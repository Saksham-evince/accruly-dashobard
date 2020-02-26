import { html } from 'lit-html'
import { send } from '../../lib/message'

export const AdEditor = ad => {
  return html`
    <form>
      <grid>
        <column size="6">
          <p>
            <label>Select a video:
              <input type="file" required @change=${function () {
                send('uploadUpdateAdFile', { name: 'video', content: this.files[0] })
              }}>
            </label>
          </p>
          <p>
            <label>Banner:
              <input type="file" required @change=${function (){
                send('uploadUpdateAdFile', { name: 'banner', content: this.files[0] })
              }}>
            </label>
          </p>
          <p>
            <label>Starts at (seconds):
              <input type="text" value=${ad.startsAt} required @input=${function () {
                send('updateAdField', { startsAt: this.value })
              }}>
            </label>
          </p>
        </column>
        <column size="6">
          <p>
            <label>Logo:
              <input type="file" required @change=${function () {
                send('uploadUpdateAdFile', { name: 'logo', content: this.files[0] })
              }}>
            </label>
          </p>
          <p>
            <label>Minimum Width:
              <input type="text" value=${ad.minWidth} required @input=${function () {
                send('updateAdField', { minWidth: this.value})
              }}>
            </label>
          </p>
          <p>
            <label>Minimum Height:
              <input type="text" value=${ad.minHeight} required @input=${function () {
                send('updateAdField', { minHeight: this.value })
              }}>
            </label>
          </p>
          <p>
            <label>
              <input type="checkbox" ?checked=${ad.canSkip} @click=${function () {
                send('updateAdField', { canSkip: this.checked })
              }}> <span>Can be skipped</span>
            </label>
          </p>
        </column>
      </grid>
      <p>
        <label>Question:
          <input type="text" value=${ad.question} required @input=${function () {
            send('updateAdField', { question: this.value })
          }}>
        </label>
      </p>
      <fieldset>
        <p>
          <label>Option #1
            <input type="text" value=${ad.option1} required @input=${function () {
              send('updateAdField', { option1: this.value })
            }}>
          </label>
        </p>
        <p>
          <label>Option #2
            <input type="text" value=${ad.option2} required @input=${function () {
              send('updateAdField', { option2: this.value })
            }}>
          </label>
        </p>
        <p>
          <label>Option #3
            <input type="text" value=${ad.option3} @input=${function () {
              send('updateAdField', { option3: this.value })
            }}>
          </label>
        </p>
        <p>
          <label>Option #4
            <input type="text" value=${ad.option4} @input=${function () {
              send('updateAdField', { option4: this.value })
            }}>
          </label>
        </p>
      </fieldset>
      <p>
        <label><span>Select correct answer:</span>
          <select @change=${function () {
            send('updateAdField', { correctAnswer: this.options[this.selectedIndex].value })
          }}>
            <option value="1" ?selected=${ad.correctAnswer == 1}>Option #1</option>
            <option value="2" ?selected=${ad.correctAnswer == 2}>Option #2</option>
            <option value="3" ?selected=${ad.correctAnswer == 3}>Option #3</option>
            <option value="4" ?selected=${ad.correctAnswer == 4}>Option #4</option>
          </select>
        </label>
      </p>
    </form>
  `
}
