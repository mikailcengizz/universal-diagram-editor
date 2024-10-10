import {
  RepresentationInstanceModel,
  RepresentationInstanceObject,
} from "../../types/types";

class ReferenceHelper {
  static resolveRef<T>(root: any, ref: string): T | null {
    if (ref.startsWith("#")) {
      ref = ref.slice(1);
    }

    // Remove the starting # and split the path
    const pathSegments = ref.split("/").filter((segment) => segment);

    // Start from the root object and traverse the path
    let current: any = root;

    for (const segment of pathSegments) {
      if (current && current.hasOwnProperty(segment)) {
        current = current[segment];
      } else {
        // Return null if path doesn't exist
        return null;
      }
    }

    return current as T;
  }
}

export default ReferenceHelper;
