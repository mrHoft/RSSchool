class Counter {
  constructor(start = 0) {
    this.count = start
  }

  add() {
    return ++this.count
  }

  get() {
    return this.count
  }
}

/**
 * Inserts content from external .tmpl files
 *
 * @param {function(percent<number>)} progressCallback Nullable
 * @param {function} doneCallback Nullable
 */
function includeTMPL(progressCallback = null, doneCallback = null) {
  const elements = document.getElementsByTagName('wrapper-tmpl')
  const counter = new Counter()
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    // Search for elements with a certain atrribute
    const file = el.getAttribute('include')
    if (file) {
      // Make an HTTP request using the attribute value as the file name
      const xhttp = new XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            el.innerHTML = this.responseText
          }
          if (this.status == 404) {
            el.innerHTML = 'Page not found.'
          }
          // Remove the attribute
          el.removeAttribute('include')

          const count = counter.add()
          if (count == elements.length) {
            // console.log('All is done!')
            if (doneCallback) doneCallback()
          } else {
            // console.log(`${count} Added: ${file}`)
            if (progressCallback) progressCallback(Math.floor((count / elements.length) * 100))
          }
        }
      }
      xhttp.open('GET', file, true)
      xhttp.send()
    }
  }
}

includeTMPL(
  percent => {
    console.log(`Loading: ${percent}%`)
  },
  () => {
    if (location.hash) document.querySelector(location.hash).scrollIntoView()
  }
)
