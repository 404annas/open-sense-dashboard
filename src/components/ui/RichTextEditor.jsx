"use client"

import { useEffect, useRef } from "react"

const RichTextEditor = ({
    id,
    label,
    value,
    onChange,
    required = false,
    placeholder = "",
    containerClassName = "",
    labelClassName = "",
    editorClassName = "",
}) => {
    const editorRef = useRef(null)
    const editorId = id || `editor-${Math.random().toString(36).substring(2, 9)}`

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || ""
        }
    }, [value])

    const updateValue = () => {
        if (!editorRef.current) return
        const html = editorRef.current.innerHTML
        const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
        onChange?.(text ? html : "")
    }

    const runCommand = (command, commandValue = null) => {
        editorRef.current?.focus()
        document.execCommand(command, false, commandValue)
        updateValue()
    }

    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={editorId}
                    className={`block text-sm font-medium text-text-normal mb-1 ${labelClassName}`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="flex flex-wrap gap-2 mb-2">
                <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={() => runCommand("bold")}>
                    Bold
                </button>
                <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={() => runCommand("italic")}>
                    Italic
                </button>
                <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={() => runCommand("underline")}>
                    Underline
                </button>
                <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={() => runCommand("insertUnorderedList")}>
                    Bullets
                </button>
                <button type="button" className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={() => runCommand("insertOrderedList")}>
                    Numbered
                </button>
            </div>

            <div
                id={editorId}
                ref={editorRef}
                role="textbox"
                contentEditable
                onInput={updateValue}
                data-placeholder={placeholder}
                className={`min-h-[160px] bg-white w-full rounded-md border border-gray-400 shadow-sm
          focus:ring-primary focus:ring focus:outline-none px-3 py-2
          ${editorClassName}`}
            />
        </div>
    )
}

export default RichTextEditor
