import { FunctionDeclaration } from "typescript";

type Property = {
  type: string,
  id: string,
  parent: string,
  useToken: string,
  [x: string]: any
}

export default Property;
