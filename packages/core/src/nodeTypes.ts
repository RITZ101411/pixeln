export interface BaseProps {
  x?: number;
  y?: number;
}

export interface BoxProps extends BaseProps {
  w?: number;
  h?: number;
  bg?: string | number;
}

export interface PixelProps extends BaseProps {
  bg?: string | number;
}

export interface BoxNode {
  type: "box";
  props: BoxProps;
  children: Node[];
}

export interface PixelNode {
  type: "pixel";
  props: PixelProps;
  children: Node[];
}

export interface CircleProps extends BaseProps {
  r: number;
  bg?: string | number;
  fill?: boolean;
}

export interface CircleNode {
  type: "pcircle";
  props: CircleProps;
  children: Node[];
}

export interface RootNode {
  type: "root";
  props: BaseProps;
  children: Node[];
}

export type Node = BoxNode | PixelNode | CircleNode | RootNode;

export function createNode(type: "box", props?: BoxProps, children?: Node[]): BoxNode;
export function createNode(type: "pixel", props?: PixelProps, children?: Node[]): PixelNode;
export function createNode(type: "pcircle", props?: CircleProps, children?: Node[]): CircleNode;
export function createNode(type: "root", props?: BaseProps, children?: Node[]): RootNode;
export function createNode(type: string, props: BaseProps = {}, children: Node[] = []): Node {
  return { type, props, children } as Node;
}
