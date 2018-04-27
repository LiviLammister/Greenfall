import React, { Component } from 'react';
import {
  Sankey,
} from 'react-vis';
import {
  Container,
} from 'semantic-ui-react';

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      links: [],
      flows:
        /**
         * Money-in has positive value
         * Money-out has negative value
         */
        [
          { id: 1, name: 'paycheck', amt: 5000.00, category: 'paycheck' },
          { id: 2, name: 'etsy',     amt: 250.00,  category: 'side-hustle' },
          { id: 3, name: 'kombucha', amt: -5.50,   category: 'food/drink' },
        ],
    }
  }


  /**
   * Converts an (on-state) flow into a React-vis-compatible node
   * @param flow Flow datum from state
   * @returns React-vis-friendly node
   */
  createNode = flow => ({ name : flow.name , key : flow.key, category : flow.category });

  
  /**
   * Turn data on state to React-vis-friendly nodes
   * @returns Array of nodes that can be directly used by React-vis
   */
  createNodes = () => {
    const nodes = this.state.flows.map(flow => this.createNode(flow));
    nodes.push({ 
      name     : 'resevoir', 
      key      : nodes.length,
      category : 'resevoir'
    });
    return nodes;
  }
  
  /**
   * Creates a link between two nodes
   * @param {*} source Source node.
   * @param {*} target Target node.
   * @param {*} value  Weight of link.
   * 
   * @returns React-vis compatible link
   */
  createLink = (source, target , value) => ({source, target, value});

  /**
   * @param node 
   * @returns Flow associated with passed-in node
   */
  getFlowFromNode = node => (this.state.flows(flow => flow.id === node.id))[0]
    
  /**
   * Gets amount associated with a node
   */
  getAmt = node => this.getFlowFromNode(node).amt
  
  /**
   * Creates all links associated with income.  
   * @returns Array of links
   */
  createIncomeLinks = nodes => {
    const incomeNodes = nodes.filter(node => getAmt(node) > 0);
    const resevoir    = nodes[nodes.length];
    return incomeNodes.map(node => createLink(node, resevoir, getAmt(node)))
  }

  /**
   * Gets the index of a node with a given key
   * @param {*} key Key of the desired node
   * @returns {*} 
   */
  getNodeIndexByKey = key => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) return i
    }
  }

  render() {
    const testNodes = this.createNodes();
    testNodes.forEach(node => {
      console.log('node: ', node);
    });
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