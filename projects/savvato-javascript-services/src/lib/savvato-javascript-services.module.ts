import { NgModule, ModuleWithProviders } from '@angular/core';
import { SavvatoJavascriptServicesComponent } from './savvato-javascript-services.component';

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
  static forRoot(): ModuleWithProviders<NgModule> {
    return {
      ngModule: SavvatoJavascriptServicesModule,
      providers: [
        CareerGoalService,
        FunctionPromiseService,
        ModelTransformingService,
        SequenceService
      ]
    }
  }
}
