import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FunctionService } from './function.service';

describe('FunctionService', () => {
    let service: FunctionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FunctionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should execute function immediately if not executed before', fakeAsync(() => {
        const testFunction = jasmine.createSpy('testFunction').and.returnValue(Promise.resolve('testResult'));
        service.executeFunction('testFunction', testFunction);
        tick();

        expect(testFunction).toHaveBeenCalled();
    }));

    it('should delay function execution if last execution was recent', fakeAsync(() => {
        const testFunction = jasmine.createSpy('testFunction').and.returnValue(Promise.resolve('testResult'));
        service.executeFunction('testFunction', testFunction);
        tick();

        // Call it again immediately
        service.executeFunction('testFunction', testFunction);
        tick();

        // The function should not be called the second time immediately
        expect(testFunction.calls.count()).toBe(1);
    }));

    it('should increase delay if last result is the same as current', fakeAsync(() => {
        const testFunction = jasmine.createSpy('testFunction').and.returnValue(Promise.resolve('sameResult'));
        service.executeFunction('testFunction', testFunction);
        tick();

        service.executeFunction('testFunction', testFunction);
        tick(2000); // Wait for the initial delay

        service.executeFunction('testFunction', testFunction);
        tick(2000); // Wait for the increased delay

        expect(testFunction.calls.count()).toBe(2); // Should be called twice, not thrice
    }));

    it('should reset delay if last result is different', fakeAsync(() => {
        let returnValue = 'result1';
        const testFunction = jasmine.createSpy('testFunction').and.callFake(() => Promise.resolve(returnValue));
        service.executeFunction('testFunction', testFunction);
        tick();

        returnValue = 'result2'; // Change return value
        service.executeFunction('testFunction', testFunction);
        tick(2000); // Wait for the initial delay

        expect(testFunction.calls.count()).toBe(2);
    }));

    it('should get last result', fakeAsync(() => {
        const testFunction = jasmine.createSpy('testFunction').and.returnValue(Promise.resolve('testResult'));
        service.executeFunction('testFunction', testFunction);
        tick();

        const result = service.getLastResult('testFunction');

        expect(result).toBe({ response: 'testResult'});
        expect(testFunction.calls.count()).toBe(1);
    }));

    it('should reset delay', fakeAsync(() => {
        const testFunction = jasmine.createSpy('testFunction').and.returnValue(Promise.resolve('sameResult'));
        service.executeFunction('testFunction', testFunction);
        tick();

        service.executeFunction('testFunction', testFunction);
        tick(2000); // Wait for the initial delay

        service.resetDelay('testFunction');
        service.executeFunction('testFunction', testFunction);
        tick(2000); // Wait for the reset delay

        expect(testFunction.calls.count()).toBe(3);
    }));

    // Add more tests as needed to cover all scenarios and edge cases
});
