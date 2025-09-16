import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import axios from "axios";
import { marked } from "marked";
import AIModal from "../modal";
import { getCurrentUserDetail } from "@/app/(auth)";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [writeLimitHit, setWriteLimitHit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function checkWriteLimit() {
      try {
        const res = await axios.post("/api/check-write-limit", { userId: getCurrentUserDetail().id }); // replace with real userId
        if (res.data.limitHit) {
          setWriteLimitHit(true);
          setShowModal(true);
        }
      } catch (err) {
        console.error("Failed to check write limit", err);
      }
    }
    checkWriteLimit();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[200px] border rounded-md bg-slate-50 py-2 px-3",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter") {
          const text = editor?.getText()?.trim();
          const match = text?.match(/\/write (.+)/i);
      
          if (match && match[1]) {
            if (writeLimitHit) {
              setShowModal(true);
              return true;
            }
            const prompt = match[1];
            event.preventDefault();
            setIsGenerating(true);
            editor?.commands.setContent(
              `<div class='flex items-center justify-center gap-2 text-slate-500 italic py-6'>
                <svg class='animate-spin h-5 w-5 text-slate-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582a9.956 9.956 0 0116.627-2.686l.409.409A9.956 9.956 0 0120 20.418V20H4v-5'/></svg>
                Generating content for: ${prompt}...
              </div>`
            );
      
            setTimeout(async () => {
              try {
                const res = await axios.post("/api/generate", {
                  prompt,
                  userId: getCurrentUserDetail().id, // replace with real 
                });
                const generated = res.data.text;
                editor?.commands.setContent(generated);
                const html = marked(generated);
                editor?.commands.setContent(html, false);
                onChange(editor?.getHTML() ?? "");
              } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 403) {
                  setWriteLimitHit(true);
                  // Trick: reset showModal briefly to re-trigger it
                  setShowModal(false); // force unmount
                  setTimeout(() => setShowModal(true), 0); // re-mount on next tick
                }
                editor?.commands.setContent("Failed to generate content. Please try again.");
              } finally {
                setIsGenerating(false);
              }
            }, 0);
      
            return true; // Stop further handling
          }
        }
      
        return false; // Let others handle the key
      }            
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <AIModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}