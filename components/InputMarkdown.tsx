import MarkdownIt from 'markdown-it'
import dynamic from 'next/dynamic'
import React from 'react'

const mdParser = new MarkdownIt()
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
})
const editorId = 'markdown-editor'

interface Props {
  content: string
  label: string
  onChange: ({ html, text }: { html: string; text: string }) => void
}

export default function InputMarkdown({ content, label, onChange }: Props) {
  return (
    <div className="my-4">
      <label htmlFor={`${editorId}_md`} className="flex flex-col">
        <span>{label}</span>
      </label>
      <div className="mt-1">
        <MdEditor
          id="markdown-editor"
          config={{
            htmlClass: 'markdown-body',
          }}
          name="markdown"
          style={{ height: '450px' }}
          value={content}
          renderHTML={text => mdParser.render(text)}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
