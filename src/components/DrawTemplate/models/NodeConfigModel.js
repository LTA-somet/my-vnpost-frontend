export default class NodeConfigModel {
    constructor(config = {}) {
        //text
        this.fontSize = config.fontSize ? Number(config.fontSize) : 16;
        this.fontFamily = config.fontFamily || 'Times New Roman';
        this.fontStyle = config.fontStyle || 'bold normal';//normal || bold || italic || bold italic
        this.fontVariant = config.fontVariant || 'normal';
        this.textDecoration = config.textDecoration || '';
        this.align = config.align || 'left';
        this.verticalAlign = config.verticalAlign || 'bottom';
        this.padding = config.padding || 0;
        this.wrap = config.wrap || 'none';
        this.fill = config.fill || '#333333';
        this.textTransform = config.textTransform || 'none';
        //General
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.visible = config.visible || true;
        this.width = config.width || null;
        this.height = config.height || null;
        this.scaleX = config.scaleX || 1;
        this.scaleY = config.scaleY || 1;
        this.offsetX = config.offsetX || 0;
        this.offsetY = config.offsetY || 0;
        this.opacity = config.opacity || 1;
        this.rotation = config.rotation || 0;
    }
}
