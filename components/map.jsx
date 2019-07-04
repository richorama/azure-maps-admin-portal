const React = require('react')

const MapComponent = class extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Initialising Map'
    }
    this.addLayers = this.addLayers.bind(this)
    this.handleDone = this.handleDone.bind(this)
  }
  componentDidMount() {
    this.map = new atlas.Map('map', {
      center: [0, 0],
      zoom: 1,
      language: 'en-US',
      authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: this.props.subscriptionKey
      }
    })

    this.map.events.add('ready', this.addLayers)
  }

  addLayers() {
    this.setState({ status: 'Downloading Data' })
    const datasource = new atlas.source.DataSource()
    this.map.sources.add(datasource)

    const polygonLayer = new atlas.layer.LineLayer(datasource, null, {
      strokeColor: 'red',
      filter: [
        'any',
        ['==', ['geometry-type'], 'Polygon'],
        ['==', ['geometry-type'], 'MultiPolygon']
      ] //Only render Polygon or MultiPolygon in this layer.
    })
    const lineLayer = new atlas.layer.LineLayer(datasource, null, {
      strokeColor: 'red',
      strokeWidth: 4,
      filter: [
        'any',
        ['==', ['geometry-type'], 'LineString'],
        ['==', ['geometry-type'], 'MultiLineString']
      ] //Only render LineString or MultiLineString in this layer.
    })
    const pointLayer = new atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: {
        allowOverlap: true,
        ignorePlacement: true,
        image: 'pin-round-darkblue'
      },
      filter: [
        'any',
        ['==', ['geometry-type'], 'Point'],
        ['==', ['geometry-type'], 'MultiPoint']
      ] //Only render Point or MultiPoints in this layer.
    })
    this.map.layers.add([polygonLayer, lineLayer, pointLayer])
    if (this.props.geoJson){
      datasource.add(this.props.geoJson)
      this.handleDone()
    }
    if (this.props.geoJsonUrl){
      datasource.importDataFromUrl(this.props.geoJsonUrl).then(this.handleDone)
    }
  }

  handleDone() {
    this.setState({ status: null })
  }

  renderStatus() {
    if (!this.state.status) return null
    return (
      <span
        style={{ position: 'absolute', zIndex: 1000, left: 4, top: 4 }}
        className="badge badge-primary"
      >
        {this.state.status}
      </span>
    )
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        {this.renderStatus()}
        <div
          id="map"
          style={{
            width: '100%',
            height: this.props.height || 650,
            background: '#f1f1f2'
          }}
          ref="map"
        />
      </div>
    )
  }
}

module.exports = MapComponent
