[![Build Status](https://travis-ci.org/thiswallz/simple-dependency-promise.svg?branch=master)](https://travis-ci.org/thiswallz/simple-dependency-promise)
[![NPM version](https://img.shields.io/npm/v/simple-dependency-promise.svg)](https://www.npmjs.com/package/simple-dependency-promise)

# Simple dependency for promises, functions or simple processes

A basic module for sequencing and executing functions and promises with their dependencies.
It makes easy to chain and access to other promises results, if you provoke a Circular dependency, it will throw an error.


## Npm Install

```sh
npm install simple-dependency-promise --save
```

## Javascript Usage

```js
    const RefPromise = require("simple-dependency-promise");

    const a = new RefPromise({
      key: "a", 
      run(refs){return "My message : " + refs.b;}
    });
 
    const b = new RefPromise({
      key: "b", 
      run(){return "from B KEY promise";}
    });
   
    a.inject(b);

    a.start().then(res=>{
      console.log(res.a);
      //"My message : from B KEY promise
    });

```

## Using promises

## Example 1

```js
    const RefPromise = require("simple-dependency-promise");

    const a = new RefPromise({
      key: "a", 
      run(refs){
        //Here it can access to b and c results 
        return new Promise((resolve, reject) => {
          resolve({success: true, b: refs.b, c: refs.c});
        });
      }
    });
 
    const b = new RefPromise({
      key: "b", 
      run(refs){
        //Here it can access to c result 
        return new Promise((resolve, reject) => {
          resolve({success: true, c: refs.c, ip: '127.0.0.1'});
        });
      }
    });
 
    const c = new RefPromise({
      key: "c", 
      run(){
         //c cannot acces anything because of its lack of dependency
         return new Promise((resolve, reject) => {
          resolve({success: true, data: {userName: "Admin"}});
        });
      }
    });
   
    a.inject(b);
    a.inject(c);
    b.inject(c);

    a.start().then(res=>{
      console.log(res.a.success)
      //true
      console.log(res.a.b.ip)
      //127.0.0.1
      console.log(res.a.c.data.userName)
      //Admin
    });

    
```

### Example 2
```js
```

### Options

General Orchestrator features.

| F(X)          |  Params          | Return  | Detail  |
|---------------|-----------------|---------|---------|
| start      |  | promise  | This method starts to chain javascript promises|
| inject      | RefPromise object | void  | This method add a dependency to the process|

Add() method options.

| Properties              | Type    | Detail  |
|-------------------------|---------|---------|
| key | string |   this is the key name of the process, keep it unique |
| run(refs)                   | function | Main method, you have to return a promise/function/object here|
| refs | object | This param contains the data of your promises if you injected it|


## Tests

```sh
npm test
```

## License

  MIT
