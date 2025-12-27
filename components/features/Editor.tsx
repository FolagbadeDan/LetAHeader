
import React, { useState } from 'react';
import { LetterContent } from '@/types';
import {
  Bold, Italic, Underline, List,
  AlignLeft, AlignCenter, AlignRight,
  Wand2, ChevronDown, Calendar, User, MapPin, FileType, Type, Sparkles, PenTool
} from 'lucide-react';
import Dock, { DockItem } from '@/components/Dock';
import { SignaturePad } from './SignaturePad';

interface EditorProps {
  content: LetterContent;
  setContent: React.Dispatch<React.SetStateAction<LetterContent>>;
  onAIAssist: () => void;
}

export const Editor: React.FC<EditorProps> = ({ content, setContent, onAIAssist }) => {
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  const handleFieldChange = (key: keyof LetterContent, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const execCmd = (command: string) => document.execCommand(command, false);

  const handleSmartFormat = () => {
    const temp = document.createElement('div');
    temp.innerHTML = content.body;
    const text = temp.innerText || temp.textContent || "";
    const lines = text.split(/\n/);
    let newHtml = '';
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed) {
        newHtml += `<p>${trimmed}</p>`;
      }
    });
    if (!newHtml) newHtml = '<p><br/></p>';
    setContent(prev => ({ ...prev, body: newHtml }));
  };

  const savedRange = React.useRef<Range | null>(null);

  const handleSignClick = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRange.current = selection.getRangeAt(0);
    }
    setIsSignatureOpen(true);
  };

  const insertSignature = (dataUrl: string) => {
    const imgHtml = `<img src="${dataUrl}" alt="Signature" style="height: 60px; width: auto; display: block; margin: 1rem 0;" />`;

    // Attempt cursor insertion
    if (savedRange.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);

      const success = document.execCommand('insertHTML', false, imgHtml);

      // If execCommand worked, we need to update state manually because execCommand modifies DOM directly
      if (success) {
        const editorContent = document.querySelector('.prose')?.innerHTML;
        if (editorContent) {
          setContent(prev => ({ ...prev, body: editorContent }));
          return;
        }
      }
    }

    // Fallback: Append to end
    setContent(prev => ({ ...prev, body: prev.body + `<div class="mt-8 mb-4">${imgHtml}</div>` }));
  };

  const dockItems: DockItem[] = [
    { icon: <Bold className="w-5 h-5 text-slate-200" />, label: "Bold", onClick: () => execCmd('bold') },
    { icon: <Italic className="w-5 h-5 text-slate-200" />, label: "Italic", onClick: () => execCmd('italic') },
    { icon: <Underline className="w-5 h-5 text-slate-200" />, label: "Underline", onClick: () => execCmd('underline') },
    { icon: <AlignLeft className="w-5 h-5 text-slate-200" />, label: "Left", onClick: () => execCmd('justifyLeft') },
    { icon: <AlignCenter className="w-5 h-5 text-slate-200" />, label: "Center", onClick: () => execCmd('justifyCenter') },
    { icon: <AlignRight className="w-5 h-5 text-slate-200" />, label: "Right", onClick: () => execCmd('justifyRight') },
    {
      icon: <Wand2 className="w-5 h-5 text-purple-400" />,
      label: "Smart Format",
      onClick: handleSmartFormat,
      className: "bg-purple-900/30 border-purple-500/30"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      label: "AI Assist",
      onClick: onAIAssist,
      className: "bg-blue-900/30 border-blue-500/30"
    },
    {
      icon: <PenTool className="w-5 h-5 text-emerald-400" />,
      label: "Sign",
      onClick: handleSignClick,
      className: "bg-emerald-900/30 border-emerald-500/30"
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100/50">

      {/* Dock Toolbar */}
      <div className="px-4 pt-4 pb-2 bg-transparent flex items-center justify-center shrink-0 sticky top-0 z-10">
        <Dock
          items={dockItems}
          panelHeight={56}
          dockHeight={56}
          baseItemSize={42}
          magnification={42}
          distance={0}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-slide-up-fade">
            <button
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-50 transition-all border-b border-slate-100"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FileType className="w-4 h-4 text-blue-500" /> Header Details
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isMetaOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMetaOpen && (
              <div className="p-6 space-y-5 animate-slide-down-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Date"
                    value={content.date}
                    onChange={(v) => handleFieldChange('date', v)}
                    icon={Calendar}
                  />
                  <Input
                    label="Recipient Name"
                    value={content.recipientName}
                    onChange={(v) => handleFieldChange('recipientName', v)}
                    icon={User}
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Recipient Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <textarea
                      value={content.recipientAddress}
                      onChange={(e) => handleFieldChange('recipientAddress', e.target.value)}
                      rows={3}
                      className="w-full text-sm border-2 border-slate-200 bg-white focus:bg-blue-50/30 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400 shadow-sm hover:border-slate-300 overflow-hidden"
                      placeholder="Street Address&#10;City, State Zip&#10;Country"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subject & Body */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow min-h-[600px] flex flex-col overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
            <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
              <input
                type="text"
                value={content.subject}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                className="w-full text-xl md:text-2xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent focus:text-blue-900 transition-colors"
                placeholder="Type your subject here..."
              />
            </div>
            <div
              className="flex-1 p-6 md:p-8 outline-none prose prose-slate prose-sm md:prose-base max-w-none leading-7 text-slate-700 selection:bg-blue-100 selection:text-blue-900 hover:bg-slate-50/30 transition-colors"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleFieldChange('body', e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          </div>

        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs font-medium text-slate-400 select-none">
        <div className="flex items-center gap-4">
          <span>
            {content.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length} words
          </span>
          <span className="w-px h-3 bg-slate-300"></span>
          <span>
            {Math.ceil(content.body.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length / 200)} min read
          </span>
        </div>
        <div>
          {isMetaOpen ? 'Metadata Expanded' : 'Metadata Collapsed'}
        </div>
      </div>

      <SignaturePad
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        onSave={insertSignature}
      />
    </div>
  );
};

const ToolBtn = ({ icon: Icon, onClick, tooltip }: any) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all active:scale-90 hover:shadow-sm"
      title={tooltip}
    >
      <Icon className="w-4 h-4" />
    </button>
    {tooltip && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {tooltip}
      </div>
    )}
  </div>
);

const Input = ({ label, value, onChange, icon: Icon, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border-2 border-slate-200 bg-white focus:bg-blue-50/30 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);
