const initController = () => {
  const loop = () => {
    const state = getState();
    const heightPadding = ceil(((state.height / tileHeight) - 1) / 2)
    const widthPadding = ceil(((state.width / tileWidth) - 1) / 2)
    draw(
      getMapView(state.position, heightPadding, widthPadding),
      state
    ).then(() => isUpdated() && loop());
  };

  const {
    getMapView,
    cellIds
  } = initModel();

  const {
    getState,
    isUpdated,
    setState: modelSetState
  } = initState();
  const setState = val => modelSetState(val) && loop();

  const onWindowResize = (bodyDimensions) => setState(bodyDimensions);
  const onKeyDown = (which) => {
    setState((state) => {
      let row = 0;
      let col = 0;
      switch (which) {
        case 37:
          // left
          col--;
          break;
        case 38:
          // up
          row--;
          break;
        case 39:
          // right
          col++;
          break;
        case 40:
          // down
          row++;
          break;
        default:
          return;
      }
      const proposedNewState = {
        row: state.position.row + row,
        col: state.position.col + col
      };
      const cell = getMapView(proposedNewState, 0, 0);
      if (cell[0][0].canEnter) {
        return { position: proposedNewState};
      }
    });
  }
  const {
    draw,
    tileHeight,
    tileWidth
  } = initView(modelSetState, { onWindowResize, onKeyDown }, cellIds);


  // init
  modelSetState({ position: {row: 10, col: 10 }});
  loop();
};
