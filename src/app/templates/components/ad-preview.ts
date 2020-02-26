import { html } from 'lit-html'
import { send } from '../../lib/message'

export const AdPreview = ad => html`
  <section class="accruly-player demo" data-skippable=${ad.skippable ? 'true' : 'false'}>

    ${ad.video === '' ? '' : html`
      <video class="accruly-video" controls @timeupdate=${function () {
        const banner: any = document.querySelector('.accruly-banner-img')
        const insertedQA: any = document.querySelector('.accruly-qa')

        if (Math.round(this.currentTime) == ad.startsAt) {
          insertedQA.style.display = 'block'
          banner.style.display = 'none'
        }
      }}>
        <source src="${ad.video}" type="video/mp4">
      </video>
    `}

    <div class="accruly-logo">
      <img class="accruly-logo-img" src="${ad.logo}">
    </div>

    <img class="accruly-banner-img" src="${ad.banner}">

    <section class="accruly-qa">
      <p class="accruly-question">${ad.question}</p>

      ${AdOptions(ad)}
    </section>
  </section>
`


const AdOptions = ad => {

  return html`
    <div class="accruly-options">
      <button class="accruly-answer" style=${ad.option1 == '' ? 'display:none' : 'display:block'} data-answerid="1" @click=${function() {
        const banner: any = document.querySelector('.accruly-banner-img')
        const insertedQA: any = document.querySelector('.accruly-qa')
        const thisButton = this

        if (thisButton.dataset.answerid == ad.correctAnswer) {
          thisButton.style.backgroundColor = '#16c86a'
          thisButton.style.color = 'white'
        } else {
          thisButton.style.backgroundColor = '#d14040'
          thisButton.style.color = 'white'

          setTimeout(function(){
            insertedQA.style.display = 'block'
            banner.style.display = 'none'
          }, 4000)
        }

        // Hide the Q&A and clear the selected answer after 1 second
        setTimeout(function(){
          insertedQA.style.display = 'none'
          thisButton.style.backgroundColor = 'white'
          thisButton.style.color = 'black'
          banner.style.display = 'block'
        }, 1000)
      }}>${ad.option1}</button>

      <button class="accruly-answer" style=${ad.option2 == '' ? 'display:none' : 'display:block'} data-answerid="2" @click=${function() {
        const banner: any = document.querySelector('.accruly-banner-img')
        const insertedQA: any = document.querySelector('.accruly-qa')
        const thisButton = this

        if (thisButton.dataset.answerid == ad.correctAnswer) {
          thisButton.style.backgroundColor = '#16c86a'
          thisButton.style.color = 'white'
        } else {
          thisButton.style.backgroundColor = '#d14040'
          thisButton.style.color = 'white'

          setTimeout(function(){
            insertedQA.style.display = 'block'
            banner.style.display = 'none'
          }, 4000)
        }

        // Hide the Q&A and clear the selected answer after 1 second
        setTimeout(function(){
          insertedQA.style.display = 'none'
          thisButton.style.backgroundColor = 'white'
          thisButton.style.color = 'black'
          banner.style.display = 'block'
        }, 1000)
      }}>${ad.option2}</button>

      <button class="accruly-answer" style=${ad.option3 == '' ? 'display:none' : 'display:block'} data-answerid="3" @click=${function() {
        const banner: any = document.querySelector('.accruly-banner-img')
        const insertedQA: any = document.querySelector('.accruly-qa')
        const thisButton = this

        if (thisButton.dataset.answerid == ad.correctAnswer) {
          thisButton.style.backgroundColor = '#16c86a'
          thisButton.style.color = 'white'
        } else {
          thisButton.style.backgroundColor = '#d14040'
          thisButton.style.color = 'white'

          setTimeout(function(){
            insertedQA.style.display = 'block'
            banner.style.display = 'none'
          }, 4000)
        }

        // Hide the Q&A and clear the selected answer after 1 second
        setTimeout(function(){
          insertedQA.style.display = 'none'
          thisButton.style.backgroundColor = 'white'
          thisButton.style.color = 'black'
          banner.style.display = 'block'
        }, 1000)
      }}>${ad.option3}</button>

      <button class="accruly-answer" style=${ad.option4 == '' ? 'display:none' : 'display:block'} data-answerid="4" @click=${function() {
        const banner: any = document.querySelector('.accruly-banner-img')
        const insertedQA: any = document.querySelector('.accruly-qa')
        const thisButton = this

        if (thisButton.dataset.answerid == ad.correctAnswer) {
          thisButton.style.backgroundColor = '#16c86a'
          thisButton.style.color = 'white'
        } else {
          thisButton.style.backgroundColor = '#d14040'
          thisButton.style.color = 'white'

          setTimeout(function(){
            insertedQA.style.display = 'block'
            banner.style.display = 'none'
          }, 4000)
        }

        // Hide the Q&A and clear the selected answer after 1 second
        setTimeout(function(){
          insertedQA.style.display = 'none'
          thisButton.style.backgroundColor = 'white'
          thisButton.style.color = 'black'
          banner.style.display = 'block'
        }, 1000)
      }}>${ad.option4}</button>
    </div>
  `
}
