const React = require('react')
const ReactDOM = require('react-dom')
const Page = require('./components/page.jsx')
const routie = require('./lib/routie')
const SubscriptionKeyPage = require('./pages/subscription-key.jsx')
const ListPage = require('./pages/list.jsx')
const ListItemPage = require('./pages/list-item.jsx')

const contentElement = document.getElementById('content')
function render(jsx) {
  ReactDOM.render(jsx, contentElement)
}

let subscriptionKey = window.localStorage.subscriptionKey || ''
function handleSubscriptionKey(key) {
  window.localStorage.subscriptionKey = key
  subscriptionKey = key
  routie('/list')
}

function handleClear() {
  window.localStorage.subscriptionKey = ''
  subscriptionKey = ''
  routie('')
}

routie('', () => {
  render(<Page activeMenuItem="#">Hello World</Page>)
})

routie('/subscription-key', () => {
  render(
    <Page activeMenuItem="#/subscription-key">
      <SubscriptionKeyPage
        subscriptionKey={subscriptionKey}
        onSubmit={handleSubscriptionKey}
        onClear={handleClear}
      />
    </Page>
  )
})

routie('/list', () => {
  render(
    <Page activeMenuItem="#/list">
      <ListPage subscriptionKey={subscriptionKey} />
    </Page>
  )
})

routie('/list-item/:udid', udid => {
  render(
    <Page activeMenuItem="#/list">
      <ListItemPage subscriptionKey={subscriptionKey} udid={udid} />
    </Page>
  )
})

routie.reload()
