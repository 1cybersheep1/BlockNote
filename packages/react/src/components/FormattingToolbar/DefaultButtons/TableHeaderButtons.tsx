import {
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
  TableContent,
} from "@blocknote/core";
import { useCallback, useMemo } from "react";
import { RiLayoutRowFill, RiLayoutColumnFill } from "react-icons/ri";

import { useComponentsContext } from "../../../editor/ComponentsContext";
import { useBlockNoteEditor } from "../../../hooks/useBlockNoteEditor";
import { useSelectedBlocks } from "../../../hooks/useSelectedBlocks";
import { useDictionary } from "../../../i18n/dictionary";

export const TableRowHeaderButton = () => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();

  const selectedBlocks = useSelectedBlocks(editor);

  const tableBlock = useMemo(() => {
    // Checks if only one block is selected.
    if (selectedBlocks.length !== 1) {
      return undefined;
    }

    if (selectedBlocks[0].type === "table") {
      return selectedBlocks[0] as any; // TODO
    } else {
      return undefined;
    }
  }, [selectedBlocks]);

  const toggleRowHeader = useCallback(() => {
    const updatedContent: TableContent<InlineContentSchema, StyleSchema> = {
      ...tableBlock.content,
      hasRowHeader: !tableBlock.content.hasRowHeader,
    };

    editor.updateBlock(tableBlock, {
      content: updatedContent as any, // TODO
    });
  }, [editor, tableBlock]);

  if (!tableBlock) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      className={"bn-button"}
      onClick={() => toggleRowHeader()}
      isSelected={tableBlock.props.hasRowHeader}
      label={dict.formatting_toolbar.table_row_header.tooltip}
      mainTooltip={dict.formatting_toolbar.table_row_header.tooltip}
      icon={<RiLayoutRowFill />}
    />
  );
};

export const TableColumnHeaderButton = () => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();

  const selectedBlocks = useSelectedBlocks(editor);

  const tableBlock = useMemo(() => {
    // Checks if only one block is selected.
    if (selectedBlocks.length !== 1) {
      return undefined;
    }

    if (selectedBlocks[0].type === "table") {
      return selectedBlocks[0] as any; // TODO
    } else {
      return undefined;
    }
  }, [selectedBlocks]);

  const toggleColumnHeader = useCallback(() => {
    const updatedContent: TableContent<InlineContentSchema, StyleSchema> = {
      ...tableBlock.content,
      hasColumnHeader: !tableBlock.content.hasColumnHeader,
    };

    editor.updateBlock(tableBlock, {
      content: updatedContent as any, // TODO
    });
  }, [editor, tableBlock]);

  if (!tableBlock) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      className={"bn-button"}
      onClick={() => toggleColumnHeader()}
      isSelected={tableBlock.props.hasColumnHeader}
      label={dict.formatting_toolbar.table_column_header.tooltip}
      mainTooltip={dict.formatting_toolbar.table_column_header.tooltip}
      icon={<RiLayoutColumnFill />}
    />
  );
};
