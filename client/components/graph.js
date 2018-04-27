import React, { Component } from 'react';
import {
  Sankey,
} from 'react-vis';
import {
  Container,
} from 'semantic-ui-react';

class Graph extends Component {

  render() {
    const getNodeByKey = key => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === key) return i
      }
    }
    const nodes = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    const links = [
      { source: 0, target: 1, value: 10 },
      { source: 0, target: 2, value: 20 },
      { source: 1, target: 2, value: 20 }
    ];
    return (
      <Container textAlign='center'>
        <Sankey
          nodes={nodes}
          links={links}
          width={1000}
          height={500}
        />
      </Container>
    );
  }
}

export default Graph;