const React = require('react')

const menuItems = [
  {
    showWhenLoggedOut: true,
    href: '#',
    title: 'Home',
    icon: 'icon-home'
  },
  {
    showWhenLoggedOut: true,
    href: '#/subscription-key',
    title: 'Subscription Key',
    icon: 'icon-key'
  },
  {
    href: '#/list',
    title: 'Uploaded Data',
    icon: 'icon-layers'
  }
]

const MenuItem = props => {
  return (
    <li className="nav-item">
      <a
        href={props.href}
        className={props.active ? 'active nav-link' : 'nav-link'}
      >
        <i className={`nav-icon ${props.icon}`} /> {props.title}
      </a>
    </li>
  )
}

const Menu = props => {
  const loggedIn = !!window.localStorage.subscriptionKey
  const filteredMenuItems = loggedIn
    ? menuItems
    : menuItems.filter(x => x.showWhenLoggedOut)

  return (
    <ul className="nav">
      <li className="nav-title">Azure Maps Admin Portal</li>
      {filteredMenuItems.map((x, index) => {
        const active = props.activeMenuItem === x.href
        return <MenuItem key={index} {...x} active={active} />
      })}
    </ul>
  )
}

module.exports = Menu
