---
title: Theming & Styling
description: BlockNote allows you to change how the editor UI looks. You can change the theme of the default UI, or override its CSS styles.
imageTitle: Theming & Styling
path: /docs/theming
---

# Theming & Styling

BlockNote allows you to change how the editor UI looks. You can change the theme of the default UI, or override its CSS styles.

## CSS Styles

BlockNote's styling is defined in CSS, and you can find the default styles in the [`editor.css` stylesheet](https://github.com/TypeCellOS/BlockNote/blob/main/packages/react/src/editor/styles.css). This means you can override CSS styles for the editor, as well as all menus and toolbars.

In the demo below, we create additional CSS rules to add some basic styling to the editor, and also make all hovered slash menu items blue:

<Example name="theming-css" />

## Theme CSS Variables

BlockNote uses several CSS variables to define the light and dark editor themes. The theme is selected based on the user's system theme, and includes color, border, shadow, and font styles. By overwriting these variables, you can quickly change the look of the editor.

The example below shows each of the CSS variables you can set for BlockNote, with values from the default light theme:

```
--bn-colors-editor-text: #3F3F3F;
--bn-colors-editor-background: #FFFFFF;
--bn-colors-menu-text: #3F3F3F;
--bn-colors-menu-background: #FFFFFF;
--bn-colors-tooltip-text: #3F3F3F;
--bn-colors-tooltip-background: #EFEFEF;
--bn-colors-hovered-text: #3F3F3F;
--bn-colors-hovered-background: #EFEFEF;
--bn-colors-selected-text: #FFFFFF;
--bn-colors-selected-background: #3F3F3F;
--bn-colors-disabled-text: #AFAFAF;
--bn-colors-disabled-background: #EFEFEF;

--bn-colors-shadow: #CFCFCF;
--bn-colors-border: #EFEFEF;
--bn-colors-side-menu: #CFCFCF;

--bn-colors-highlights-gray-text: #9b9a97;
--bn-colors-highlights-gray-background: #ebeced;
--bn-colors-highlights-brown-text: #64473a;
--bn-colors-highlights-brown-background: #e9e5e3;
--bn-colors-highlights-red-text: #e03e3e;
--bn-colors-highlights-red-background: #fbe4e4;
--bn-colors-highlights-orange-text: #d9730d;
--bn-colors-highlights-orange-background: #f6e9d9;
--bn-colors-highlights-yellow-text: #dfab01;
--bn-colors-highlights-yellow-background: #fbf3db;
--bn-colors-highlights-green-text: #4d6461;
--bn-colors-highlights-green-background: #ddedea;
--bn-colors-highlights-blue-text: #0b6e99;
--bn-colors-highlights-blue-background: #ddebf1;
--bn-colors-highlights-purple-text: #6940a5;
--bn-colors-highlights-purple-background: #eae4f2;
--bn-colors-highlights-pink-text: #ad1a72;
--bn-colors-highlights-pink-background: #f4dfeb;

--bn-font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Open Sans", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
--bn-border-radius: 6px;
```

Setting these variables on the `.bn-container[data-color-scheme]` selector will apply them to the editor. You can also specify them separately for light & dark mode based on the value of `data-color-scheme` (`"light"` or `"dark"`).

In the demo below, we set a red theme for the editor which changes based on if light or dark mode is used:

<Example name="theming-css-variables" />

### Changing CSS Variables Through Code

The `theme` prop in `BlockNoteView` allows you to change the editor's theme through code. By passing in `"light"` or `"dark"` to the `theme` prop, you can force BlockNote to always use the light or dark theme.

However, using `Theme` objects, you can also override the theme CSS variables through code:

```ts
type CombinedColor = Partial<{
  text: string;
  background: string;
}>;

type ColorScheme = Partial<{
  editor: CombinedColor;
  menu: CombinedColor;
  tooltip: CombinedColor;
  hovered: CombinedColor;
  selected: CombinedColor;
  disabled: CombinedColor;
  shadow: string;
  border: string;
  sideMenu: string;
  highlights: Partial<{
    gray: CombinedColor;
    brown: CombinedColor;
    red: CombinedColor;
    orange: CombinedColor;
    yellow: CombinedColor;
    green: CombinedColor;
    blue: CombinedColor;
    purple: CombinedColor;
    pink: CombinedColor;
  }>;
}>;

type Theme = Partial<{
  colors: ColorScheme;
  borderRadius: number;
  fontFamily: string;
}>;
```

You can pass a `Theme` object to the `theme` prop in `BlockNoteView` to set the same CSS variables regardless of light/dark mode being used. Alternatively, you can set CSS variables for light and dark mode separately by passing the following object:

```ts
type LightAndDarkThemes = {
  light: Theme;
  dark: Theme;
};
```

In the demo below, we create the same red theme as from the previous demo, but this time we set it via the `theme` prop in `BlockNoteView`:

<Example name="theming-css-variables-code" />

## Adding DOM Attributes

You can set additional HTML attributes on most DOM elements inside the editor, which let you change the way that blocks are styled.

In the demo below, we set a custom class on the `blockContainer` element to add a border to each block:

<Example name="theming-dom-attributes" />

There are a number of elements that you can set classes for:

`editor:` The editor itself, excluding menus & toolbars.

`blockContainer:` The main container element for blocks. Contains both the block's content and its nested blocks.

`blockGroup:` The wrapper element for all top-level blocks in the editor and nested blocks.

`blockContent:` The wrapper element for a block's content.

`inlineContent:` The wrapper element for a block's rich-text content.
