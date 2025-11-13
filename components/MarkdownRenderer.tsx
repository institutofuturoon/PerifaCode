import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Alert from './Alert';
import Tip from './Tip';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content = '' }) => {

  const renderedContent = useMemo(() => {
    if (!content) return [];

    const components: (React.ReactNode | string)[] = [];
    let lastIndex = 0;
    
    // Regex to find all custom shortcodes
    const regex = /(\[ALERT(?: type="(.+?)")?\])([\s\S]*?)(\[\/ALERT\])|(\[TIP\])([\s\S]*?)(\[\/TIP\])|(\[CODE lang="(.+?)"\])([\s\S]*?)(\[\/CODE\])/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const [
        fullMatch, 
        alertStart, alertType, alertContent, alertEnd, 
        tipStart, tipContent, tipEnd,
        codeStart, codeLang, codeContent, codeEnd
      ] = match;

      // Add text before the match
      if (match.index > lastIndex) {
        components.push(content.substring(lastIndex, match.index));
      }

      // Add the component based on which part of the regex matched
      if (alertStart) {
        components.push(
          <Alert key={match.index} type={alertType as any || 'info'}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(alertContent.trim()) as string) }} />
          </Alert>
        );
      } else if (tipStart) {
        components.push(
          <Tip key={match.index}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(tipContent.trim()) as string) }} />
          </Tip>
        );
      } else if (codeStart) {
        components.push(
          <CodeBlock key={match.index} language={codeLang} code={codeContent.trim()} />
        );
      }

      lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining text after the last match
    if (lastIndex < content.length) {
      components.push(content.substring(lastIndex));
    }

    // Render all parts
    return components.map((part, index) => {
        if (typeof part === 'string') {
            const sanitizedHtml = DOMPurify.sanitize(marked.parse(part) as string, {
              ADD_ATTR: ['target'], // Allow target="_blank" for security
            });
            return <div key={index} className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
        }
        return part; // It's already a React component
    });
  }, [content]);

  return <>{renderedContent}</>;
};

export default MarkdownRenderer;