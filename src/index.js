import * as d3 from './d3.exports.js';
import {flagSprites} from './flags.js';
import {createDrag} from './dragging.js';

const dataUrl = process.env.NODE_ENV == 'production'
  ? 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'
  : '../data/countries.json';

const svg = d3.select('#graph');
const width = +svg.attr('width');
const height = +svg.attr('height');

const linkForce = d3.forceLink();
const chargeForce = d3.forceManyBody().strength(-8);
const centerForce = d3.forceCenter(width / 2, height / 2);
const collideForce = d3.forceCollide(20).strength(0.2);

const simulation = d3.forceSimulation()
  .force('link', linkForce)
  .force('charge', chargeForce)
  .force('center', centerForce)
  .force('collide', collideForce);

d3.json(dataUrl, (graph) => {
  const flags = flagSprites(graph.nodes);

  svg.call(flags.createDefs);

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line');

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('use')
    .data(graph.nodes)
    .enter()
    .append('use')
    .call(flags.setNodeFlag)
    .call(createDrag(simulation));

  node.append('title')
    .text((d) => d.country);

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);

  linkForce.links(graph.links);

  /**
   * Tick event callback.
   */
  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.call(flags.setNodePositionOnTick({
      svgWidth: width,
      svgHeight: height
    }));
  }
});
