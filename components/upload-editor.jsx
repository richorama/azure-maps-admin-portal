const React = require('react')
const Panel = require('./panel.jsx')
const http = require('../lib/http')
const Loading = require('./loading.jsx')
const routie = require('../lib/routie')
const Map = require('../components/map.jsx')

// https://gist.github.com/jed/982883
function generateId(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateId)
}

const UploadEditor = class extends React.Component {
  constructor(props) {
    super(props)

    const { json } = this.props

    this.state = { json, showMap: false }
    this.client = http({ key: this.props.subscriptionKey }).Data

    this.handleSave = this.handleSave.bind(this)
    this.handleGenerate = this.handleGenerate.bind(this)
    this.checkUploadState = this.checkUploadState.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleCheckResponse = this.handleCheckResponse.bind(this)
    this.handleShowMap = this.handleShowMap.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillMount() {
    if (this.timer) clearInterval(this.timer)
  }

  handleGenerate() {
    const { json } = this.state
    json.features.forEach(x => {
      if (!x.properties) {
        x.properties = {}
      }
      if (undefined === x.properties.geometryId) {
        x.properties.geometryId = generateId()
      }
    })
    this.setState({ json })
  }

  handleSave() {
    if (this.props.isUpdate) {
      this.client
        .update(this.props.udid, this.state.json)
        .then(this.handleUpload)
    } else {
      this.client.upload(this.state.json).then(this.handleUpload)
    }
    this.setState({ uploading: true })
  }

  checkUploadState() {
    this.client.check(this.state.uploadId).then(this.handleCheckResponse)
  }

  handleCheckResponse(response) {
    if (response.udid) {
      clearInterval(this.timer)
      if (this.props.isUpdate) return window.location.reload()
      routie(`/list-item/${response.udid}`)
    }
  }

  handleUpload(result) {
    if (result.uploadId) {
      this.setState({
        uploading: true,
        uploadId: result.uploadId
      })
      this.timer = setInterval(this.checkUploadState, 500)
    }
  }

  handleShowMap() {
    this.setState({ showMap: true })
  }

  handleCancel(){
    window.location.reload()
  }

  renderErrors() {
    const features = this.state.json.features || []
    if (features.length === 0) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4>Error!</h4>
          No features found in source data
        </div>
      )
    }

    const featuresWithNoGeometryId = features.filter(
      x => undefined === (x.properties || {}).geometryId
    )
    if (featuresWithNoGeometryId.length) {
      return (
        <div className="alert alert-warning" role="alert">
          <h4>Warning!</h4>
          <p>
            <strong>{featuresWithNoGeometryId.length}</strong> features do not
            have a <strong>geometryId</strong> property.
          </p>
          <p>Would you like to auto generate geometryIds? </p>
          <p>
            <button className="btn btn-warning" onClick={this.handleGenerate}>
              Auto Generate GeometryIds
            </button>
          </p>
        </div>
      )
    }
  }

  renderMapPlaceholder() {
    if (this.state.showMap) {
      return (
        <Map
          subscriptionKey={this.props.subscriptionKey}
          geoJson={this.state.json}
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

  renderReplaceWarning() {
    if (!this.props.isUpdate) return null
    return (
      <div className="alert alert-warning" role="alert">
        <h4>Warning!</h4>
        <p>
          All previously uploaded features in this dataset will be lost.
        </p>
      </div>
    )
  }

  render() {
    if (this.state.uploading) {
      return <Loading />
    }
    const featureCount = (this.state.json.features || []).length
    return (
      <Panel title="Upload Data">
        <>
          <div className="alert alert-info" role="alert">
            {featureCount} features found
          </div>

          {this.renderErrors()}

          {this.renderReplaceWarning()}

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
        </>
        <>
          <button
            disabled={featureCount === 0}
            onClick={this.handleSave}
            className="btn btn-primary"
          >
            Save
          </button>{' '}
          <button
            onClick={this.handleCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </>
      </Panel>
    )
  }
}

module.exports = UploadEditor
