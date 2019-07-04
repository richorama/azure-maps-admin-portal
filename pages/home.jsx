const React = require('react')
const Component = React.Component
const Panel = require('../components/panel.jsx')

const Home = class extends Component {
  render() {
    return (
      <Panel title="Azure Maps Admin Portal">
        <>
          <h1>Welcome!</h1>
          <p>
            This browser-based application enables you to manage the data in an{' '}
            <a href="https://azure.microsoft.com/en-au/services/azure-maps/">
              Azure Maps
            </a>{' '}
            Data Service.
          </p>
          <p>
            This is an{' '}
            <a href="https://github.com/richorama/azure-maps-admin-portal">
              open source project
            </a>
            , developed by{' '}
            <a href="https://twitter.com/richorama">Richard Astbury</a> and is
            not affiliated or associated with Microsoft.
          </p>
          <p>
            To use the app,{' '}
            <a href="#/subscription-key">
              enter your Azure Maps Subscription Key
            </a>
            . The app will then connect to the Azure Maps Data Service{' '}
            <a href="https://docs.microsoft.com/en-us/rest/api/maps/data">
              Rest API
            </a>
            .
          </p>
          <p>
            This app will allow you to upload and download GeoJSON data sets,
            which you can then add to your own map, or query using the Azure
            Maps Spatial REST API.
          </p>
          <p>
            <a className="btn btn-primary" href="#/subscription-key">
              <i className="icon icon-key" /> Enter your Subscription Key
            </a>{' '}
            <a
              className="btn btn-primary"
              href="https://github.com/richorama/azure-maps-admin-portal/issues/new"
            >
              <i className="icon icon-social-github" /> Report a Bug
            </a>
          </p>
        </>
      </Panel>
    )
  }
}

module.exports = Home
