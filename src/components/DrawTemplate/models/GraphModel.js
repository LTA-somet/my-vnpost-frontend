import ConvertUnit from '../utils/ConvertUnit';
import TextNodeModel from './TextNodeModel';
import ObjectMerge from '../utils/ObjectMerge';
import { pageSizeOptions } from '../utils/constant';
export default class GraphModel {
  constructor(data = {}) {
    this._pageSize = data.pageSize || 'custom';
    this._width = data.width || 19;
    this._height = data.height || 13;
    // this._landscape = true;
    this._landscape = data.landscape === true;
    this._ppi = data.ppi || 96;
    this._unit = data.unit || 'cm';
    this._fill = data.fill || '#ffffff';
    this._image = data.image || '/vb-scan.jpg';
    this._marginTop = data.marginTop || 0;
    this._marginLeft = data.marginLeft || 0;
    this._marginBottom = data.marginBottom || 0;
    this._marginRight = data.marginRight || 0;
    this.items = [];
    this.__getItemModels(data.items);
  }

  set pageSize(val) {
    this._pageSize = val;
  }

  get pageSize() {
    return this._pageSize;
  }

  get landscape() {
    return this._landscape;
  }

  set landscape(val) {
    this._landscape = val;
  }

  get size() {
    return this.pageSize === 'custom'
      ? [this._width, this._height]
      : pageSizeOptions.find((c) => c.value === this.pageSize).size;
  }

  set width(val) {
    this._width = val;
    this.pageSize = 'custom';
  }

  get width() {
    return ConvertUnit.convert(
      this.landscape ? Math.max(...this.size) : Math.min(...this.size),
      this.pageSize === 'custom' ? this.unit : 'mm',
      this.unit,
      this.ppi,
    );
  }

  get height() {
    return ConvertUnit.convert(
      this.landscape ? Math.min(...this.size) : Math.max(...this.size),
      this.pageSize === 'custom' ? this.unit : 'mm',
      this.unit,
      this.ppi,
    );
  }

  set height(val) {
    this._height = val;
    this.pageSize = 'custom';
  }

  get ppi() {
    return this._ppi;
  }

  set ppi(val) {
    this._ppi = val;
  }

  get unit() {
    return this._unit;
  }

  set unit(val) {
    this._unit = val;
  }

  get fill() {
    return this._fill;
  }

  set fill(val) {
    this._fill = val;
  }

  get image() {
    return this._image;
  }

  set image(val) {
    this._image = val;
  }

  get marginTop() {
    return this._marginTop;
  }

  set marginTop(val) {
    this._marginTop = val;
  }

  get marginRight() {
    return this._marginRight;
  }

  set marginRight(val) {
    this._marginRight = val;
  }

  get marginBottom() {
    return this._marginBottom;
  }

  set marginBottom(val) {
    this._marginBottom = val;
  }

  get marginLeft() {
    return this._marginLeft;
  }

  set marginLeft(val) {
    this._marginLeft = val;
  }

  get pxWidth() {
    return ConvertUnit.unit2Px(this.width, this.unit, this.ppi);
  }

  get pxHeight() {
    return ConvertUnit.unit2Px(this.height, this.unit, this.ppi);
  }

  get pxMarginTop() {
    return ConvertUnit.unit2Px(this.marginTop, this.unit, this.ppi);
  }

  get pxMarginRight() {
    return ConvertUnit.unit2Px(this.marginRight, this.unit, this.ppi);
  }

  get pxMarginBottom() {
    return ConvertUnit.unit2Px(this.marginBottom, this.unit, this.ppi);
  }

  get pxMarginLeft() {
    return ConvertUnit.unit2Px(this.marginLeft, this.unit, this.ppi);
  }

  __getItemModels(items = []) {
    this.items = items.map((item) => {
      return new TextNodeModel(item);
    });
  }

  removeNode(id) {
    this.items = this.items.filter((c) => c.id !== id);
  }

  addNode(data) {
    const newItem = new TextNodeModel(data);
    this.items = [...this.items, newItem];
    return newItem;
  }

  updateNode(data) {
    var { id, config } = data;
    if (!id) return;
    var item = this.items.find((c) => c.id === id);
    if (!item) return;
    if (config && typeof config === 'object') {
      ObjectMerge.merge(data.config, item.config);
    } else {
      ObjectMerge.merge(data, item);
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject() {
    return {
      width: this._width,
      height: this._height,
      landscape: this._landscape,
      ppi: this._ppi,
      unit: this._unit,
      pageSize: this._pageSize,
      marginTop: this._marginTop,
      marginRight: this._marginRight,
      marginBottom: this._marginBottom,
      marginLeft: this._marginLeft,
      image: this._image,
      fill: this._fill,
      items: this.items.map((item) => {
        return item.toObject();
      }),
    };
  }
}
