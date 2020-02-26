// This function receives a message name and a piece of data
// It triggers an event with that name and attaches the data
// This is meant to be used to do any action in the template
// by sending a message inside an HTML event attribute

export const send = (msg, data?) =>
  document.dispatchEvent(new CustomEvent(msg, {
    detail: data || {}
  }))
