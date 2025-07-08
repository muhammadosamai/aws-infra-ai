export interface Source {
  uri: string;
  title: string;
}

export interface InputPanelProps {
  onGenerate: (problemStatement: string) => void;
  isLoading: boolean;
}

export interface SolutionDisplayProps {
  solution: string | null;
  isLoading: boolean;
  error: string | null;
  sources: Source[];
}

export interface BlueprintDisplayProps {
  cloudformationCode: string;
  terraformCode: string;
}
