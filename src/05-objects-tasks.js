/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class SelectorChain {
  constructor() {
    this.selectorChain = '';
    this.idCount = 0;
    this.elementCount = 0;
    this.pseudoElementCount = 0;
    this.selectorOrder = 0;
  }

  checkSelectorsOrder(currentOrder) {
    if (this.selectorOrder > currentOrder) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  checkOccurence() {
    if (this.idCount > 1 || this.pseudoElementCount > 1 || this.elementCount > 1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  element(value) {
    this.elementCount += 1;
    this.checkOccurence();
    this.checkSelectorsOrder(1);
    this.selectorChain += String(value);
    this.selectorOrder = 1;
    return this;
  }

  id(value) {
    this.idCount += 1;
    this.checkOccurence();
    this.checkSelectorsOrder(2);
    this.selectorChain += `#${value}`;
    this.selectorOrder = 2;
    return this;
  }

  class(value) {
    this.checkSelectorsOrder(3);
    this.selectorChain += `.${value}`;
    this.selectorOrder = 3;
    return this;
  }

  attr(value) {
    this.checkSelectorsOrder(4);
    this.selectorChain += `[${value}]`;
    this.selectorOrder = 4;
    return this;
  }

  pseudoClass(value) {
    this.checkSelectorsOrder(5);
    this.selectorChain += `:${value}`;
    this.selectorOrder = 5;
    return this;
  }

  pseudoElement(value) {
    this.checkSelectorsOrder(6);
    this.pseudoElementCount += 1;
    this.checkOccurence();
    this.selectorChain += `::${value}`;
    this.selectorOrder = 6;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selectorChain = `${selector1.selectorChain} ${combinator} ${selector2.selectorChain}`;
    return this;
  }

  stringify() {
    const selector = this.selectorChain;
    this.selectorChain = '';
    return selector;
  }
}

const cssSelectorBuilder = {
  element: (value) => new SelectorChain().element(value),
  id: (value) => new SelectorChain().id(value),
  class: (value) => new SelectorChain().class(value),
  attr: (value) => new SelectorChain().attr(value),
  pseudoClass: (value) => new SelectorChain().pseudoClass(value),
  pseudoElement: (value) => new SelectorChain().pseudoElement(value),
  combine: (s1, combinator, s2) => new SelectorChain().combine(s1, combinator, s2),
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
