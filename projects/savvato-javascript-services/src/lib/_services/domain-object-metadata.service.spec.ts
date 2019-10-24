import { TestBed } from '@angular/core/testing';

import { DomainObjectMetadataServiceComponent } from './domain-object-metadata.service.component'
import { DomainObjectMetadataService } from './domain-object-metadata.service';

describe('DomainObjectMetadata Service', () => {

	let fixture;
	let component;

	let primaryDomainObject = {id: 7, superFakeCalculatedValue: 'A7BB3EF'};
  let domainObject1 = {id: 1, text: "one"};
	let domainObject2 = {id: 2, text: "two"};

  	beforeEach(() => {
  		TestBed.configureTestingModule({
  		declarations: [
  			DomainObjectMetadataServiceComponent
  		],
  		providers: [
  			DomainObjectMetadataService
  		]});

  		fixture = TestBed.createComponent(DomainObjectMetadataServiceComponent);
		  component = fixture.componentInstance;
	});

  let primaryDomainObjectProvider = {get: () => primaryDomainObject};

  let _getInitializedService = (pdo?: any) => {
    if (!pdo) pdo = primaryDomainObject;

    let service = component.getService();
    service.init({get: () => pdo})

    return service;
  }


  it('should be created', () => {
    expect(component instanceof DomainObjectMetadataServiceComponent).toBe(true);

    let service = component.getService();
    expect(service instanceof DomainObjectMetadataService).toBe(true);
  });


  it('should return undefined if called before setting any functions', () => {
    let service = component.getService();
    let offer = service.getMetadataValue(domainObject1, "a_fake_function_key");
    expect(offer).toBe(undefined);
  })

  it('should return undefined if called with a function key that has not been defined', () => {
    let service = component.getService();
    let functionKey = "funcKey";

  	service.addMetadataCalculationFunction(functionKey, jasmine.createSpy("func"));

    let offer = service.getMetadataValue(domainObject1, "a_fake_function_key");
    expect(offer).toBe(undefined);
  })

  it('should return valid Promise if called with a function key that has been defined', () => {
    let service = _getInitializedService();
    let functionKey = "funcKey";

  	service.addMetadataCalculationFunction(functionKey, (domainObject) => {
		    return new Promise((resolve, reject) => { domainObject["text"] += "happy"; resolve(domainObject); });
	  });

    let oldValue = domainObject1["text"];
    let result = service.getMetadataValue(domainObject1, functionKey);

    expect(result).not.toBe(undefined);
    expect(result instanceof Promise).toBe(true);
    result.then((transformedDomainObject) => { expect(transformedDomainObject["text"]).toBe(oldValue + "happy"); });
  })

  let _func1 = (len, func) => {
	    // given
      let service = _getInitializedService();

	    let spy = jasmine.createSpy("foo");
	    let functionKey = "funcKey";

	  	service.addMetadataCalculationFunction(functionKey, spy);
	  	service.setCachedValueValidityDuration(len);
	  	expect(spy.calls.count()).toEqual(0);

	    // when
      service.getMetadataValue(domainObject1, functionKey);

	    // then
	    // wait, then execute our function
	    setTimeout(() => {
	    	service.getMetadataValue(domainObject1, functionKey);
	    	func(spy);
	    }, 2000);
	}

  it('should call the metadata function again if its cached data has existed longer than the cache validity duration', () => {
  		_func1(750, (spy) => {
	    	expect(spy.calls.count()).toBeGreaterThan(1);
	    });
  })

  it('should not call the metadata function again if its cached data has not existed longer than the cache validity duration', () => {
  		_func1(15000, (spy) => {
    		expect(spy.calls.count()).toEqual(1);
    	});
  })

  it('should reset its data, but not its functions when init() is called', () => {
    let service = _getInitializedService();

  	let spy = jasmine.createSpy("foo")
  	let functionKey = "funcKey";

  	service.addMetadataCalculationFunction(functionKey, spy);

    let offer = service.getMetadataValue(domainObject1, functionKey);
    expect(spy).toHaveBeenCalled();
    expect(offer).not.toBe(undefined);
    expect(offer instanceof Promise).toBe(true);

    service.init(primaryDomainObjectProvider);

    spy.calls.reset();

    offer = service.getMetadataValue(domainObject1, functionKey);
    expect(spy).toHaveBeenCalled();
    expect(offer).not.toBe(undefined); // this would be undefined if the function did not exist, as a previous test confirms
    expect(offer instanceof Promise).toBe(true);
  })

  it('causes an error when you try to init with no domainObjectProvider', () => {
    
  })

  it('causes an error when you init with a domainObjectProvider, then try to init again with no domainObjectProvider', () => {
    
  })

  it('should reset a single object when markDirty() is called', () => {
    let service = _getInitializedService();

  	let spy = jasmine.createSpy("foo")
  	let functionKey = "funcKey";

  	service.addMetadataCalculationFunction(functionKey, spy);

    let offer = service.getMetadataValue(domainObject1, functionKey);
    expect(spy).toHaveBeenCalled();
    expect(offer).not.toBe(undefined);
    expect(offer instanceof Promise).toBe(true);

    spy.calls.reset();

    offer = service.getMetadataValue(domainObject2, functionKey);
    expect(spy).toHaveBeenCalled();
    expect(offer).not.toBe(undefined);
    expect(offer instanceof Promise).toBe(true);

    service.markDirty({ domainObject: domainObject1 });

    spy.calls.reset();

    offer = service.getMetadataValue(domainObject1, functionKey);
    expect(spy).toHaveBeenCalled();

	spy.calls.reset();

	offer = service.getMetadataValue(domainObject2, functionKey);
    expect(spy).not.toHaveBeenCalled();
  })

  it('should from then on use the given provider when init is called', () => {

  })

});
