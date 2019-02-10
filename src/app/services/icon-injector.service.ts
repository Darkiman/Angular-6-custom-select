import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

const SVG_PATH = './../assets/';

@Injectable()
export class IconInjectorService {

  constructor(private matIconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
  }

  public injectIcon(name: string, svgPath?: string, iconFullName?: string) {
    this.matIconRegistry
      .addSvgIcon(name,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `${svgPath ? svgPath : SVG_PATH}/icons/${iconFullName ? iconFullName : name + '.svg'}`));
  }
}
