import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import { SelectMenuItem } from './types/selectMenuItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './services/data.service';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {LongNamePipe} from './pipes/long-name.pipe';
import { combineLatest } from 'rxjs/observable/combineLatest';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataService, LongNamePipe]
})
export class AppComponent implements OnDestroy {
  @Output() formChanged: EventEmitter<any> = new EventEmitter();

  title = 'custom-select';
  form: FormGroup;
  test: FormGroup;

  undefinedValue: undefined;
  nullValue: undefined;

  options = Array<SelectMenuItem>(
    { value: null, title: 'Ford' },
    { value: {}, title: 'Kia' },
    { value: Infinity, title: 'BMW' }
  );

  brandOptions  = [];
  modelOptions = [];
  yearOptions = [];
  generationOptions = [];

  modelSub: Subscription;
  yearSub: Subscription;
  generationSub: Subscription;
  fullAutoNameSub: Subscription;
  formChangedSub: Subscription;

  constructor(fb: FormBuilder, private dataService: DataService, private longNamePipe: LongNamePipe) {
    this.form = fb.group({
      fullAutoName: '',
      brand: null,
      model: null,
      year: null,
      generation: null,
    });

    this.test = fb.group( {
      emptyList: null,
      multiSelect: this.options[0],
      undefinedValue: undefined,
      nullValue: null
    });

    this.brandOptions = this.dataService.getBrandOptions();

    const brand$ = this.form.get('brand').valueChanges;
    const model$ = this.form.get('model').valueChanges;
    const year$ = this.form.get('year').valueChanges;

    const modelCombined$ = combineLatest(brand$, (brand) => {
      brand ? this.modelOptions = this.dataService.getModelOptionsByBrand(brand) : this.modelOptions = null;
      return this.modelOptions;
    });
    const yearCombined$ = combineLatest(brand$, model$, (brand, model) => {
      brand && model ? this.yearOptions = this.dataService.getYearOptionsByModel(model) : this.yearOptions = null;
      return this.yearOptions;
    });
    const generationCombined$ = combineLatest(brand$, model$, year$, (brand, model, year) => {
      brand && model && year ? this.generationOptions = this.dataService.getGenerationByYear(year) : this.generationOptions = null;
      return this.generationOptions;
    });

    this.modelSub = modelCombined$.subscribe(val => {
      console.log(val);
    });
    this.yearSub = yearCombined$.subscribe(val => {
      console.log(val);
    });
    this.generationSub = generationCombined$.subscribe(val => {
      console.log(val);
    });

    this.fullAutoNameSub = this.form.get('fullAutoName').valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      if (val) {
        const parsed = this.dataService.parseDataFromName(val);
        this.form.patchValue(parsed, {emitEvent: true});
        this.formChanged.emit(this.form.value);
      }
    });

    this.formChangedSub = this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(val => {
      this.setFullName();
    });
  }

  setFullName() {
    const result = this.longNamePipe.transform(this.form.value, ['brand', 'model', 'generation'], 'title');
    this.form.patchValue({fullAutoName: result}, {emitEvent: false});
  }

  ngOnDestroy() {
    if (this.modelSub) {
      this.modelSub.unsubscribe();
    }
    if (this.yearSub) {
      this.yearSub.unsubscribe();
    }
    if (this.generationSub) {
      this.generationSub.unsubscribe();
    }
    if (this.fullAutoNameSub) {
      this.fullAutoNameSub.unsubscribe();
    }
    if (this.formChangedSub) {
      this.formChangedSub.unsubscribe();
    }
  }
}
