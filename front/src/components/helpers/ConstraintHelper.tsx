import { InstanceObject, MetaModel } from "../../types/types";
import jsep from "jsep";
import ReferenceHelper from "./ReferenceHelper";
import ModelHelperFunctions from "./ModelHelperFunctions";

// Register "or" and "and" as binary operators for jsep
jsep.addBinaryOp("or", 1);
jsep.addBinaryOp("and", 1);

interface Context {
  self: {
    source: InstanceObject;
    target: InstanceObject;
  };
}

// Available methods
const methods: any = {
  kindOf: (obj: InstanceObject, type: string, metaModel: MetaModel) => {
    const objType = ModelHelperFunctions.findClassFromInstanceObjectMetaModel(
      obj,
      metaModel
    )?.name;
    console.log("Checking constraint: Is object", objType, "kind of", type);
    return objType === type;
  },
  // Add more dynamic methods here
};

class ValidateConstraintHelper {
  static parseConstraint = (constraint: string) => {
    return jsep(constraint); // Convert the constraint into an AST
  };

  static evaluateExpression = (
    node: any,
    context: Context,
    metaModel: MetaModel
  ): any => {
    switch (node.type) {
      case "BinaryExpression":
        const left = this.evaluateExpression(node.left, context, metaModel);
        const right = this.evaluateExpression(node.right, context, metaModel);
        switch (node.operator) {
          case "and":
          case "&&":
            return left && right;
          case "or":
          case "||":
            return left || right;
          case "==":
            return left == right;
          case "!=":
            return left != right;
          case "<":
            return left < right;
          case ">":
            return left > right;
          case "<=":
            return left <= right;
          case ">=":
            return left >= right;
          default:
            throw new Error(`Unsupported binary operator: ${node.operator}`);
        }
      case "CallExpression":
        const methodName = node.callee.name || node.callee.property?.name; // Handle both Identifier and property cases
        if (!methodName) {
          throw new Error(
            `Unable to determine method name in CallExpression: ${node.callee}`
          );
        }

        console.log("node", node);
        const objName =
          node.callee.object?.name || node.callee.object?.property?.name; // Check if object exists for method calls like obj.method()
        const typeName = node.arguments[0]?.value; // Get the argument from the call

        const object =
          objName === "source" ? context.self.source : context.self.target;

        if (!methods[methodName]) {
          throw new Error(`Method ${methodName} is not defined`);
        }
        return methods[methodName](object, typeName, metaModel);

      case "Identifier":
        return context[node.name as keyof Context];

      case "Literal":
        return node.value;

      case "Compound":
        // Handle compound (multiple statements) by evaluating each expression
        return node.body.map((statement: any) =>
          this.evaluateExpression(statement, context, metaModel)
        );

      case "SequenceExpression":
        // Evaluate each expression in the sequence
        return node.expressions
          .map((expr: any) => this.evaluateExpression(expr, context, metaModel))
          .pop(); // Return the last result in the sequence

      default:
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  };
}

export default ValidateConstraintHelper;
