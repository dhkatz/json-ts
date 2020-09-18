import { ICustomConverter } from '../../src';

export const DateConverter: ICustomConverter<Date> = {
  fromJson(data: any): Date {
    return new Date(data);
  },
  
  toJson(data: Date): any {
    return 'some-date';
  }
};
