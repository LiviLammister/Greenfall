import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import { Menu }             from 'semantic-ui-react';

class Navbar extends Component {
  render () {
    return (
      <div>
        <Menu>
          <Menu.Item>Home</Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default Navbar