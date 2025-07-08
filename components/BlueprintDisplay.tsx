import React, { useState } from 'react';
import { BlueprintDisplayProps } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

type IacType = 'terraform' | 'cloudformation';

const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ cloudformationCode, terraformCode }) => {
  const [activeTab, setActiveTab] = useState<IacType>('terraform');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeToCopy = activeTab === 'terraform' ? terraformCode : cloudformationCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const codeExists = {
    terraform: terraformCode && terraformCode.trim() !== '',
    cloudformation: cloudformationCode && cloudformationCode.trim() !== '',
  };

  // If terraform code doesn't exist, default to cloudformation
  if (activeTab === 'terraform' && !codeExists.terraform) {
    if (codeExists.cloudformation) {
      setActiveTab('cloudformation');
    } else {
      return null; // Don't render anything if no code exists
    }
  }

  const TabButton: React.FC<{ type: IacType; label: string }> = ({ type, label }) => (
    <button
      onClick={() => {
        setActiveTab(type);
        setCopied(false);
      }}
      disabled={!codeExists[type]}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200
        ${activeTab === type
          ? 'bg-aws-dark-charcoal text-white border-b-2 border-aws-orange'
          : 'bg-transparent text-gray-400 hover:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="not-prose my-6">
      <h3 className="text-xl font-bold text-aws-cloud-blue mt-6 mb-3">
        Infrastructure as Code (IaC) Blueprint
      </h3>
      <div className="border-b border-gray-700">
        <TabButton type="terraform" label="Terraform (HCL)" />
        <TabButton type="cloudformation" label="CloudFormation (YAML)" />
      </div>
      <div className="relative bg-aws-dark-charcoal rounded-b-lg rounded-tr-lg">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md transition-all duration-200"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
        <pre className="p-4 overflow-x-auto text-sm">
          <code>
            {activeTab === 'terraform' ? terraformCode : cloudformationCode}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default BlueprintDisplay;
