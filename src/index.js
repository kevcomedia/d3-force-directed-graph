import * as d3 from './d3.exports.js';
import {createDrag} from './dragging.js';
import flagSprites from './flags/flags.png';

const dataUrl = process.env.NODE_ENV == 'production'
  ? 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'
  : '../data/countries.json';

const svg = d3.select('#graph');
const width = +svg.attr('width');
const height = +svg.attr('height');

const flagWidth = 16;
const flagHeight = 11;

const defs = svg.append('defs');

const clipPath = defs.append('clipPath')
  .attr('id', 'icon-cp');

clipPath.append('rect')
  .attr('width', 16)
  .attr('height', 11);

defs.append('image')
  .attr('id', 'icon-sprite')
  .attr('width', 256)
  .attr('height', 176)
  .attr('href', flagSprites);

const linkForce = d3.forceLink();
const chargeForce = d3.forceManyBody().strength(-8);
const centerForce = d3.forceCenter(width / 2, height / 2);

const simulation = d3.forceSimulation()
  .force('link', linkForce)
  .force('charge', chargeForce)
  .force('center', centerForce);

d3.json(dataUrl, (graph) => {
  const flag = defs.selectAll('.flagSprite')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'flagSprite')
    .attr('id', (d) => `flag-${d.code}`)
    .attr('clip-path', 'url(#icon-cp)');

  flag.append('use')
    .attr('href', '#icon-sprite')
    .attr('class', (d) => `flag flag-${d.code}`);

  flag.selectAll('use')
    .attr('transform', function(d) {
      // eslint-disable-next-line no-invalid-this
      const translate = d3.select(this).style('background-position')
        .replace(/[px]/g, '')
        .replace(' ', ',');
      return `translate(${translate})`;
    });

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke', '#aaa');

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('use')
    .data(graph.nodes)
    .enter()
    .append('use')
    .attr('href', (d) => `#flag-${d.code}`)
    .attr('transform', `translate(${-flagWidth / 2}, ${-flagHeight / 2})`)
    .call(createDrag(simulation));

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

    node
      .attr('x', (d) =>
        d.x = Math.max(flagWidth / 2, Math.min(width - flagWidth / 2, d.x)))
      .attr('y', (d) =>
        d.y = Math.max(flagHeight / 2, Math.min(height - flagHeight / 2, d.y)));
  }
});
