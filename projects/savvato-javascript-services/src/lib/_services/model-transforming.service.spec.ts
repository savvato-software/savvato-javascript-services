import { TestBed } from '@angular/core/testing';

import { ModelTransformingServiceComponent } from './model-transforming.service.component';
import { ModelTransformingService } from './model-transforming.service';

describe('ModelTransforming Service', () => {

	let fixture
	let component;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				ModelTransformingServiceComponent
			],
			providers: [
				ModelTransformingService
			]
		})
	
		fixture = TestBed.createComponent(ModelTransformingServiceComponent);
		component = fixture.componentInstance;	
	});

  it('should be created', () => {
  	expect(component instanceof ModelTransformingServiceComponent).toBe(true);

    let service: ModelTransformingService = component.getService();
    expect(service instanceof ModelTransformingService).toBe(true);
  });

	it('should correctly update the model when given three variously-timed transformer functions', (done) => {
		let service = component.getService();

		let model = { };

		let transformer1 = {func: (model, fin) => { model['transformer1-result'] = 1; fin(); }}
		let transformer2 = {func: (model, fin) => { setTimeout(() => { model['transformer2-result'] = 2; fin();}, 1000);  }}
		let transformer3 = {func: (model, fin) => { model['transformer3-result'] = 3; fin(); }}

		const spy1 = spyOn(transformer1, "func").and.callThrough();
		const spy2 = spyOn(transformer2, "func").and.callThrough();
		const spy3 = spyOn(transformer3, "func").and.callThrough();

		service.addTransformer(spy1);
		service.addTransformer(spy2);
		service.addTransformer(spy3);

		service.transform(model).then((actual) => {
			expect(actual['transformer1-result']).toBe(1);
			expect(actual['transformer2-result']).toBe(2);
			expect(actual['transformer3-result']).toBe(3);

			done();
		})
	});

	it('does not recreate the returned promise more than once', () => { })
});
