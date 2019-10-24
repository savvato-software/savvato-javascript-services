import { NgModule, ModuleWithProviders } from '@angular/core';
import { SavvatoJavascriptServicesComponent } from './savvato-javascript-services.component';
import { DomainObjectMetadataService } from './_services/domain-object-metadata.service'

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
			providers: [ DomainObjectMetadataService ]
		}
	}
}
