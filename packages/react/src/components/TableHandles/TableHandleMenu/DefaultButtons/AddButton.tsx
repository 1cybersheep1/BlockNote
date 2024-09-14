import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";

import { useComponentsContext } from "../../../../editor/ComponentsContext";
import { useBlockNoteEditor } from "../../../../hooks/useBlockNoteEditor";
import { useDictionary } from "../../../../i18n/dictionary";
import { TableHandleMenuProps } from "../TableHandleMenuProps";

export const AddRowButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableHandleMenuProps<I, S> & { side: "above" | "below" }
) => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const editor = useBlockNoteEditor<
    { table: DefaultBlockSchema["table"] },
    I,
    S
  >();

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        if (props.side === "above") {
          editor._tiptapEditor.commands.addRowBefore();
        } else {
          editor._tiptapEditor.commands.addRowAfter();
        }
      }}>
      {dict.table_handle[`add_${props.side}_menuitem`]}
    </Components.Generic.Menu.Item>
  );
};

export const AddColumnButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableHandleMenuProps<I, S> & { side: "left" | "right" }
) => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const editor = useBlockNoteEditor<
    { table: DefaultBlockSchema["table"] },
    I,
    S
  >();

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        if (props.side === "left") {
          editor._tiptapEditor.commands.addColumnBefore();
        } else {
          editor._tiptapEditor.commands.addColumnAfter();
        }
      }}>
      {dict.table_handle[`add_${props.side}_menuitem`]}
    </Components.Generic.Menu.Item>
  );
};

export const AddButton = <
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema
>(
  props: TableHandleMenuProps<I, S> &
    (
      | { orientation: "row"; side: "above" | "below" }
      | { orientation: "column"; side: "left" | "right" }
    )
) =>
  props.orientation === "row" ? (
    <AddRowButton {...props} side={props.side} />
  ) : (
    <AddColumnButton {...props} side={props.side} />
  );
