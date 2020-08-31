import * as utils from './utils';

describe('unique', function(){
  it('generates unique array when there are duplicates', function(){
    var arr = [1,1,2,2,3,3];
    var out = utils.unique(arr);
    expect(out).toEqual([1,2,3]);
    expect(out).not.toEqual(arr);
  });

  it('generates same array when there are no duplicates', function(){
    var arr = [1,2,3];
    var out = utils.unique(arr);
    expect(out).toEqual(arr);
  })

  it('uniqueness is guaranteed for unordered lists', function(){
    var arr = [1,2,3,1,2,3];
    var out = utils.unique(arr);
    expect(out.sort()).toEqual([1,2,3]);
  })
});

describe('flatten', function(){
  it('generates flat array from flat input', function(){
    var arr = [1,1,2,2,3,3];
    var out = utils.flatten(arr);
    expect(out).toEqual(arr);
  });

  it('generates flat array from nested input', function(){
    var arr = [1,[1,2,2],[3],3];
    var out = utils.flatten(arr);
    expect(out).toEqual([1,1,2,2,3,3]);
  });
});

describe('deepCopy', function(){
  it('works for objects', function(){
    var o = {a:1,b:{c:2,d:3}};
    var o2 = utils.deepCopy(o);
    o2.b.c = 4;
    expect(o.b.c).toBe(2);
  });
  it('works for objects with arrays', function(){
    var o = {a:1,b:[2,3]};
    var o2 = utils.deepCopy(o);
    o2.b[0] = 4;
    expect(JSON.stringify(o2.b)).toBe(JSON.stringify([4,3]));
    expect(o.b[0]).toBe(2);
  });
  it('works for objects with functions', function(){
    var c = 0;
    var o = {a:1, b:function(){c=2}};
    var o2 = utils.deepCopy(o);
    o2.b = function(){ c = 1 }
    o.b();
    expect(c).toBe(2);
    o2.b();
    expect(c).toBe(1);
  })
})
