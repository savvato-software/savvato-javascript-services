import { NgModule, ModuleWithProviders } from '@angular/core';
import { SavvatoJavascriptServicesComponent } from './savvato-javascript-services.component';

import { FunctionPromiseService } from './_services/function-promise.service'

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
        FunctionPromiseService
      ]
		}
	}
}
