import test from 'ava';
import aggregate from '../src/aggregate';

function assert(t, testdata) {
  const agg = aggregate(testdata.data, testdata.aggAttr);
  t.deepEqual(agg, testdata.expect);
}

test('single data', t => {
  const testdata = {
    data: [{ tags: ['a', 'b'] }],
    aggAttr: ['tags'],
    expect: {
      tags: [{ attr: 'a', count: 1 }, { attr: 'b', count: 1 }]
    }
  };
  assert(t, testdata);
});

test('multiple data', t => {
  const testdata = {
    data: [{ tags: ['a', 'b', 'c'] }, { tags: ['a', 'b', 'd'] }],
    aggAttr: ['tags'],
    expect: {
      tags: [
        { attr: 'a', count: 2 },
        { attr: 'b', count: 2 },
        { attr: 'c', count: 1 },
        { attr: 'd', count: 1 }
      ]
    }
  };
  assert(t, testdata);
});

test('multiple attrs', t => {
  const testdata = {
    data: [{ tags: ['a', 'b'], category: ['A', 'B'] }],
    aggAttr: ['tags', 'category'],
    expect: {
      category: [{ attr: 'A', count: 1 }, { attr: 'B', count: 1 }],
      tags: [{ attr: 'a', count: 1 }, { attr: 'b', count: 1 }]
    }
  };
  assert(t, testdata);
});

test('ignore unset attr', t => {
  const testdata = {
    data: [{ tags: ['a', 'b'], category: ['A', 'B'] }],
    aggAttr: ['tags'],
    expect: {
      tags: [{ attr: 'a', count: 1 }, { attr: 'b', count: 1 }]
    }
  };
  assert(t, testdata);
});

test('multiple data, multiple attrs', t => {
  const testdata = {
    data: [
      { tags: ['a', 'b', 'c'], category: ['A', 'B', 'C'] },
      { tags: ['a', 'b', 'd'], category: ['A', 'B', 'D'] }
    ],
    aggAttr: ['tags', 'category'],
    expect: {
      tags: [
        { attr: 'a', count: 2 },
        { attr: 'b', count: 2 },
        { attr: 'c', count: 1 },
        { attr: 'd', count: 1 }
      ],
      category: [
        { attr: 'A', count: 2 },
        { attr: 'B', count: 2 },
        { attr: 'C', count: 1 },
        { attr: 'D', count: 1 }
      ]
    }
  };
  assert(t, testdata);
});
