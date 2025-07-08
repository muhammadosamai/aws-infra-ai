import React, { useMemo } from 'react';
import { SolutionDisplayProps } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { AwsIcon } from './icons/AwsIcon';
import BlueprintDisplay from './BlueprintDisplay';

// Simple Markdown to HTML parser
const SimpleMarkdownParser: React.FC<{ text: string }> = ({ text }) => {
    const parsedContent = useMemo(() => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeBlockContent = '';
        let codeBlockLang = '';
        let listType: 'ul' | 'ol' | null = null;
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                if (listType === 'ul') {
                    elements.push(<ul key={elements.length} className="list-disc list-inside space-y-2 mb-4 pl-4">{listItems}</ul>);
                } else if (listType === 'ol') {
                    elements.push(<ol key={elements.length} className="list-decimal list-inside space-y-2 mb-4 pl-4">{listItems}</ol>);
                }
                listItems = [];
                listType = null;
            }
        };

        lines.forEach((line, index) => {
            if (line.startsWith('```')) {
                flushList();
                inCodeBlock = !inCodeBlock;
                if (inCodeBlock) {
                    codeBlockLang = line.substring(3).trim();
                } else {
                    elements.push(
                        <pre key={index} className="bg-aws-dark-charcoal p-4 rounded-lg my-4 overflow-x-auto">
                            <code className={`language-${codeBlockLang} text-sm`}>{codeBlockContent}</code>
                        </pre>
                    );
                    codeBlockContent = '';
                    codeBlockLang = '';
                }
                return;
            }

            if (inCodeBlock) {
                codeBlockContent += line + '\n';
                return;
            }

            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                if (listType !== 'ul') flushList();
                listType = 'ul';
                listItems.push(<li key={`${index}-${listItems.length}`}>{line.trim().substring(2)}</li>);
            } else if (line.trim().match(/^\d+\.\s/)) {
                if (listType !== 'ol') flushList();
                listType = 'ol';
                listItems.push(<li key={`${index}-${listItems.length}`}>{line.trim().replace(/^\d+\.\s/, '')}</li>);
            } else {
                flushList();
                if (line.startsWith('### ')) {
                    elements.push(<h3 key={index} className="text-xl font-bold text-aws-cloud-blue mt-6 mb-3">{line.substring(4)}</h3>);
                } else if (line.startsWith('## ')) {
                    elements.push(<h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-600 pb-2">{line.substring(3)}</h2>);
                } else if (line.startsWith('# ')) {
                    elements.push(<h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.substring(2)}</h1>);
                } else if (line.trim() === '') {
                    elements.push(<div key={index} className="h-4" />); // Represents a paragraph break
                } else {
                     const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
                     elements.push(<p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />);
                }
            }
        });

        flushList();
        if(inCodeBlock) { // handle unclosed code block at end of file
            elements.push(
                <pre key="final-code-block" className="bg-aws-dark-charcoal p-4 rounded-lg my-4 overflow-x-auto">
                    <code className={`language-${codeBlockLang} text-sm`}>{codeBlockContent}</code>
                </pre>
            );
        }

        return elements;
    }, [text]);

    return <>{parsedContent}</>;
};

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution, isLoading, error, sources }) => {

  const { mainContent, blueprint } = useMemo(() => {
    if (!solution) {
      return { mainContent: null, blueprint: null };
    }

    const blueprintIdentifier = '### **6. Infrastructure as Code (IaC) Blueprint**';
    const blueprintIndex = solution.indexOf(blueprintIdentifier);

    if (blueprintIndex === -1) {
      return { mainContent: solution, blueprint: null };
    }

    const mainContent = solution.substring(0, blueprintIndex);
    const blueprintContent = solution.substring(blueprintIndex);

    const codeBlockRegex = /```(\w+)\n([\s\S]*?)\n```/g;
    let match;
    const codeBlocks: { [key: string]: string } = {};

    while ((match = codeBlockRegex.exec(blueprintContent)) !== null) {
      const lang = match[1].toLowerCase();
      const code = match[2];
      if (lang === 'yaml' || lang === 'yml') {
        codeBlocks['cloudformation'] = code;
      }
      if (lang === 'hcl' || lang === 'terraform') {
        codeBlocks['terraform'] = code;
      }
    }
    
    const blueprintData = (codeBlocks.cloudformation || codeBlocks.terraform)
      ? { cloudformationCode: codeBlocks.cloudformation || '', terraformCode: codeBlocks.terraform || '' }
      : null;

    return { mainContent, blueprint: blueprintData };
  }, [solution]);


  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
      {isLoading && !solution && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <LoadingSpinner />
          <p className="text-lg text-white mt-4">Generating your AWS solution...</p>
          <p className="text-gray-400">This may take a few moments.</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-red-900 border border-red-700 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
                <p className="text-red-200">{error}</p>
            </div>
        </div>
      )}
      {!isLoading && !error && !solution && (
         <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <AwsIcon className="h-24 w-24 text-gray-700 mb-4" />
            <h2 className="text-2xl font-bold text-gray-500">Your Solution Will Appear Here</h2>
            <p className="mt-2 max-w-md">
                Describe your project requirements in the panel on the left and click "Generate Solution" to see the AI-powered architecture recommendation.
            </p>
        </div>
      )}
      {(mainContent || (isLoading && solution)) && (
          <div className="prose prose-invert max-w-none">
            <SimpleMarkdownParser text={mainContent || solution || ''} />
            {blueprint && <BlueprintDisplay {...blueprint} />}
          </div>
      )}
      {!isLoading && sources.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-700">
          <h3 className="text-xl font-bold text-aws-cloud-blue mb-4">
            References & Sources
          </h3>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start">
                <span className="text-aws-orange mr-3 mt-1">&#8227;</span>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aws-font-color hover:text-aws-orange transition-colors duration-200 break-all"
                  aria-label={`Read more: ${source.title}`}
                >
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SolutionDisplay;