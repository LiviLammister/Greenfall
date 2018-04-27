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
      nodes : [],
      links : [],
      flows :
        /**
         * Money-in has positive value
         * Money-out has negative value
         */
        [
          { id: 1, name: 'paycheck', amt: 5000.00, category: 'paycheck' },
          { id: 2, name: 'etsy',     amt: 250.00,  category: 'side-hustle' },
          { id: 3, name: 'kombucha', amt: -5.50,   category: 'food/drink' },
          { id: 4, name: ''        , amt: 0,       category: 'resevoir'},
        ],
    }
  }

  /**
   * Converts an (on-state) flow into a React-vis-compatible node
   * @param flow Flow datum from state
   * @returns React-vis-friendly node
   */
  createNode = flow => ({ name : flow.name , key : flow.id, category : flow.category });

  /**
   * Turn data on state to React-vis-friendly nodes
   * @returns Array of nodes that can be directly used by React-vis
   */
  createNodes = () => this.state.flows.map(flow => this.createNode(flow));
  
  /**
   * Creates a link between two nodes
   * @param {*} source Source node.
   * @param {*} target Target node.
   * @param {*} value  Weight of link.
   * 
   * @returns React-vis compatible link
   */
  createLink = (source, target, value) => ({source, target, value})

  /**
   * Creates the links of Sankey
   */
  createLinks = (nodes) => {
    const links = [];
    links.push.apply(links, this.createIncomeLinks(nodes));
    links.push.apply(links, this.createSpendingLinks(nodes));
    console.log('createlinks: ', links)
    return links;
  }

  /**
   * Creates all links associated with income.  
   * @returns Array of links
   */
  createIncomeLinks = nodes => {
    // Get all nodes with positive amount
    const incomeNodes = nodes.filter(node => this.getAmt(node) > 0);

    // Get the resevoir (only flow with amt of 0)
    const resevoir = nodes.filter(node => this.getAmt(node) === 0)[0];

    const incomeLinks = [];
    for (let i = 0; i < incomeNodes.length; i++) {
      incomeLinks.push(this.createLink(this.getNodeIndexByKey(incomeNodes[i].key, nodes), this.getNodeIndexByKey(resevoir.key, nodes), this.getAmt(incomeNodes[i])))
    }

    return incomeLinks;
  }

  createSpendingLinks = nodes => {
    // Get all nodes with negative amount
    const spendingNodes = nodes.filter(node => this.getAmt(node) < 0);

    // Get the resevoir (only flow with amt of 0)
    const resevoir = nodes.filter(node => this.getAmt(node) === 0)[0];

    const spendingLinks = [];
    for (let i = 0; i < spendingNodes.length; i++) {
      spendingLinks.push(this.createLink(this.getNodeIndexByKey(resevoir.key, nodes), this.getNodeIndexByKey(spendingNodes[i].key, nodes), this.getAmt(spendingNodes[i])))
    }

    return spendingLinks;
  }

  /**
   * @param node 
   * @returns Flow associated with passed-in node
   */
  getFlowFromNode = node => {
    for (let i = 0; i < this.state.flows.length; i++) {
      if (this.state.flows[i].id === node.key) return this.state.flows[i]
    }
  }
    
  /**
   * Gets amount associated with a node
   */
  getAmt = node => this.getFlowFromNode(node).amt;
  
  

  /**
   * Gets the index of a node with a given key
   * @param {*} key Key of the desired node
   * @returns {*} 
   */
  getNodeIndexByKey = (key, nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) return i
    }
  }

  render() {
    const nodes = this.createNodes();
    const links = this.createLinks(nodes);
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