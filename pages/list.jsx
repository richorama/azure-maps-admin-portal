const React = require('react')
const Component = React.Component
const Panel = require('../components/panel.jsx')
const Loading = require('../components/loading.jsx')
const http = require('../lib/http')

const List = class extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }

    this.handleServerResponse = this.handleServerResponse.bind(this)
  }

  componentDidMount() {
    http({ key: this.props.subscriptionKey })
      .Data.list()
      .then(this.handleServerResponse)
  }

  handleServerResponse(data) {
    this.setState({ ...data, loading: false })
  }

  renderItem(item) {
    return (
      <a
        key={item.udid}
        className="list-group-item list-group-item-action flex-column align-items-start"
        href={`#/list-item/${item.udid}`}
      >
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{item.udid}</h5>
          <small>{item.sizeInBytes} bytes</small>
        </div>
        <p className="mb-1">Upload: {item.uploadStatus}</p>
      </a>
    )
  }

  render() {
    if (this.state.loading) return <Loading />
    return (
      <Panel title="Uploaded Data">
        <div className="list-group">
          {this.state.mapDataList.map(x => this.renderItem(x))}
        </div>
      </Panel>
    )
  }
}

module.exports = List
