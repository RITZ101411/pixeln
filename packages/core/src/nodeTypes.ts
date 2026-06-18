export interface BaseProps {
  x?: number;
  y?: number;
}

export interface BoxProps extends BaseProps {
  w?: number;
  h?: number;
  bg?: string | number;
  border?: string | number;
  radius?: number;
}

export interface PixelProps extends BaseProps {
  bg?: string | number;
}

export interface CircleProps extends BaseProps {
  r: number;
  bg?: string | number;
  fill?: boolean;
}

export interface TextProps extends BaseProps {
  content: string;
  color?: string | number;
  font?: string;
}

interface NodeBase<T extends string, P extends BaseProps> {
  type: T;
  props: P;
  children: Node[];
}

export type BoxNode = NodeBase<"box", BoxProps>;
export type PixelNode = NodeBase<"pixel", PixelProps>;
export type CircleNode = NodeBase<"pcircle", CircleProps>;
export type TextNode = NodeBase<"text", TextProps>;
export type RootNode = NodeBase<"root", BaseProps>;

export type Node = BoxNode | PixelNode | CircleNode | TextNode | RootNode;

export function createNode(type: "box", props?: BoxProps, children?: Node[]): BoxNode;
export function createNode(type: "pixel", props?: PixelProps, children?: Node[]): PixelNode;
export function createNode(type: "pcircle", props?: CircleProps, children?: Node[]): CircleNode;
export function createNode(type: "text", props?: TextProps, children?: Node[]): TextNode;
export function createNode(type: "root", props?: BaseProps, children?: Node[]): RootNode;
export function createNode(type: string, props: BaseProps = {}, children: Node[] = []): Node {
  return { type, props, children } as Node;
}
