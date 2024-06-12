import { assertEmpty, mergeCSSClasses } from "@blocknote/core";
import { ComponentProps } from "@blocknote/react";
import { forwardRef, useEffect, useRef } from "react";
import { mergeRefs } from "../util/util";

export const SuggestionMenuItem = forwardRef<
  HTMLDivElement,
  ComponentProps["SuggestionMenu"]["Item"]
>((props, ref) => {
  const { className, item, isSelected, onClick, id, ...rest } = props;

  assertEmpty(rest);

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current && isSelected) {
      itemRef.current.scrollIntoView();
    }
  }, [isSelected]);

  return (
    <div
      className={mergeCSSClasses("bn-ak-menu-item", className || "")}
      ref={mergeRefs(ref, itemRef)}
      id={id}
      onClick={onClick}
      role="option"
      aria-selected={isSelected || undefined}>
      {item.icon && (
        <div
          className="bn-ak-suggestion-menu-item-section"
          data-position="left">
          {item.icon}
        </div>
      )}
      <div className="bn-ak-suggestion-menu-item-body">
        <div className="bn-ak-suggestion-menu-item-title">{item.title}</div>
        <div className="bn-ak-suggestion-menu-item-subtitle">
          {item.subtext}
        </div>
      </div>
      {item.badge && (
        <div
          data-position="right"
          className="bn-ak-suggestion-menu-item-section">
          <div>{item.badge}</div>
        </div>
      )}
    </div>
  );
});
