import { NgModule, ModuleWithProviders } from '@angular/core';
import { SavvatoJavascriptServicesComponent } from './savvato-javascript-services.component';

import { ApiService } from './_services/api.service'
import { CareerGoalService } from './_services/career-goal.service'
import { FunctionPromiseService } from './_services/function-promise.service'
import { ModelTransformingService } from './_services/model-transforming.service'
import { SequenceService } from './_services/sequence.service'

@NgModule({
  declarations: [
  	SavvatoJavascriptServicesComponent
  ],
  imports: [
  	
  ],
  exports: [
  	SavvatoJavascriptServicesComponent,
  ]
})
export class SavvatoJavascriptServicesModule { 
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SavvatoJavascriptServicesModule,
			providers: [ 
        ApiService,
        CareerGoalService,
        FunctionPromiseService,
        ModelTransformingService,
        SequenceService
      ]
		}
	}
}
