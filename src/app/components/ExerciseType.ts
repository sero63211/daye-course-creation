// components/ExerciseTypeSelector.ts
import { StepType } from "../types/model";

export interface ExerciseType {
  type: StepType;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export default ExerciseType;
