'use strict';
const {identity} from 'lodash';

// 共通設定の取得/設定手段を提供
// schemaに渡せる形式は次の通り
//   { <key>: <type> }
//   または
//   { <key>: { type: <type>, default: <defaultValue> } }
export class Storage {
  static converterMap = {
    number: [Number, String],
    string: [identity, identity],
    object: [JSON.parse, JSON.stringify],
    array: [JSON.parse, JSON.stringify],
  };

  constructor(schema) {
    this.typeInfoMap = {};
    this.cache = {};
    Object.keys(schema).forEach((key) => {
      const value = schema[key];
      const [_type, defaultValue] = typeof(value) === 'string' ?
        [value, null] :
        [value.type, value.default];
      const type = _type.toLowerCase();
      if (!this.converterMap.hasOwnProperty(type)) {
        throw new Error(`schema type '${type}' is unavailable`);
      }
      const [parse, stringify] = this.converterMap[type];
      this.typeInfoMap[key] = {parse, stringify, defaultValue};
    });
  }

  get(key) {
    if (!this.typeInfoMap.hasOwnProperty(key)) {
      throw new Error(`'${key}' is not registered`);
    }
    const typeInfo = this.typeInfoMap[key];
    let obj = null;

    if (this.cache.hasOwnProperty(key)) {
      obj = this.cache[key];
      if (!obj.modified) {
        return obj.value;
      }
    }
    else {
      obj = this.cache[key] = {};
    }
    // Note:
    //   obj.modifiedをobj.valueより先に設定してはいけない
    //   getItem()は同期的なので, ここでエラーが発生すると
    //   値を取得できていないのにobj.modifiedはfalseと言う困ったことが起こる
    const value = localStorage.getItem(key);
    obj.value = value != null ? typeInfo.parse(value) : typeInfo.defaultValue;
    obj.modified = false;
    return obj.value;
  }

  set(key, value) {
    if (!this.typeInfoMap.hasOwnProperty(key)) {
      throw new Error(`'${key}' is not registered`);
    }
    const typeInfo = this.typeInfoMap[key];

    let obj = this.cache[key] = this.cache[key] || {};
    localStorage.setItem(key, typeInfo.stringify(value));
    obj.value = value;
    obj.modified = true;
    obj.value;
  }
}

export default new Storage({
  tabsPerWindow: {
    type: 'number',
    default: 10,
  },
  rules: {
    type: 'array',
    default: [],
  }
});
