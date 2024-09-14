import {
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
  TableContent,
} from "@blocknote/core";
import { useCallback, useMemo } from "react";
import {
  BsArrowsExpandVertical,
  BsArrowsCollapseVertical,
} from "react-icons/bs";
import { CellSelection, selectedRect } from "prosemirror-tables";
import { Editor } from "@tiptap/core";

import { useComponentsContext } from "../../../editor/ComponentsContext";
import { useBlockNoteEditor } from "../../../hooks/useBlockNoteEditor";
import { useSelectedBlocks } from "../../../hooks/useSelectedBlocks";
import { useDictionary } from "../../../i18n/dictionary";
import type { BlockNoteEditor } from "../../editor/BlockNoteEditor";
/**
 * Types for table cells and rows.
 */
interface Cell {
  colspan?: number;
  rowspan?: number;
  content: InlineContentSchema[];
}

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Check if the selected rectangle forms a valid rectangle.
 */
function isValidRectangle(rect: Rect, grid: (Cell | undefined)[][]): boolean {
  const { top, bottom, left, right } = rect;
  for (let row = top; row < bottom; row++) {
    for (let col = left; col < right; col++) {
      const cell = grid[row]?.[col];
      if (
        !cell ||
        (cell.colspan || 1) + col > right ||
        (cell.rowspan || 1) + row > bottom
      ) {
        console.warn(
          "Invalid cell found within the selected area. Merging aborted."
        );
        return false;
      }
    }
  }
  return true;
}

/**
 * Adjust the content of the table by merging selected cells.
 */
function adjustTableContentForMerge(
  editor: BlockNoteEditor,
  content: TableContent<InlineContentSchema, StyleSchema>
): any {
  // Get the selection rectangle from ProseMirror
  const rect = selectedRect(editor.state);
  const { top, bottom, left, right } = rect;

  // Build a grid that maps logical positions to content cells
  const grid = buildGrid(content.rows);

  // Validate that the selection forms a rectangle
  if (!isValidRectangle(rect, grid)) {
    console.warn("Selection is not a valid rectangle. Merging aborted.");
    return content.rows;
  }

  // Clone the content to avoid direct mutations
  const adjustedContent: Row[] = content.map((row) => ({
    ...row,
    cells: row.cells.map((cell) => ({
      ...cell,
      content: [...cell.content],
    })),
  }));

  const clonedGrid = buildGrid(adjustedContent); // Build a grid for the cloned content

  const topLeftCell = clonedGrid[top]?.[left];
  if (!topLeftCell) {
    console.warn("Top-left cell for merging not found.");
    return adjustedContent;
  }

  let maxColspan = topLeftCell.colspan || 1;
  let maxRowspan = topLeftCell.rowspan || 1;
  const mergedContents = [...topLeftCell.content];
  const seenCells = new Set<Cell>();

  for (let row = top; row < bottom; row++) {
    for (let col = left; col < right; col++) {
      const cell = clonedGrid[row]?.[col];
      if (!cell || seenCells.has(cell)) continue;
      seenCells.add(cell);

      if (cell !== topLeftCell) {
        const cellColspan = cell.colspan || 1;
        const cellRowspan = cell.rowspan || 1;

        maxColspan = Math.max(maxColspan, col + cellColspan - left);
        maxRowspan = Math.max(maxRowspan, row + cellRowspan - top);

        // Add a space before the next content block
        mergedContents.push({
          type: "text",
          text: " ",
          styles: {},
        } as InlineContentSchema);

        // Append the content of the cell
        mergedContents.push(...cell.content);

        // Remove the cell from the adjusted content
        removeCellFromContent(adjustedContent, cell);
      }
    }
  }

  // Update the top-left cell's properties and content
  topLeftCell.colspan = maxColspan;
  topLeftCell.rowspan = maxRowspan;
  topLeftCell.content = mergedContents;

  // Clean up empty rows in the adjusted content
  return adjustedContent.filter((row) => row.cells.length > 0);
}

/**
 * Remove a cell from the table content.
 */
function removeCellFromContent(content: Row[], cellToRemove: Cell): void {
  content.forEach((row) => {
    row.cells = row.cells.filter((cell) => cell !== cellToRemove);
  });
}

/**
 * Build a grid that maps logical positions to content cells.
 */
function buildGrid(content: Row[]): (Cell | undefined)[][] {
  const grid: (Cell | undefined)[][] = [];
  let rowIndex = 0;

  content.forEach((row) => {
    if (!grid[rowIndex]) grid[rowIndex] = [];
    let colIndex = 0;

    row.cells.forEach((cell) => {
      const rowspan = cell.rowspan || 1;
      const colspan = cell.colspan || 1;

      // Find the next available column in the grid
      while (grid[rowIndex][colIndex]) {
        colIndex++;
      }

      for (let i = 0; i < rowspan; i++) {
        for (let j = 0; j < colspan; j++) {
          if (!grid[rowIndex + i]) grid[rowIndex + i] = [];
          grid[rowIndex + i][colIndex + j] = cell;
        }
      }

      colIndex += colspan;
    });

    rowIndex++;
  });

  return grid;
}

export const TableCellMergeButton = () => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();
  const selectedBlocks = useSelectedBlocks(editor);

  const tableBlock = useMemo(() => {
    if (selectedBlocks.length !== 1) {
      return undefined;
    }
    if (selectedBlocks[0].type === "table") {
      return selectedBlocks[0] as {
        type: "table";
        content: TableContent<InlineContentSchema, StyleSchema>;
      };
    } else {
      return undefined;
    }
  }, [selectedBlocks]);

  const mergeCells = useCallback(() => {
    if (tableBlock) {
      // Deep clone the content without using lodash
      const newContent: TableContent<InlineContentSchema, StyleSchema> = {
        ...tableBlock.content,
        rows: tableBlock.content.rows.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => ({
            ...cell,
            content: [...cell.content],
          })),
        })),
      };

      const adjustedContent = adjustTableContentForMerge(
        editor._tiptapEditor,
        newContent.rows
      );
      if (adjustedContent) {
        newContent.rows = adjustedContent;
        editor.updateBlock(tableBlock, {
          content: newContent,
        });
      } else {
        console.warn("Failed to adjust table content for merge.");
      }
    }
  }, [editor, tableBlock]);

  if (!tableBlock) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      className="bn-button"
      onClick={mergeCells}
      label={dict.formatting_toolbar.table_merge_cells.tooltip}
      mainTooltip={dict.formatting_toolbar.table_merge_cells.tooltip}
      icon={<BsArrowsCollapseVertical />}
    />
  );
};

export const TableCellSplitButton = () => {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();
  const selectedBlocks = useSelectedBlocks(editor);

  const tableBlock = useMemo(() => {
    if (selectedBlocks.length !== 1) {
      return undefined;
    }
    if (selectedBlocks[0].type === "table") {
      return selectedBlocks[0] as {
        type: "table";
        content: TableContent<InlineContentSchema, StyleSchema>;
      };
    } else {
      return undefined;
    }
  }, [selectedBlocks]);

  const splitCells = useCallback(() => {
    // Implement split cells functionality here
  }, [editor, tableBlock]);

  if (!tableBlock) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      className="bn-button"
      onClick={splitCells}
      label={dict.formatting_toolbar.table_split_cells.tooltip}
      mainTooltip={dict.formatting_toolbar.table_split_cells.tooltip}
      icon={<BsArrowsExpandVertical />}
    />
  );
};
