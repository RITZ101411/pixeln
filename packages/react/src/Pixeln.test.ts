import React from "react";
import { describe, expect, it, vi } from "vitest";
import { extractChildren } from "./Pixeln";

describe("extractChildren", () => {
  it("preserves supported button semantics", () => {
    const onClick = vi.fn();
    const child = React.createElement("button", {
      id: "increment",
      type: "button",
      disabled: true,
      "aria-label": "Increment count",
      "data-testid": "increment-button",
      onClick,
    }, "+1");

    expect(extractChildren(child)).toEqual([{
      tag: "button",
      text: "+1",
      attributes: {
        id: "increment",
        type: "button",
        disabled: true,
        "aria-label": "Increment count",
        "data-testid": "increment-button",
      },
      font: undefined,
      color: undefined,
      bg: undefined,
      border: undefined,
      radius: undefined,
      padding: undefined,
      onClick,
    }]);
  });

  it("preserves supported link semantics and drops unsupported props", () => {
    const child = React.createElement("a", {
      href: "/docs",
      target: "_blank",
      rel: "noreferrer",
      className: "ignored",
    }, "Docs");

    const [result] = extractChildren(child);
    expect(result.attributes).toEqual({
      href: "/docs",
      target: "_blank",
      rel: "noreferrer",
    });
  });
});
