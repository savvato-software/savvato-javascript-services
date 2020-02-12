import { NgModule, Component } from '@angular/core';
import { ModelTransformingService } from './model-transforming.service';


// The point of this module is to provide an instance of the ModelTranformingService
//  for use in testing.


@Component({
  selector: 'modeltransformingservicecomponent',
  template: `<div></div>`
})
export class ModelTransformingServiceComponent {
	constructor(private srvc: ModelTransformingService) {

	}

	getService(): ModelTransformingService {
		return this.srvc;
	}
}

@NgModule({
	declarations: [ ModelTransformingServiceComponent ],
	providers: [ ModelTransformingService ]
})

/* tslint:disable */ class ModelTransformingServiceComponentModule { } /* tslint:enable */