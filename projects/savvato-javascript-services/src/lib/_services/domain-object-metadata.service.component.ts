import { NgModule, Component } from '@angular/core';
import { DomainObjectMetadataService } from './domain-object-metadata.service';


// The point of this module is to provide an instance of the DomainObjectMetadataService
//  for use in testing.



@Component({
  selector: 'domainobjectmetadataservicecomponent',
  template: `<div></div>`
})
export class DomainObjectMetadataServiceComponent {
	constructor(private srvc: DomainObjectMetadataService) {

	}

	getService(): DomainObjectMetadataService {
		return this.srvc;
	}
}

@NgModule({
	declarations: [ DomainObjectMetadataServiceComponent ],
	providers: [ DomainObjectMetadataService ]
})

// ENSURE TESTS STILL PASS

/* tslint:disable */ class DomainObjectMetadataServiceComponentModule { } /* tslint:enable */