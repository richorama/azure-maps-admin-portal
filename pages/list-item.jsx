const React = require('react')
const Component = React.Component
const Panel = require('../components/panel.jsx')
const Loading = require('../components/loading.jsx')
const http = require('../lib/http')
const routie = require('../lib/routie')
const Map = require('../components/map.jsx')
const FileUpload = require('../components/file-upload.jsx')
const UploadEditor = require('../components/upload-editor.jsx')

const ListItem = class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMap: false,
      upload: false,
      showUploadEditor: false,
      downloadLink: http({
        key: this.props.subscriptionKey
      }).Data.getDownloadLink(this.props.udid)
    }

    this.handleUpload = this.handleUpload.bind(this)
    this.handleUploaded = this.handleUploaded.bind(this)
    this.handleServerResponse = this.handleServerResponse.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleShowMap = this.handleShowMap.bind(this)
  }

  handleServerResponse(data) {
    this.setState({ ...data, loading: false })
  }

  handleDownload() {
    window.location = this.state.downloadLink
  }

  handleDelete() {
    this.setState({ loading: true })
    http({ key: this.props.subscriptionKey })
      .Data.delete(this.props.udid)
      .then(() => {
        routie('/list')
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  handleUpload() {
    this.setState({ upload: true })
  }

  handleUploaded(json) {
    this.setState({ upload: false, json, showUploadEditor: !!json })
  }

  handleShowMap() {
    this.setState({ showMap: true })
  }

  renderMapPlaceholder() {
    if (this.state.showMap) {
      return (
        <Map
          subscriptionKey={this.props.subscriptionKey}
          geoJsonUrl={this.state.downloadLink}
        />
      )
    }
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f1f1f2',
          textAlign: 'center'
        }}
      >
        <button
          style={{ marginTop: 160 }}
          className="btn btn-primary"
          onClick={this.handleShowMap}
        >
          Show Map
        </button>
      </div>
    )
  }

  render() {
    if (this.state.loading) return <Loading />
    if (this.state.showUploadEditor) {
      return (
        <UploadEditor
          isUpdate={true}
          udid={this.props.udid}
          json={this.state.json}
          subscriptionKey={this.props.subscriptionKey}
        />
      )
    }
    return (
      <Panel title={`List ${this.props.udid}`}>
        <>
          <div
            style={{
              height: this.state.showMap ? 650 : 350,
              overflow: 'hidden',
              transition: 'height 0.5s ease',
              background: '#f1f1f2'
            }}
          >
            {this.renderMapPlaceholder()}
          </div>
          <label>Download link:</label>
          <input
            className="form-control"
            readOnly={true}
            value={this.state.downloadLink}
          />
        </>
        <>
          <a className="btn btn-primary" href={this.state.downloadLink} download={`${this.props.udid}.json`}>
            Download
          </a>{' '}
          <button className="btn btn-secondary" onClick={this.handleUpload}>
            Upload
          </button>{' '}
          <button className="btn btn-danger" onClick={this.handleDelete}>
            Delete
          </button>
          <FileUpload open={this.state.upload} onOpen={this.handleUploaded} />
        </>
      </Panel>
    )
  }
}

module.exports = ListItem
