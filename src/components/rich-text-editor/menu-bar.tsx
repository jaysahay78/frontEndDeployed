"use client";

import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Image,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
  } from "lucide-react";
  import React, { useEffect, useRef, useState } from "react";
  import { Toggle } from "../ui/toggle";
  import { Editor } from "@tiptap/react";

  
  export default function MenuBar({ editor}: { editor: Editor | null}) {

    const [selectionState, setSelectionState] = useState({
      heading1: false,
      heading2: false,
      heading3: false,
      bold: false,
      italic: false,
      strike: false,
      highlight: false,
      bulletList: false,
      orderedList: false,
      alignLeft: false,
      alignCenter: false,
      alignRight: false,
    });

    useEffect(() => {
      if (!editor) return;
  
      const update = () => {
        setSelectionState({
          heading1: editor.isActive("heading", { level: 1 }),
          heading2: editor.isActive("heading", { level: 2 }),
          heading3: editor.isActive("heading", { level: 3 }),
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          strike: editor.isActive("strike"),
          highlight: editor.isActive("highlight"),
          bulletList: editor.isActive("bulletList"),
          orderedList: editor.isActive("orderedList"),
          alignLeft: editor.isActive({ textAlign: "left" }),
          alignCenter: editor.isActive({ textAlign: "center" }),
          alignRight: editor.isActive({ textAlign: "right" }),
        });
      };

      update(); // run once initially
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: selectionState.heading1,
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: selectionState.heading2,
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: selectionState.heading3,
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: selectionState.bold,
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: selectionState.italic,
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: selectionState.strike,
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: selectionState.alignLeft,
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: selectionState.alignCenter,
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: selectionState.alignRight,
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: selectionState.bulletList,
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: selectionState.orderedList,
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: selectionState.highlight,
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}