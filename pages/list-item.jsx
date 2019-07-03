const React = require('react')
const Component = React.Component
const Panel = require('../components/panel.jsx')
const Loading = require('../components/loading.jsx')
const http = require('../lib/http')

const ListItem = class extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleServerResponse = this.handleServerResponse.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
  }

  handleServerResponse(data) {
    this.setState({ ...data, loading: false })
  }

  handleDownload() {
    const link = http({ key: this.props.subscriptionKey }).Data.getDownloadLink(
      this.props.udid
    )
    window.location = link
  }

  render() {
    return (
      <Panel title={`List ${this.props.udid}`}>
        <></>
        <>
          <button className="btn btn-primary" onClick={this.handleDownload}>
            Download
          </button>{' '}
          <button className="btn btn-danger">Delete</button>
        </>
      </Panel>
    )
  }
}

module.exports = ListItem
