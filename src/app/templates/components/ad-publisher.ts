import { html } from 'lit-html'
import { send } from '../../lib/message'

export const AdPublisher = newAd => {

  return html`
    <form>
      <grid>
        <column size="6">
          <p>
            <label>Select a video:
              <input type="file" required @change=${function () {
                send('uploadNewAdFile', { name: 'video', content: this.files[0] })
              }}>
            </label>
          </p>
          <p>
            <label>Banner:
              <input type="file" required @change=${function (){
                send('uploadNewAdFile', { name: 'banner', content: this.files[0] })
              }}>
            </label>
          </p>
          <p>
            <label>Starts at (seconds):
              <input type="text" value=${newAd.startsAt} required @input=${function () {
                send('newAdField', { field: 'startsAt', value: this.value })
              }}>
            </label>
          </p>
        </column>
        <column size="6">
          <p>
            <label>Logo:
              <input type="file" required @change=${function () {
                send('uploadNewAdFile', { name: 'logo', content: this.files[0] })
              }}>
            </label>
          </p>
          <p>
            <label>Minimum Width:
              <input type="text" value=${newAd.minWidth} required @input=${function () {
                send('newAdField', { field: 'minWidth', value: this.value})
              }}>
            </label>
          </p>
          <p>
            <label>Minimum Height:
              <input type="text" value=${newAd.minHeight} required @input=${function () {
                send('newAdField', { field: 'minHeight', value: this.value })
              }}>
            </label>
          </p>
          <p>
            <label>
              <input type="checkbox" ?checked=${newAd.canSkip} @click=${function () {
                send('newAdField', { field: 'canSkip', value: this.checked })
              }}> <span>Can be skipped</span>
            </label>
          </p>
        </column>
      </grid>
      <p>
        <label>Type of ad:
          <select @change=${function () {
            send('newAdField', { field: 'type', value: this.options[this.selectedIndex].value })
          }}>
            <option value="multiple">Multiple options</option>
            <option value="survey">Survey</option>
            <option value="truefalse">True/False</option>
          </select>
        </label>
      </p>

      <p>
        <label>Question:
          <input type="text" value=${newAd.question} required @input=${function () {
            send('newAdField', { field: 'question', value: this.value })
          }}>
        </label>
      </p>


      <fieldset style=${newAd.type === 'truefalse' ? 'display:none' : 'display:block'}>
        <p>
          <label>Option #1
            <input type="text" value=${newAd.options[1] || ''} required @input=${function () {
              send('newAdFieldOption', { field: 1, value: this.value })
            }}>
          </label>
        </p>
        <p>
          <label>Option #2
            <input type="text" value=${newAd.options[2] || ''} required @input=${function () {
              send('newAdFieldOption', { field: 2, value: this.value })
            }}>
          </label>
        </p>
        <p>
          <label>Option #3
            <input type="text" value=${newAd.options[3] || ''} @input=${function () {
              send('newAdFieldOption', { field: 3, value: this.value })
            }}>
          </label>
        </p>
        <p>
          <label>Option #4
            <input type="text" value=${newAd.options[4] || ''} @input=${function () {
              send('newAdFieldOption', { field: 4, value: this.value })
            }}>
          </label>
        </p>
      </fieldset>
      <p style=${newAd.type === 'truefalse' || newAd.type === 'survey' ? 'display:none' : 'display:block'}>
        <label><span>Select correct answer:</span>
          <select @change=${function () {
            send('newAdField', { field: 'correctAnswer', value: this.options[this.selectedIndex].value })
          }}>
            <option value="1" ?selected=${newAd.correctAnswer == 1}>Option #1</option>
            <option value="2" ?selected=${newAd.correctAnswer == 2}>Option #2</option>
            <option value="3" ?selected=${newAd.correctAnswer == 3}>Option #3</option>
            <option value="4" ?selected=${newAd.correctAnswer == 4}>Option #4</option>
          </select>
        </label>
      </p>
    </form>
  `
}
