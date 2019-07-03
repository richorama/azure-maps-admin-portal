const React = require('react')
const Component = React.Component
const Panel = require('../components/panel.jsx')

const SubscriptionKey = class extends Component {
  constructor(props) {
    super(props)
    this.state = { subscriptionKey: this.props.subscriptionKey || '' }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleKeyEnter = this.handleKeyEnter.bind(this)
  }

  handleKeyEnter(e) {
    this.setState({
      subscriptionKey: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.subscriptionKey)
  }

  render() {
    return (
      <Panel title="Enter a Subscription Key">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Enter an Azure Maps Subscription Key to get started</label>
            <input
              onChange={this.handleKeyEnter}
              className="form-control"
              type="text"
              value={this.state.subscriptionKey}
              placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            />
          </div>
          <div className="form-group">
            <input
              disabled={!this.state.subscriptionKey}
              type="submit"
              value="Enter"
              className="btn btn-primary"
            />
          </div>
        </form>
      </Panel>
    )
  }
}

module.exports = SubscriptionKey
