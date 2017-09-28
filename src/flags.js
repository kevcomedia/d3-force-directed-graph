import * as d3 from './d3.exports.js';
import flagSpritePng from './flags/flags.png';

/**
 * Returns an object that provides methods for setting the flag sprites as well
 * as other related utilities.
 *
 * @return {object}
 */
export function flagSprites() {
  const flagWidth = 16;
  const flagHeight = 11;
  // Dimensions of the flags.png file
  const spritesWidth = 256;
  const spritesHeight = 176;

  let data = null;

  return {
    createDefs(svg) {
      const defs = svg.append('defs');

      const clipPath = defs.append('clipPath')
        .attr('id', 'icon-cp');

      clipPath.append('rect')
        .attr('width', flagWidth)
        .attr('height', flagHeight);

      defs.append('image')
        .attr('id', 'icon-sprite')
        .attr('width', spritesWidth)
        .attr('height', spritesHeight)
        .attr('href', flagSpritePng);

      const flag = defs.selectAll('.flagSprite')
        .data(data)
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

      return this;
    },

    setNodeFlag(node) {
      node
        .attr('href', (d) => `#flag-${d.code}`)
        .attr('transform', `translate(${-flagWidth / 2}, ${-flagHeight / 2})`);
    },

    setData(d) {
      data = d;

      return this;
    },

    getFlagDimensions() {
      return {
        width: flagWidth,
        height: flagHeight
      };
    }
  };
}
