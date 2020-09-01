import * as randomization from './randomization';

describe('#shuffle', function(){
  it('should produce fixed order with mock RNG', function(){
    spyOn(Math, 'random').and.returnValue(0.5);
    var arr = [1,2,3,4,5,6];
    expect(randomization.shuffle(arr)).toEqual([1,6,2,5,3,4]);
  });
  it('large shuffle', function(){
    let arr = [];
    for(let i = 0; i < 100; i ++){
      arr[i] = i;
    }
    let shuf = randomization.shuffle(arr);
    expect(shuf).not.toEqual(arr);
    expect(shuf.sort((a, b) => a - b)).toEqual(arr);
  });
});

describe('shuffleAlternateGroups', function(){
  it('should shuffle in alternating groups', function(){
    spyOn(Math, 'random').and.returnValue(0.5);
    var toShuffle = [['a','b','c'], [1,2,3]];
    expect(randomization.shuffleAlternateGroups(toShuffle)).toEqual(['a',1,'c',3,'b',2]);
  });
})

describe('#randomID', function(){
  it('should produce ID based on mock RNG', function(){
    spyOn(Math, 'random').and.returnValues(0.1, 0.2, 0.3);
    expect(randomization.randomID(3)).toBe("37a");
  });
});

