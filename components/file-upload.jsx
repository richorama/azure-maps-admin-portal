const React = require('react')

const FileUpload = class extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleReaderLoad = this.handleReaderLoad.bind(this)
  }
  componentWillUpdate(newProps) {
    if (newProps.open) this.open()
  }
  handleChange(e) {
    if (e.target.files.length === 0) return his.props.onOpen()
    const reader = new FileReader()
    reader.onload = this.handleReaderLoad
    reader.readAsText(e.target.files[0])
  }
  handleReaderLoad(e) {
    var json = JSON.parse(e.target.result)
    this.props.onOpen(json)
  }
  open() {
    this.refs.input.click()
  }
  render() {
    return (
      <span style={{ display: 'none' }}>
        <input type="file" onChange={this.handleChange} ref="input" />
      </span>
    )
  }
}

module.exports = FileUpload
