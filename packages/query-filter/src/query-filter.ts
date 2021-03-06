import {FilterType, QueryFilterSchema, QueryInterface, SortInterface, TransformCallable} from './interfaces';
import * as _ from 'lodash';

class QueryFilter {

  createQuery(schema: QueryFilterSchema, rawParams: Object): QueryInterface {
    const normalizedParams = this.normalize(rawParams);
    let where = this.create(schema, normalizedParams);

    if (schema.allowOrOperator && rawParams['$or']) {
      const orQuery: Object[] = [];
      rawParams['$or'].forEach((orParams: Object) => {
        orQuery.push(this.create(schema, orParams));
      });
      where['$or'] = orQuery;
    }

    return {
      where: where,
      limit: this.getLimit(rawParams, schema.defaultLimit),
      skip: this.getSkip(rawParams),
      sort: this.getSort(schema, rawParams)
    };
  }

  getLimit(rawParams: Object, defaultValue: number): number {
    const limit = parseInt(rawParams['$limit'], 10);
    const lower = !Number.isNaN(limit) && limit > 0 ? limit : defaultValue;
    return Math.min(lower, defaultValue);
  }

  getSkip(rawParams: Object): number {
    const skip = rawParams['$skip'];
    if (typeof skip !== 'undefined') {
      const result = Math.abs(parseInt(skip, 10));
      return _.isNaN(result) ? 0 : result;
    }
    return 0;
  }

  getSort(schema: QueryFilterSchema, rawParams: Object): SortInterface {
    let sort = rawParams['$sort'];
    const result = {};
    if (typeof sort !== 'object') {
      return null;
    }
    sort = _.pick(sort, _.keys(schema.properties));
    _.forEach(sort, (value: any, key: any) => {
      let filterSchema = schema.properties[key];
      if (filterSchema.sort) {
        const parsed = parseInt(value, 10);
        if (parsed === 1 || parsed === -1) {
          result[filterSchema.property_path] = parsed;
        }
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  }

  protected create(schema: QueryFilterSchema, rawParams: Object): Object {
    const query = {};
    const params = _.pick(rawParams, _.keys(schema.properties));
    _.forEach(params, (value: any, key: any) => {
      const filterSchema = schema.properties[key];
      _.keys(value)
        .filter((item: FilterType) => filterSchema.operators.indexOf(item) !== -1)
        .forEach((item: FilterType) => {
          let transformed = value[item];
          if (filterSchema.transformers) {
            transformed = filterSchema.transformers.reduce((value: any, transformer: TransformCallable) => {
              return transformer(value);
            }, transformed);
          }
          query[filterSchema.property_path] = {[item]: transformed};
        })
      ;
    });

    return query;
  }

  protected normalize(rawQuery: Object): Object {
    const normalized = {};
    _.forEach(rawQuery, (value: any, key: any): void => {
      if (typeof value !== 'object') {
        normalized[key] = {'$eq': value};
      }  else {
        normalized[key] = value;
      }
    });

    return normalized;
  }
}

export const queryFilter = new QueryFilter();