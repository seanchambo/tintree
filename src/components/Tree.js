import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDnD from 'react-dnd';

import Node from './Node';

const findNode = (itemId, node) => {
  if (node.id === itemId) { return node; }
  let result = null;
  if (node.children.length) {
    for (const child of node.children) {
      if (result === null) {
        result = findNode(itemId, child);
      }
    }
  }
  return result;
};

class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rootNode: this.props.rootNode,
    };

    this.moveNode = this.moveNode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ rootNode: nextProps.rootNode });
  }


  moveNode(itemId, dragId, hoverId) {
    const { rootNode } = this.state;
    const dupRootNode = { ...rootNode };

    const oldNode = findNode(dragId, dupRootNode);
    const newNode = findNode(hoverId, dupRootNode);
    const item = oldNode.children.find(child => child.id === itemId);

    newNode.children = [item, ...newNode.children];
    oldNode.children = oldNode.children.filter(child => child.id !== itemId);

    this.setState({
      ...this.state,
      rootNode: dupRootNode,
    });

    this.props.onMoveNode(itemId, dragId, hoverId);
  }

  render() {
    const { nodeComponent, childContainerComponent } = this.props;
    const { rootNode } = this.state;

    return (
      <this.props.treeComponent>
        <Node
          root
          data={rootNode}
          parentId={null}
          childNodes={rootNode.children}
          childContainerComponent={childContainerComponent}
          component={nodeComponent}
          onDrop={this.moveNode}
        />
      </this.props.treeComponent>
    );
  }
}

Tree.propTypes = {
  rootNode: PropTypes.object.isRequired,
  treeComponent: PropTypes.func.isRequired,
  nodeComponent: PropTypes.func.isRequired,
  childContainerComponent: PropTypes.func.isRequired,
  onMoveNode: PropTypes.func,
};

Tree.defaultProps = {
  onMoveNode: () => {},
};

export default ReactDnD.DragDropContext(HTML5Backend)(Tree);
