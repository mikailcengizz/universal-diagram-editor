import { DataType } from "../../../types/types";

class DataTypeHelper {
  determineInputFieldType(dataType: DataType) {
    switch (dataType) {
      case "String":
        return "text";
      case "Boolean":
        return "checkbox";
      case "Text":
        return "textarea";
      default:
        return "text";
    }
  }
}

const dataTypeHelper = new DataTypeHelper();

export default dataTypeHelper;
