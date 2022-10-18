import FixShortId from "../utils/FixShortId";
import NodeConfigModel from "./NodeConfigModel";

class BaseNodeModel {
    constructor(data) {
        data = data || {};
        this.id = data.id || FixShortId.generate();
        this.mapValues = data.mapValues;
        this.value = data.value || "Không xác định";
        this.config = new NodeConfigModel(data.config);
    }

    toObject(){
      return {
        ...this,
        config: {
          ...this.config
        }
      };
    }
}
export default BaseNodeModel;
