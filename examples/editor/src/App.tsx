// import logo from './logo.svg'
import "@blocknote/core/style.css";
import {
  BlockNoteView,
  defaultReactSlashMenuItems,
  // defaultReactSlashMenuItems,
  ReactSlashMenuItem,
  useBlockNote,
} from "@blocknote/react";
import styles from "./App.module.css";
import {
  createBlockSpec,
  defaultBlockSchema,
  defaultProps,
  // defaultSlashMenuItems,
} from "@blocknote/core";
import { RiImageFill } from "react-icons/ri";
import { Editor } from "@tiptap/core";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";

type WindowWithProseMirror = Window & typeof globalThis & { ProseMirror: any };

const customBlockSchema = {
  ...defaultBlockSchema,
  image: createBlockSpec({
    type: "image",
    propSchema: {
      src: {
        default: "https://via.placeholder.com/150",
      },
    } as const,
    containsInlineContent: true,
    render: (block) => {
      const parent = document.createElement("div");
      const editable = document.createElement("div");

      const img = document.createElement("img");
      img.setAttribute("src", block().props.src);
      img.setAttribute("border", "1px solid black");
      img.setAttribute("contenteditable", "false");

      parent.appendChild(editable);
      parent.appendChild(img);

      return { dom: parent, contentDOM: editable };
    },
  }),
  tiptapEditor: createBlockSpec({
    type: "tiptapEditor",
    propSchema: {},
    containsInlineContent: false,
    render: () => {
      const element = document.createElement("div");
      new Editor({
        element: element,
        extensions: [Document, Paragraph, Text],
        content: "<p>Example Text</p>",
        editable: true,
        injectCSS: false,
      });

      return { dom: element };
    },
  }),
  spoiler: createBlockSpec({
    type: "spoiler",
    propSchema: {
      ...defaultProps,
      hideChildren: {
        default: "false"
      }
    } as const,
    containsInlineContent: true,
    render: (getBlock, editor) => {
      const parent = document.createElement("div");
      const editable = document.createElement("div");

      const button = document.createElement("button");
      button.innerText = "Hide";
      button.setAttribute("contenteditable", "false")
      button.setAttribute("user-select", "none")
      button.addEventListener("click", () => {
        const block = getBlock();

        button.innerText = block.props.hideChildren === "true" ? "Show" : "Hide";

        editor.updateBlock(block, {
          props: {
            hideChildren: block.props.hideChildren === "true" ? "false" : "true",
          }
        })

        for (const child of block.children) {
          editor.updateBlock(child, {
            props: {
              hidden: block.props.hideChildren === "true" ? "false" : "true",
            }
          })
        }
      });

      parent.appendChild(editable);
      parent.appendChild(button);

      return { dom: parent, contentDOM: editable };
    },
  }),
  youtubeEmbed: createBlockSpec({
    type: "youtubeEmbed",
    propSchema: {
      src: { default: "https://www.youtube.com/embed/wjfuB8Xjhc4" },
    } as const,
    containsInlineContent: false,
    render: (block) => {
      const parent = document.createElement("div");
      const iframe = document.createElement("iframe");
      iframe.setAttribute("width", "560");
      iframe.setAttribute("height", "315");
      iframe.setAttribute("src", block().props.src);
      iframe.setAttribute("title", "YouTube video player");
      iframe.setAttribute("frameBorder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      iframe.setAttribute("allowFullScreen", "true");
      // iframe.setAttribute("contenteditable", "false");

      parent.appendChild(iframe);

      return { dom: parent };
    },
  }),
} as const;

const imageSlashMenuItem: ReactSlashMenuItem<typeof customBlockSchema> =
  new ReactSlashMenuItem<typeof customBlockSchema>(
    "Image",
    (editor) => {
      editor.insertBlocks(
        [
          {
            type: "image",
            props: {
              src: "https://cdn.skinport.com/cdn-cgi/image/width=512,height=384,fit=pad,format=webp,quality=85,background=transparent/images/screenshots/148340547/playside.png",
            },
          },
        ],
        editor.getTextCursorPosition().block,
        "after"
      );
    },
    ["img"],
    "Media",
    <RiImageFill size={18} />,
    "Used to insert an image into the document"
  );

const tiptapEditorSlashMenuItem: ReactSlashMenuItem<typeof customBlockSchema> =
  new ReactSlashMenuItem<typeof customBlockSchema>(
    "TipTap Editor",
    (editor) => {
      editor.insertBlocks(
        [
          {
            type: "tiptapEditor",
          },
        ],
        editor.getTextCursorPosition().block,
        "after"
      );
    },
    ["tt, editor, tiptap, tip tap"],
    "Media",
    <RiImageFill size={18} />,
    "Used to insert a TipTap editor into the document"
  );

const spoilerSlashMenuItem: ReactSlashMenuItem<typeof customBlockSchema> =
  new ReactSlashMenuItem<typeof customBlockSchema>(
    "Spoiler",
    (editor) => {
      editor.insertBlocks(
        [
          {
            type: "spoiler",
          },
        ],
        editor.getTextCursorPosition().block,
        "after"
      );
    },
    ["toggle, dropdown, hide"],
    "Media",
    <RiImageFill size={18} />,
    "Used to insert a spoiler into the document"
  );

const youtubeEmbedSlashMenuItem: ReactSlashMenuItem<typeof customBlockSchema> =
  new ReactSlashMenuItem<typeof customBlockSchema>(
    "YouTube Embed",
    (editor) => {
      editor.insertBlocks(
        [
          {
            type: "youtubeEmbed",
          },
        ],
        editor.getTextCursorPosition().block,
        "after"
      );
    },
    ["yt", "video", "embed"],
    "Media",
    <RiImageFill size={18} />,
    "Used to insert an embedded YouTube video into the document"
  );

function App() {
  const editor = useBlockNote({
    blockSchema: customBlockSchema,
    onEditorContentChange: (editor) => {
      console.log(editor.topLevelBlocks);
    },
    slashCommands: [
      ...defaultReactSlashMenuItems<typeof customBlockSchema>(),
      imageSlashMenuItem,
      tiptapEditorSlashMenuItem,
      spoilerSlashMenuItem,
      youtubeEmbedSlashMenuItem,
    ],
    editorDOMAttributes: {
      class: styles.editor,
      "data-test": "editor",
    },
  });

  // Give tests a way to get prosemirror instance
  (window as WindowWithProseMirror).ProseMirror = editor?._tiptapEditor;

  return <BlockNoteView editor={editor} />;
}

export default App;
