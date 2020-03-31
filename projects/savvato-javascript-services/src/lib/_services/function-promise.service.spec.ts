import { TestBed } from '@angular/core/testing';

import { FunctionPromiseServiceComponent } from './function-promise.service.component';
import { FunctionPromiseService } from './function-promise.service';

describe('FunctionPromise Service', () => {

	let fixture;
	let component;

	beforeEach(() => {
		TestBed.configureTestingModule({
		declarations: [
			FunctionPromiseServiceComponent
		],
		providers: [
			FunctionPromiseService
		]});

  	fixture = TestBed.createComponent(FunctionPromiseServiceComponent);
		component = fixture.componentInstance;
	});


  it('should be created', () => {
    expect(component instanceof FunctionPromiseServiceComponent).toBe(true);

    let service = component.getService();
    expect(service instanceof FunctionPromiseService).toBe(true);
  });


  it('should return undefined if called before setting any function/key pairs', () => {
    let service = component.getService();

    let resultKey = "resultKey";
    let funcKey = "funcKey";
    let data = {foo: 1, bar: 17};

    let offer = service.get(resultKey, funcKey, data);
    expect(offer).toBe(undefined);
  })

  it('should reset only the expected results when called to reset fuzzily', (done) => {
    
    // TODO.. couldn't get tests to run when I wrote this. Run it, be sure that it works.

    let service = component.getService();

    let resultKey1 = "resultKey1";
    let funcKey1 = "funcKey1";

    let resultKey2 = "resultKey2";
    let funcKey2 = "funcKey2";

    let func1 = (data) => { return new Promise((resolve, reject) => { resolve("func1" + data['val']); })}
    let func2 = (data) => { return new Promise((resolve, reject) => { resolve("func2" + data['val']); })}

    service.initFunc(funcKey1, func1);
    service.initFunc(funcKey2, func2);

    let result = undefined;

    service.waitAndGet(resultKey1 + "A", funcKey1, {val: '-1stCall'}).then((result) => {
      service.waitAndGet(resultKey1 + "B", funcKey1, {val: '-1stCall'}).then((result2) => {
        service.waitAndGet(resultKey2 + "A", funcKey2, {val: '-1stCall'}).then((result3) => {
          expect(service.get(resultKey1+"A")).not.toBe(undefined);
          expect(service.get(resultKey1+"B")).not.toBe(undefined);
          expect(service.get(resultKey2+"A")).not.toBe(undefined);

          service.resetFuzzily(resultKey1);

          expect(service.get(resultKey1+"A")).toBe(undefined);
          expect(service.get(resultKey1+"B")).toBe(undefined);
          expect(service.get(resultKey2+"A")).not.toBe(undefined);

          done();
        })
      })
    })
  })

  xit('calls our given function as expected considering the cache expiration time passing', (done) => {
    let service = component.getService();

    let resultKey = "resultKey";
    let funcKey = "funcKey";
    let data = {foo: 1, bar: 17};

    let count = 0;
    let func = { func: (data) => { return new Promise((resolve, reject) => { resolve("response " + count++); })} };

  })

});
