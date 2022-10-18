import Konva from 'konva';
import GraphModel from './models/GraphModel';
import { EventEmitter } from 'events';
import ObjectMerge from './utils/ObjectMerge';
const { Stage, Layer, Image, Text, Rect } = Konva;

export default class Graph extends EventEmitter {
  constructor(container, dataStruct) {
    super();
    this._container = container;
    this._selectedItem = null;
    this._hideBackground = false;
    this._borderColor = '#ccc';
    this.backgroundColor = '#fff';
    //Init function
    this._stage = new Stage({
      container: this._container,
    });
    this.__bgLayer = new Layer();
    this.__contentLayer = new Layer();
    this.__bgRect = new Rect({
      strokeEnabled: true,
      dash: [4, 8],
      strokeWidth: 0,
    });
    this.__bgRectImage = new Image({});

    this.__bgImage = new window.Image();
    this.__bgLayer.add(this.__bgRect, this.__bgRectImage);
    this._stage.add(this.__bgLayer);
    this._stage.add(this.__contentLayer);
    this.__bgImage.onload = () => {
      this.__bgRectImage.image(this.__bgImage);
      this.__bgLayer.batchDraw();
    };
    this.__bgImage.onerror = () => {
      this.__bgRectImage.image(null);
      this.__bgLayer.batchDraw();
    };
    this._stage.on('mouseover', this.__onMouseOverStage.bind(this));
    this._stage.on('mouseout', this.__onMouseOutStage.bind(this));
    this._stage.on('contextmenu', this.__onContextMenuStage.bind(this));
    this._stage.on('click', this.__onClickStage.bind(this));
    //Context menu container
    this._menu = document.createElement('div');
    this._container.firstChild.appendChild(this._menu);
    this._menu.className = 'graph-menu';
    //loadOptions;
    if (dataStruct) {
      this.loadData(dataStruct);
    }
  }

  __init() {}

  print(values) {
    window.ipcRenderer.send('printer-preview', this._model.toObject(), values);
    window.ipcRenderer.once('printer-preview', (e, { success, failureReason }) => {
      console.log(success, failureReason);
    });
  }

  printList(list) {
    console.log('Chưa làm');
  }

  save() {}

  getThumbnail(ratio, mimeType) {
    return this._stage.toDataURL({
      pixelRatio,
      mimeType,
    });
  }

  mapDataValues(dataValues) {
    this._dataValues = dataValues;
    this.__renderNodes();
  }

  toJSON() {
    return this._model.toJSON();
  }

  toDataURL(config = {}) {
    var {
      x = 0,
      y = 0,
      width = this.width,
      height = this.height,
      pixelRatio = 1,
      mimeType = 'image/jpeg',
      quality = 1,
      hideBackground = true,
    } = config;
    return new Promise((resolve, reject) => {
      try {
        const callback = (str) => {
          if (hideBackground) {
            this.toggleBackground();
          }
          resolve(str);
        };
        if (hideBackground) {
          this.toggleBackground();
        }
        this._stage.toDataURL({ x, y, width, height, pixelRatio, mimeType, quality, callback });
      } catch (error) {
        reject(error);
      }
    });
  }

  loadData(dataStruct, dataValues) {
    if (!dataStruct) {
      this.emit('error', 'Can not load struct data. dataStruct is null or undefined');
      return;
    }
    this._model = new GraphModel(dataStruct);
    this._dataValues = dataValues;
    this.render();
  }

  toggleBackground() {
    this.__bgRectImage.visible(!this.__bgRectImage.visible());
  }

  render() {
    this.__renderBackground();
    this.__renderNodes();
  }

  updateSettings(settings) {
    ObjectMerge.merge(settings, this._model);
    this.render();
  }

  hideContextMenu() {
    const _menu = this._menu;
    while (_menu.firstChild) {
      _menu.removeChild(_menu.firstChild);
    }
    _menu.style.display = 'none';
  }

  addNode(dataType, config) {
    this._model.addNode({
      value: dataType,
      mapValues: this.hasType(dataType),
      config: config || {},
    });
    this.__renderNodes();
    this.emit('change', this._model);
  }

  updateNode(nodeData) {
    this._model.updateNode(nodeData);
    this.__renderNodes();
  }

  removeNode(itemId) {
    this._model.removeNode(itemId);
    this.__renderNodes();
    this.emit('change', this._model);
  }

  hasType(dataType) {
    return this._dataValues[dataType] !== undefined;
  }

  __onClickStage(e) {
    if (e.evt.target.nodeName === 'CANVAS') {
      this.hideContextMenu();
      if (e.target.className !== 'Text' && this._selectedItem) {
        this._selectedItem = null;
        this.emit('itemdeselect');
        this.emit('itemselect', null);
      }
    }
  }

  __onContextMenuStage(e) {
    const s = this;
    const vect = this._stage.getPointerPosition();
    const menu = this._menu;
    s.hideContextMenu();
    var menuKeys = Object.keys(this._dataValues);
    menuKeys.unshift('text');
    menuKeys.forEach((key) => {
      let menuItem = document.createElement('div');
      menuItem.textContent = this._dataValues[key] || 'Dòng chữ';
      menuItem.className = 'graph-menu-item';
      menuItem.onclick = (e) => {
        s.addNode(key, { x: vect.x, y: vect.y });
        s.hideContextMenu();
      };
      menu.appendChild(menuItem);
    });
    this.__showContextMenu(vect.x + 4, vect.y + 4);
  }

  __showContextMenu(x, y) {
    const menu = this._menu;
    menu.style.display = 'block';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
  }

  __onItemChange(item) {
    this.emit('itemchange', item);
    this.emit('change', this._model);
  }

  __onItemSelect(item) {
    this.emit('itemselect', item);
  }

  __showInput(e, item) {
    const s = this;
    var menu = this._menu;
    s.hideContextMenu();
    var inputBox = document.createElement('input');
    inputBox.setAttribute('type', 'text');
    inputBox.setAttribute('value', item.value);
    inputBox.onchange = (evt) => {
      item.value = evt.target.value;
      s.hideContextMenu();
      s.__renderNodes();
      s.__onItemChange(item);
    };
    menu.appendChild(inputBox);
    this.__showContextMenu(e.currentTarget.x(), e.currentTarget.y());
  }

  __showItemContextMenu(item) {
    const s = this;
    var menu = this._menu;
    s.hideContextMenu();
    let vect = s._stage.getPointerPosition();

    let deleteMenuItem = document.createElement('div');
    deleteMenuItem.className = 'graph-menu-item';
    deleteMenuItem.textContent = 'Xóa';
    deleteMenuItem.onclick = (e) => {
      s.removeNode(item.id);
      s.hideContextMenu();
    };
    menu.appendChild(deleteMenuItem);
    this.container.style.position = 'relative';
    this._container.firstChild.appendChild(menu);
    this.__showContextMenu(vect.x + 4, vect.y + 4);
  }

  __renderNodes() {
    const s = this;
    const { items } = this._model;
    this.__contentLayer.removeChildren();
    this.contentList = {};
    items.forEach((item) => {
      let content = new Text({
        ...item.config,
        id: item.id,
        draggable: true,
        dragBoundFunc: (pos) => {
          if (pos.x < 0) pos.x = 0;
          if (pos.y < 0) pos.y = 0;
          return {
            x: Math.min(pos.x, s.width - 10),
            y: Math.min(pos.y, s.height - 10),
          };
        },
      });
      content.text(item.text(this._dataValues));
      this.contentList[item.id] = content;
      this.__contentLayer.add(content);
      content.on('mouseover', () => {
        s.container.style.cursor = 'move';
      });
      content.on('mouseout', () => {
        s.container.style.cursor = 'default';
      });

      content.on('mousedown', (e) => {
        e.evt.preventDefault();
        s._selectedItem = e.currentTarget.getAttr('id');
        s.__onItemSelect(item);
      });
      content.on('dragend', (e) => {
        item.config.x = e.currentTarget.x();
        item.config.y = e.currentTarget.y();
        s.__onItemChange(item);
      });
      content.on('contextmenu', (e) => {
        e.cancelBubble = true;
        s.__showItemContextMenu(item);
      });

      content.on('dblclick', (e) => {
        if (!item.mapValues) {
          s.__showInput(e, item);
        }
      });
    });
  }

  __renderBackground() {
    this._container.style.width =
      this._model.pxWidth + this._model.pxMarginLeft + this._model.pxMarginRight;
    this._container.style.height =
      this._model.pxHeight + this._model.pxMarginTop + this._model.pxMarginBottom;
    this._stage.setSize({
      width: this._model.pxWidth + this._model.pxMarginLeft + this._model.pxMarginRight,
      height: this._model.pxHeight + this._model.pxMarginTop + this._model.pxMarginBottom,
    });
    this.__bgRect.fill(this.fill);
    this.__bgRect.stroke(this.borderColor);
    this.__bgRect.width(this._model.pxWidth);
    this.__bgRect.height(this._model.pxHeight);
    this.__bgRectImage.width(this._model.pxWidth);
    this.__bgRectImage.height(this._model.pxHeight);
    this.__bgRectImage.position({
      x: this._model.pxMarginLeft,
      y: this._model.pxMarginTop,
    });
    this.__bgRect.width(this._model.pxWidth);
    this.__bgRect.height(this._model.pxHeight);
    this.__bgRect.position({
      x: this._model.pxMarginLeft,
      y: this._model.pxMarginTop,
    });
    if (this.__bgRectImage) {
      if (this.image) {
        this.__bgImage.width = this._model.pxWidth;
        this.__bgImage.height = this._model.pxHeight;
        this.__bgImage.src = this.image;
      } else {
        this.__bgImage.src = null;
      }
    }
  }

  //Events
  __onMouseOverStage(e) {
    this.__bgRect.strokeWidth(2);
  }

  __onMouseOutStage(e) {
    this.__bgRect.strokeWidth(0);
  }

  get container() {
    return this._container;
  }

  get width() {
    return this._model.pxWidth;
  }

  get height() {
    return this._model.pxHeight;
  }

  get ppi() {
    return this._model.ppi;
  }

  get fill() {
    return this._model.fill;
  }

  get borderColor() {
    return this._borderColor;
  }

  get unit() {
    return this._model.unit;
  }

  get marginTop() {
    return this._model.marginBottom;
  }

  get marginLeft() {
    return this._model.marginLeft;
  }

  get marginBottom() {
    return this._model.marginBottom;
  }

  get marginRight() {
    return this._model.marginRight;
  }

  get image() {
    return this._model.image;
  }

  set ppi(val) {
    this._model.ppi = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set image(val) {
    this._model.image = val;
    this.__bgImage.src = val;
    this.__emitChange();
  }

  set fill(color) {
    this._model.fill = color;
    this.__bgRect.fill(color);
    this.__bgLayer.batchDraw();
    this.__emitChange();
  }

  set borderColor(color) {
    this._borderColor = color;
    this.__bgRect.stroke(color);
    this.__bgLayer.batchDraw();
  }

  set marginTop(val) {
    this._model.marginTop = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set marginBottom(val) {
    this._model.marginBottom = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set marginLeft(val) {
    this._model.marginLeft = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set marginRight(val) {
    this._model.marginRight = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set width(val) {
    this._model.width = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set height(val) {
    this._model.height = val;
    this.__renderBackground();
    this.__emitChange();
  }

  set unit(val) {
    this._model.unit = val;
    this.__renderBackground();
    this.__emitChange();
  }

  get model() {
    return this._model;
  }

  setSize(width, height, unit) {
    this._model.width = width;
    this._model.height = height;
    this._model.unit = unit;
    this.__renderBackground();
    this.__emitChange();
  }

  __emitChange() {
    this.emit('change', this._model);
  }
}
