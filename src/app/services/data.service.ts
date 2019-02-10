import {Injectable} from '@angular/core';
import {MODEL_OPTIONS} from '../data/modelOptions';
import {YEAR_OPTIONS} from '../data/yearOptions';
import {SelectMenuItem} from '../types/selectMenuItem';
import {GENERATION_OPTIONS} from '../data/generationOptions';

@Injectable()
export class DataService {

  allModels = MODEL_OPTIONS;
  allYears = YEAR_OPTIONS;
  allGenerations = GENERATION_OPTIONS;
  allBrands = Array<SelectMenuItem>(
    { value: 1, title: 'Ford' },
    { value: 2, title: 'Kia' },
    { value: 3, title: 'BMW' },
    { value: 4, title: 'Audi' }
  );

  public getBrandOptions() {
    return this.allBrands;
  }

  public getModelOptionsByBrand(brand) {
    for (const key in this.allModels) {
      if (this.allModels[key].value === brand.value) {
        return this.allModels[key].options;
      }
    }
  }

  public getYearOptionsByModel(model) {
    if (model) {
      for (const key in this.allYears) {
        for (const m in this.allYears[key]) {
          if (m === model.title) {
            return this.allYears[key][m].options;
          }
        }
      }
    } else {
      return null;
    }
  }

  public getGenerationByYear(year) {
    for (const key in this.allGenerations) {
      const splitted = key.split('-');
      if (year.value >= splitted[0] && year.value <= splitted[1]) {
        return this.allGenerations[key].options;
      }
    }
  }

  private getModelByName(name: string) {
    for (const item in this.allModels) {
      for (const option in this.allModels[item].options) {
        if ((this.allModels[item].options[option] as SelectMenuItem).title === name) {
          return this.allModels[item].options[option];
        }
      }
    }
    return null;
  }

  private getGenerationByName(name: string) {
    for (const item in this.allGenerations) {
      for (const option in this.allGenerations[item].options) {
        if ((this.allGenerations[item].options[option] as SelectMenuItem).title === name) {
          return this.allGenerations[item].options[option];
        }
      }
    }
    return null;
  }

  public parseDataFromName(name: string) {
    const result = {
      brand: null,
      model: null,
      generation: null
    };
    const splitted = name.split(' ');
    if (splitted[0]) {
      result.brand = this.allBrands.find(item => item.title.toLowerCase() === splitted[0].toLowerCase());
    }
    if (splitted[1]) {
      result.model = this.getModelByName(splitted[1]);
    }
    if (splitted[2]) {
      result.generation = this.getGenerationByName(splitted[2]);
    }
    return result;
  }
}
