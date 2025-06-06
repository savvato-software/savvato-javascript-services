import { NgModule, Component } from '@angular/core';
import { FunctionPromiseService } from './function-promise.service';


// The point of this module is to provide an instance of the FunctionPromiseService
//  for use in testing.



@Component({
    selector: 'functionpromiseservicecomponent',
    template: `<div></div>`,
    standalone: false
})
export class FunctionPromiseServiceComponent {
	constructor(private srvc: FunctionPromiseService) {

	}

	getService(): FunctionPromiseService {
		return this.srvc;
	}
}

@NgModule({
	declarations: [ FunctionPromiseServiceComponent ],
	providers: [ FunctionPromiseService ]
})

// ENSURE TESTS STILL PASS

/* tslint:disable */ class FunctionPromiseServiceComponentModule { } /* tslint:enable */