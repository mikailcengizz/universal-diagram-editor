import { DataType } from "../../types/types";

class TypeHelper {
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
  determineVisibilityIcon(visibility: string): string {
    switch (visibility) {
      case "public":
        return "+";
      case "protected":
        return "#";
      case "private":
        return "-";
      case "package":
        return "~";
      default:
        return "+";
    }
  }
}

const typeHelper = new TypeHelper();

export default typeHelper;
