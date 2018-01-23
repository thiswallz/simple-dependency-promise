const chai = require('chai');
chai
    .use(require('chai-things'))
    .use(require('chai-as-promised'));
const expect = chai.expect; 
const assert = chai.assert; 
const RefPromise = require("../");


describe('create a simple promise', () => {

  it('new RefPromise should be return an object', () => {
    const refPromise = new RefPromise({
      key: "myName", 
      run(){return true;}
    });

    expect(refPromise).to.be.a('object');
  });

});


describe('start method', () => {

  it('start should be return an object with the promises results', async () => {
    const a = new RefPromise({
      key: "a", 
      run(){return true;}
    });

    const res = await a.start();
    expect(res.a).to.equal(true)

  });


});

describe('dependencies', () => {

  it('start should be return the promises with their dependencies data', async () => {
    const a = new RefPromise({
      key: "a", 
      run(refs){return "My message : " + refs.b;}
    });
 
    const b = new RefPromise({
      key: "b", 
      run(){return "from B KEY promise";}
    });
   
    a.inject(b);

    const res = await a.start();
    expect(res.a).to.equal("My message : from B KEY promise")

  });
});

describe('multiple dependencies', () => {

  it('start should be return the message with their dependencies messages', async () => {
    const a = new RefPromise({
      key: "a", 
      run(refs){return `a key message : ${refs.b} & ${refs.c}`;}
    });
 
    const b = new RefPromise({
      key: "b", 
      run(refs){return `B & ${refs.c}`;}
    });
 
    const c = new RefPromise({
      key: "c", 
      run(){return "C";}
    });
   
    a.inject(b);
    a.inject(c);
    b.inject(c);
    
    const aKeyRes = await a.start();
    expect(aKeyRes.a).to.equal("a key message : B & C & C");

    const bKeyRes = await b.start();
    expect(bKeyRes.b).to.equal("B & C");

  });

  it('start should be return the data with the data injected(dependencies)', async () => {
    const a = new RefPromise({
      key: "a", 
      run(refs){
        return new Promise((resolve, reject) => {
          resolve({success: true, b: refs.b, c: refs.c});
        });
      }
    });
 
    const b = new RefPromise({
      key: "b", 
      run(refs){
        return new Promise((resolve, reject) => {
          resolve({success: true, c: refs.c, ip: '127.0.0.1'});
        });
      }
    });
 
    const c = new RefPromise({
      key: "c", 
      run(){
         return new Promise((resolve, reject) => {
          resolve({success: true, data: {userName: "Admin"}});
        });

      }
    });
   
    a.inject(b);
    a.inject(c);
    b.inject(c);
    
    const res = await a.start();
    return expect(res.a).to.have.own.property('success', true)
      && expect(res.a.b).to.have.own.property('ip', '127.0.0.1')
      && expect(res.a.c.data).to.have.own.property('userName', 'Admin');
  });
});

describe('circle dependencies', () => {

  it('start should be return an error', async () => {
    const a = new RefPromise({
      key: "a", 
      run(refs){return `a key message : ${refs.b}`;}
    });
 
    const b = new RefPromise({
      key: "b", 
      run(refs){return `b key message : ${refs.a}`;}
    });
 
   
    a.inject(b);
    b.inject(b);
    
    try{
      const res = await a.start();
    }catch(err){
      return expect(err).to.equal("Circular reference detected (b)");
    }

  });


});

