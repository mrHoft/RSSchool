/**
 * Simple templator
 * Author: Hoft
 * Usage example:

<html>
	<body>
		<main>
			<Wrapper-tmpl include="./info.tmpl"></Wrapper-tmpl>
		</main>
		<script type="module">
			import render from "./src/utils/templator.js";
			// splash is optional and preferently must be modal
			const splash = `<h1 id="loading-progress" style="text-align: center;">Loading...</h1>`
			render(splash)
		</script>
	</body>
</html>
*/

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
  const elements = document.getElementsByTagName('Wrapper-tmpl')
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

/**
 * Performs render page.
 *
 * @param {string | null} splash html markup or path to splash.tmpl file
 */
export default function render(splash = null) {
  // Add splash screen component
  if (splash) {
    const collection = document.getElementsByTagName('main')
    const main = collection.length > 0 ? collection[0] : undefined
    if (main) {
      const div = document.createElement('div')
      const att = document.createAttribute('id')
      att.value = 'splash'
      div.setAttributeNode(att)
      main.appendChild(div)

      const progressCallback = percent => {
        const el = document.getElementById('loading-progress')
        if (el) el.textContent = `Loading: ${percent}%`
      }

      const doneCallback = () => {
        div.remove()
      }

      if (splash.slice(-5) === '.tmpl') {
        // splash is a file
        const xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) {
              div.innerHTML = this.responseText
            }
            if (this.status == 404) {
              div.innerHTML = 'Page not found.'
            }
            includeTMPL(progressCallback, doneCallback)
          }
        }
        xhttp.open('GET', splash, true)
        xhttp.send()
      } else {
        // splash is an html markup text
        div.innerHTML = splash
        includeTMPL(progressCallback, doneCallback)
      }
      return
    }
  }
  // Perform render without splash screen
  includeTMPL()
}
