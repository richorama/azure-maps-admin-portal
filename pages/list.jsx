const React = require('react')
const Component = React.Component
const Panel = require('../components/panel.jsx')
const Loading = require('../components/loading.jsx')
const http = require('../lib/http')
const FileUpload = require('../components/file-upload.jsx')
const UploadEditor = require('../components/upload-editor.jsx')

const List = class extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }

    this.handleServerResponse = this.handleServerResponse.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleUploaded = this.handleUploaded.bind(this)
  }

  componentDidMount() {
    http({ key: this.props.subscriptionKey })
      .Data.list()
      .then(this.handleServerResponse)
  }

  handleServerResponse(data) {
    this.setState({ ...data, loading: false })
  }

  handleUpload() {
    this.setState({ upload: true })
  }

  handleUploaded(json) {
    this.setState({ upload: false, json, showUploadEditor: !!json })
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
    if (this.state.showUploadEditor) {
      return (
        <UploadEditor
          json={this.state.json}
          subscriptionKey={this.props.subscriptionKey}
        />
      )
    }
    return (
      <Panel title="Uploaded Data">
        <>
          <label>
            You have {this.state.mapDataList.length} data sets totalling{' '}
            {this.state.mapDataList.reduce(
              (sub, value) => sub + value.sizeInBytes,
              0
            )}{' '}
            bytes.
          </label>
          <div className="list-group">
            {this.state.mapDataList.map(x => this.renderItem(x))}
          </div>
        </>
        <>
          <button className="btn btn-primary" onClick={this.handleUpload}>
            <i className="icon icon-cloud-upload" /> Upload
          </button>
          <FileUpload open={this.state.upload} onOpen={this.handleUploaded} />
        </>
      </Panel>
    )
  }
}

module.exports = List
