// Example Type

export type Example = {
  id: number;
  input: string;
  output: string;
  explanation?: string;
  img?: string;
};

// Problem Type
export type Problem = {
  id: string;
  title: string;
  problemStatement: string;
  examples: Example[];
  constraints: string;
  order: number;
  starterCode: string;
  handlefunction: ((fn: any) => Boolean) | string;
  startFunctionName: string;
};

export type DBProblem = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  likes: number;
  dislikes: number;
  order: number;
  videoId?: string;
};
