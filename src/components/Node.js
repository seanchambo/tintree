import React from 'react';
import PropTypes from 'prop-types';
import ReactDnD from 'react-dnd';

const nodeSource = {
  beginDrag(props) {
    return {
      id: props.data.id,
      parentId: props.parentId,
    };
  },
  endDrag(props, monitor) {
    const itemId = monitor.getItem().id;
    const dragId = monitor.getItem().parentId;
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.onDrop(itemId, dragId);
    }
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.data.id;
  },
};

const nodeTarget = {
  hover(props, monitor) {
    if (monitor.isOver({ shallow: true })) {
      const hoverId = props.data.id;
      const dragId = monitor.getItem().parentId;
      const itemId = monitor.getItem().id;

      if (hoverId === dragId || hoverId === itemId) { return; }

      if (!props.root && props.parentIds.indexOf(itemId) > -1) { return; }

      props.onDrop(itemId, dragId, hoverId);
      monitor.getItem().parentId = hoverId;
    }
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget(),
});

class Node extends React.Component {
  render() {
    const {
      data,
      connectDragSource,
      connectDropTarget,
      isDragging,
      isParentDragging,
      onDrop,
      childNodes,
      childContainerComponent,
      parentIds,
      root,
    } = this.props;

    let parentDragging = false;

    if (isDragging || isParentDragging) { parentDragging = true; }

    return connectDragSource(connectDropTarget(
      <div>
        { !this.props.root && <this.props.component
          data={data}
          isRoot={root}
          childNodes={childNodes}
          isDragging={isDragging}
          isParentDragging={parentDragging}
        />
        }
        {
          !!childNodes.length &&
            <this.props.childContainerComponent
              isRoot={root}
              isDragging={isDragging}
              isParentDragging={isParentDragging}>
              { childNodes.map(node => (<NodeDragDrop
                key={node.id}
                root={false}
                data={node}
                parentId={data.id}
                parentIds={[...parentIds, data.id]}
                isParentDragging={parentDragging}
                childNodes={node.children}
                childContainerComponent={childContainerComponent}
                component={this.props.component}
                onDrop={onDrop}
              />))}
            </this.props.childContainerComponent>
        }
      </div>
    ));
  }
}

Node.propTypes = {
  data: PropTypes.object.isRequired,
  root: PropTypes.bool.isRequired,
  parentId: PropTypes.any,
  parentIds: PropTypes.array,
  isParentDragging: PropTypes.bool,
  childNodes: PropTypes.array.isRequired,
  component: PropTypes.func.isRequired,
  childContainerComponent: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

Node.defaultProps = {
  parentId: null,
  parentIds: [],
  isParentDragging: false,
};

const NodeDragDrop = ReactDnD.DropTarget('node', nodeTarget, collectTarget)(ReactDnD.DragSource('node', nodeSource, collectSource)(Node));

export default NodeDragDrop;

