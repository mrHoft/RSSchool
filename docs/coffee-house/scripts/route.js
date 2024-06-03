function route(hash = '') {
  if (typeof location !== 'undefined') {
    const route = location.pathname.split('/').reduce((acc, str) => (acc += str !== '' && acc.slice(-5) !== 'house' ? '/' + str : ''), '')
    location = `${location.origin}${route}/${hash}`
  }
}
