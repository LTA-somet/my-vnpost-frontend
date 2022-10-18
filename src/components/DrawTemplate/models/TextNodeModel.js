import BaseNodeModel from "./BaseNodeModel";

export default class TextNodeModel extends BaseNodeModel {
    constructor(data) {
        super(data);
        this.type = 'text';
    }

    text (recordValues) {
      let rs = '';
      if(!recordValues) rs = this.value;
      else rs = this.mapValues ? recordValues[this.value] : this.value;
      switch (this.config.textTransform.toLowerCase()){
        case 'uppercase':
          return rs.toLocaleUpperCase();
        case 'lowercase':
          return rs.toLocaleLowerCase();
        default:
          return rs;
      }

    }
}
