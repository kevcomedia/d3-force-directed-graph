import * as d3 from './d3.exports.js';

/**
 * Returns a new drag behavior.
 * @param {object} simulation - The D3 simulation object to create the drag
 * behavior for.
 * @return {object} The drag behavior.
 */
export function createDrag(simulation) {
  const dragStarted = (d) => {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }

    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  const dragEnded = (d) => {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }

    d.fx = null;
    d.fy = null;
  };

  return d3.drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded);
};
