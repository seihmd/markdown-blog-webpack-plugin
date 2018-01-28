/**
 * @param  {array} data
 * @param  {array} aggAttrs
 * @return {Object} preparedAggs { aggAttr: [overlapped items] }
 */
function prepareAggs(data, aggAttrs) {
  const aggValues = {};
  data.forEach(postdata => {
    aggAttrs.forEach(aggAttr => {
      if (!aggValues[aggAttr]) {
        aggValues[aggAttr] = [];
      }
      if (postdata[aggAttr]) {
        aggValues[aggAttr] = aggValues[aggAttr].concat(postdata[aggAttr]);
      }
    });
  });
  return aggValues;
}

/**
 * @param  {Object} preparedAggs { aggAttr: [overlapped items] }
 * @return {Object} count { aggAttr: [ { item: count } ] }
 */
function countItem(preparedAggs) {
  const count = {};
  Object.keys(preparedAggs).forEach(aggAttr => {
    const items = preparedAggs[aggAttr];
    items.forEach(item => {
      if (!count[aggAttr]) {
        count[aggAttr] = {};
      }
      if (count[aggAttr][item]) {
        count[aggAttr][item] += 1;
      } else {
        count[aggAttr][item] = 1;
      }
    });
  });
  return count;
}

/**
 * shape counted object to array
 * @param  {Object} counted { aggAttr: [ { item: count } ] }
 * @return {Object} { aggAttr: [ { attr: string, count: int } ] }
 */
function shape(counted) {
  const shaped = {};
  Object.keys(counted).forEach(aggAttr => {
    shaped[aggAttr] = Object.keys(counted[aggAttr]).map(item => ({
      attr: item,
      count: counted[aggAttr][item]
    }));
  });
  return shaped;
}

/**
 * @param  {array} data
 * @param  {array} aggAttrs
 * @return {array} [{attr: string, count: int}]
 */
function aggregate(data, aggAttrs) {
  const preparedAggs = prepareAggs(data, aggAttrs);
  const counted = countItem(preparedAggs);
  return shape(counted);
}

module.exports = aggregate;
