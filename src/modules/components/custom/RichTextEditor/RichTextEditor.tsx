import { useEffect, useRef, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";

interface RichTextEditorProps {
  onRichTextEditorChange: (event: any) => void;
  prevValue?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onRichTextEditorChange,
  prevValue,
}) => {
  const [value, setValue] = useState<string>(prevValue || "");
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setValue(prevValue || "");
  }, [prevValue]);

  // Вставляє тег blockquote навколо виділеного тексту
  const handleQuote = () => {
    document.execCommand("formatBlock", false, "blockquote");
  };

  return (
    <EditorProvider>
      <Editor
        ref={editorRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onRichTextEditorChange(e);
        }}
        placeholder="Start typing..."
      >
        <Toolbar>
          <BtnUndo />
          <BtnRedo />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <BtnBulletList />
          <BtnNumberedList />

          <button
            type="button"
            onClick={handleQuote}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 8px",
              fontSize: "16px",
            }}
            title="Blockquote"
          >
            ❝
          </button>
          <button
            type="button"
            onClick={() => document.execCommand("formatBlock", false, "h3")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            title="Heading 3"
          >
            H3
          </button>

          <BtnLink />
        </Toolbar>
      </Editor>
    </EditorProvider>
  );
};
