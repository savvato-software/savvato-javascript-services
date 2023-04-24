import { NgModule, ModuleWithProviders } from '@angular/core';
import { SavvatoJavascriptServicesComponent } from './savvato-javascript-services.component';

import { FunctionPromiseService } from './_services/function-promise.service'
import { ModelTransformingService } from './_services/model-transforming.service'
import { SequenceService } from './_services/sequence.service'
import { StorageService} from "./_services/storage/storage.service";
import { JWTApiService } from "./_services/api/api.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    SavvatoJavascriptServicesComponent
  ],
  // imports: [
  //   HttpClientModule
  // ],
  exports: [
    SavvatoJavascriptServicesComponent,
  ]
})
export class SavvatoJavascriptServicesModule {
  static forRoot(): ModuleWithProviders<NgModule> {
    return {
      ngModule: SavvatoJavascriptServicesModule,
      providers: [
        JWTApiService,
        FunctionPromiseService,
        ModelTransformingService,
        SequenceService,
        StorageService
      ]
    }
  }
}
