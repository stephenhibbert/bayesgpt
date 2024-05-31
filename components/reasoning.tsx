import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Probabilities } from '../types';
import BayesCanvas from '@/components/bayes-canvas';

import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ReasoningProps {
  probabilities: Probabilities;
}

const Reasoning: React.FC<ReasoningProps> = ({ probabilities }) => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Reasoning</CardTitle>
    </CardHeader>
    <CardContent>
    <CardDescription>Prior</CardDescription>
      <Textarea placeholder={probabilities.P_H_CoT} disabled />
    <CardDescription>Likelihood</CardDescription>
      <Textarea placeholder={probabilities.P_E_given_H_CoT} disabled />
    <CardDescription>Alternative Likelihood</CardDescription>
      <Textarea placeholder={probabilities.P_E_given_not_H_CoT} disabled />
    </CardContent>
  </Card>
  );
};

export default Reasoning;
