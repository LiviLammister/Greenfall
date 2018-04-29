import React, { Component } from 'react';
import {
  Sankey,
} from 'react-vis';
import {
  Button,
  Container,
  Form,
  Icon,
  Modal,
  Statistic,
} from 'semantic-ui-react';

const INCOME   = 'income';
const EXPENSE  = 'expense';
const RESEVOIR = 'resevoir';

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      flows:
        [
          { id: 1, name: 'paycheck', amt: 5000.00, type: INCOME,   category: 'paycheck' },
          { id: 2, name: 'etsy',     amt: 250.00,  type: INCOME,   category: 'side-hustle' },
          { id: 3, name: 'kombucha', amt: 50.00,   type: EXPENSE,  category: 'food/drink' },
          { id: 4, name: ''        , amt: 0,       type: RESEVOIR, category: RESEVOIR},
        ],
      name      : '',
      amt       : 0,
      type      : INCOME,
      category  : 'misc',
      modalOpen : false,
    }
  }

  /**
   * Converts an (on-state) flow into a React-vis-compatible node
   * @param flow Flow datum from state
   * @returns React-vis-friendly node
   */
  createNode = flow => ({ name: flow.name, key: flow.id, category: flow.category });
  
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
  createLink = (source, target, value, color) => ({ source, target, value, color })

  /**
   * Creates the links of Sankey
   */
  createLinks = (nodes) => {
    const links = [];
    links.push.apply(links, this.createIncomeLinks(nodes));
    links.push.apply(links, this.createExpenseLinks(nodes));
    return links;
  }

  /**
   * Creates all links associated with income.  
   * @returns Array of links
   */
  createIncomeLinks = nodes => {
    // Get all nodes with positive amount
    const incomeNodes = nodes.filter(node => this.getFlowFromNode(node).type === "income");

    // Get the resevoir (only flow with amt of 0)
    const resevoir = nodes.filter(node => this.getFlowFromNode(node).type === 'resevoir')[0];

    const incomeLinks = [];
    for (let i = 0; i < incomeNodes.length; i++) {
      incomeLinks.push(this.createLink(this.getNodeIndexByKey(incomeNodes[i].key, nodes), this.getNodeIndexByKey(resevoir.key, nodes), this.getAmt(incomeNodes[i]), "green"))
    }

    return incomeLinks;
  }

  createExpenseLinks = nodes => {
    // Get all Expense nodes
    const spendingNodes = nodes.filter(node => this.getFlowFromNode(node).type === EXPENSE);

    // Get the resevoir (only flow with amt of 0)
    const resevoir = nodes.filter(node => this.getFlowFromNode(node).type === RESEVOIR)[0];

    const spendingLinks = [];
    for (let i = 0; i < spendingNodes.length; i++) {
      spendingLinks.push(this.createLink(this.getNodeIndexByKey(resevoir.key, nodes), this.getNodeIndexByKey(spendingNodes[i].key, nodes), this.getAmt(spendingNodes[i]), "red"))
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

  largestIncome = () => {
    const flows = this.state.flows;
    let largestVal = 0;
    let largestIndex = 0
    for (let i = 0; i < flows.length; i++) {
      if (flows[i].type !== INCOME) continue;
      if (flows[i].amt > largestVal) {
        largestVal = flows[i].amt;
        largestIndex = i;
      }
    }
    return flows[largestIndex];
  }

  largestExpense = () => {
    const flows = this.state.flows;
    let largestVal = 0;
    let largestIndex = 0
    for (let i = 0; i < flows.length; i++) {
      if (flows[i].type !== EXPENSE) continue;
      if (flows[i].amt > largestVal) {
        largestVal = flows[i].amt;
        largestIndex = i;
      }
    }
    return flows[largestIndex];
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {name, amt, type, category, flows} = this.state;
    
    // If a flow with the entered name exists, add it to that flow's amt
    let newFlows = [];
    let flowExists = false
    for (let i = 0; i < flows.length; i++) {
      newFlows.push(flows[i])
      if (flows[i].name === name) {
        flows[i].amt = Number(flows[i].amt)+Number(amt);
        flowExists = true;
      }
    }

    if (!flowExists) {
      const id = flows.length + 1
      newFlows.push({name, amt, category, id, type})
    }

    this.setState({
      name  : '',
      amt   : 0.00,
      flows : newFlows,
    })
    this.handleClose()
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })
  

  render() {
    const nodes = this.createNodes();
    const links = this.createLinks(nodes);
    const { name, amt } = this.state;
    const largestIncome = this.largestIncome();
    const largestExpense = this.largestExpense();
    console.log(this.state)
    const options = [
      { key: "Income", text: "Income", value: INCOME },
      { key: "Expense", text: "Expense", value: EXPENSE },
    ]
    console.log(this.state)
    return (
      <Container>
        <Sankey
          nodes={nodes}
          links={links}
          width={1000}
          height={500}
        />
        <Modal
          trigger={<Button onClick={this.handleOpen}>Add Flow</Button>}
          open={this.state.modalOpen}
          onClose={this.handleClose}
        >
          <Modal.Header>Add a Flow</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group fluid>
                <Form.Input label="Name" name="name" value={name} onChange={this.handleChange} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input label="Amount" name="amt" value={amt} onChange={this.handleChange} />
                <Form.Select name="type" options={options} placeholder="Type..." onChange={this.handleChange}/>
              </Form.Group>
              <Modal.Actions>
                <Form.Button content='Submit' />
              </Modal.Actions>
            </Form>
          </Modal.Content>
        </Modal>
        <Statistic.Group widths='two'>
          <Statistic color="green">
            <Statistic.Value><Icon name='dollar' />{largestIncome.amt}</Statistic.Value>
            <Statistic.Label>Largest Income: {largestIncome.name}</Statistic.Label>
          </Statistic>
          <Statistic color="red">
            <Statistic.Value><Icon name="dollar" />{largestExpense.amt}</Statistic.Value>
            <Statistic.Label>Largest Expense: {largestExpense.name}</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Container>

    );
  }
}

export default Graph;