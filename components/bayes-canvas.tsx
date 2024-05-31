'use client';
import { useRef, useEffect, useState } from 'react';
import { Probabilities } from '../types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BlockMath, InlineMath } from 'react-katex';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BayesCanvasProps {
  probabilities: Probabilities;
}

const BayesCanvas: React.FC<BayesCanvasProps> = ({ probabilities }) => {
  const items = [
    {
      term: <InlineMath math={`P(E|H)`} />,
      name: 'Likelihood',
      description: 'Probability of Evidence given the Hypothesis holds',
      value: probabilities.P_E_given_H.toFixed(2),
    },
    {
      term: <InlineMath math={`P(E|¬H)`} />,
      name: 'Alternative Likelihood',
      description: 'Probability of Evidence given the Hypothesis is false',
      value: probabilities.P_E_given_not_H.toFixed(2),
    },
    {
      term: <InlineMath math={`P(H)`} />,
      name: 'Prior',
      description: 'Initial Probability of Hypothesis',
      value: probabilities.P_H.toFixed(2),
    },
    {
      term: <InlineMath math={`P(E)`} />,
      name: 'Marginal',
      description: 'Probability of Evidence occurring no matter the Hypothesis',
      value: probabilities.P_E.toFixed(2),
    },
    {
      term: <InlineMath math={`P(H|E)`} />,
      name: 'Posterior',
      description: 'Our updated belief in the Hypothesis given the Evidence',
      value: probabilities.P_H_given_E.toFixed(2),
    },
  ]

  return (
      <Card>
        <CardHeader>
          <CardTitle>Maths</CardTitle>
          {/* <CardDescription></CardDescription> */}
        </CardHeader>
      <CardContent>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Term</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>          
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.term}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <br/>
    <br/>
    <CardDescription>Step 1: Calculate <InlineMath math={`P(E)`} /></CardDescription>
        <BlockMath math={`P(E) = P(E|H) \\cdot P(H) + P(E|\\neg H) \\cdot P(\\neg H)`} />
      <BlockMath math={`P(E) = ${probabilities.P_E_given_H.toFixed(2)} \\cdot ${probabilities.P_H.toFixed(2)} + ${probabilities.P_E_given_not_H.toFixed(2)} \\cdot ${(1 - probabilities.P_H).toFixed(2)}`} />
      <BlockMath math={`P(E) = ${(probabilities.P_E_given_H * probabilities.P_H).toFixed(2)} + ${(probabilities.P_E_given_not_H * (1 - probabilities.P_H)).toFixed(2)}`} />

        <CardDescription>Step 2: Calculate the Posterior <InlineMath math={`P(H|E)`} /></CardDescription>
        <BlockMath math={`P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)}`} />
        <BlockMath math={`P(H|E) = \\frac{${probabilities.P_E_given_H.toFixed(2)} \\cdot ${probabilities.P_H.toFixed(2)}}{${probabilities.P_E.toFixed(2)}}`} />
        <BlockMath math={`P(H|E) = ${probabilities.P_H_given_E.toFixed(2)}`} />
    </CardContent>
  </Card>
  );
};

export default BayesCanvas;
