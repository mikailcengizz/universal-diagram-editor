import {
  RepresentationInstanceModel,
  RepresentationInstanceObject,
} from "../../types/types";

class ReferenceHelper {
  static dereferenceRepresentation(
    ref: string
  ): RepresentationInstanceObject | null {
    // Parse the reference string
    const [location, jsonPointer] = ref.split("#");

    if (location === "localStorage://representationInstanceModel") {
      // Get the representation model from localStorage
      const representationInstanceModelJSON = localStorage.getItem(
        "representationInstanceModel"
      );
      if (representationInstanceModelJSON) {
        const representationInstanceModel: RepresentationInstanceModel =
          JSON.parse(representationInstanceModelJSON);

        // Navigate using the JSON Pointer (this is a simple example, you might use a library to handle this properly)
        const path = jsonPointer.split("/").filter((p) => p);
        let current: any = representationInstanceModel;

        for (const part of path) {
          if (current && current[part]) {
            current = current[part];
          } else {
            return null; // Path doesn't exist
          }
        }

        return current as RepresentationInstanceObject;
      }
    }
    return null;
  }

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
