import React from 'react';
import Box, { VBox, Page } from 'react-layout-components';

import Tree from 'tintree';

const TreeView = (props) => {
  return (
    <VBox
      fit
      width="100%"
      height="100%"
      alignItems="stretch">
      {props.children}
    </VBox>
  );
}

const Node = (props) => {
  let style = { margin: 10, height: 100, border: '1px solid #c4c4c4', borderRadius: 5};

  if (props.isDragging || props.isParentDragging) {
    style = { ...style, border: '1px dashed #c4c4c4' };
  }

  return (
    <Box
      center
      style={style}>
      {props.data.id}
    </Box>
  );
}

const ChildContainer = (props) => {
  let style = { marginLeft: 20 };

  return (
    <VBox style={style}>
      {props.children}
    </VBox>
  )
}

const App = () => {
  return (
    <Page style={{ padding: 20 }}>
      <Tree
        treeComponent={TreeView}
        nodeComponent={Node}
        childContainerComponent={ChildContainer}
        rootNode={{
          children: [{
            id: 1,
            children: [{
              id: 2,
              children: []
            }, {
              id: 3,
              children: []
            }]
          }, {
            id: 4,
            children: [{
              id: 5,
              children: []
            }, {
              id: 6,
              children: []
            }],
          }],
        }} />
    </Page>
  );
}

export default App;
