'use strict';

class RefPromise {
  constructor({key, run}) {
    this._key = key;
    this._conections = [];
    this._resolved = [];
    this._seen = [];
    this._run = run;
  }

  get connections() {
    return this._conections;
  }

  get key() {
    return this._key;
  }

  inject(node) {
    this._conections.push(node);
  }

  run(dependencies={}){
    return this._run(dependencies);
  }

  async start() {
    let results = {};

    const dependencies = node => {
      this._seen.push(node);
      node.connections.map(connection=> {
        if(this._resolved.find(e=>e.key===connection.key)){
          return;
        }
        if(this._seen.find(e=>e.key===connection.key)){
          throw `Circular reference detected (${connection.key})`;
        }
        dependencies(connection);
      });
      this._resolved.push(node);
      this._seen = this._seen.filter(el=>el.key!==node.key);
    }
    dependencies(this);

    for (let node of this._resolved) {
      const response = await node.run(results);
      results[node.key] = response;
    }

    return results;
  }
}

module.exports = RefPromise;
