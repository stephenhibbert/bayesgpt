import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle
} from 'react-resizable-panels';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Probabilities } from "@/types";
import { InlineMath } from "react-katex";
import { Button } from "./ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

const ColorIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
`;

interface GeometryProps {
  probabilities: Probabilities;
  onUpdateProbabilities: (data: Probabilities) => void;
}

const AxisLabel = styled.div`
  position: absolute;
  font-weight: bold;
  text-align: center;
  transform: translate(-50%, -50%);
`;

export const Geometry: React.FC<GeometryProps> = ({ probabilities, onUpdateProbabilities }) => {
  const initialProbabilities = useRef(JSON.parse(JSON.stringify(probabilities)));
  const [areaOne, setAreaOne] = useState(0);
  const [areaTwo, setAreaTwo] = useState(0);
  const [areaThree, setAreaThree] = useState(0);
  const [areaFour, setAreaFour] = useState(0);
  const [updatedProbabilities, setUpdatedProbabilities] = useState(probabilities);

  const groupRef1 = useRef(null);
  const groupRef2 = useRef(null);
  const groupRef3 = useRef(null);

  // Update the initial probabilities when the probabilities change
  useEffect(() => {
    setUpdatedProbabilities(probabilities);
  }, [probabilities]);

  useEffect(() => {
    const hypothesisWidth = updatedProbabilities.P_H * 100;
    const likelihoodHeight = updatedProbabilities.P_E_given_H * 100;
    const alternativeLikelihoodHeight = updatedProbabilities.P_E_given_not_H * 100;

    setAreaOne(updatedProbabilities.P_H * (1 - updatedProbabilities.P_E_given_H) * 100);
    setAreaTwo(updatedProbabilities.P_H * updatedProbabilities.P_E_given_H * 100);
    setAreaThree((1 - updatedProbabilities.P_H) * (1 - updatedProbabilities.P_E_given_not_H) * 100);
    setAreaFour(updatedProbabilities.P_E_given_not_H * (1 - updatedProbabilities.P_H) * 100);

    // @ts-ignore
    if (updatedProbabilities.P_E_given_H === 0 && updatedProbabilities.P_E_given_not_H === 0) {
      // @ts-ignore
      groupRef1.current?.setLayout([50, 50]);
      // @ts-ignore
      groupRef2.current?.setLayout([50, 50]);
      // @ts-ignore
      groupRef3.current?.setLayout([50, 50]);
    } else {
      // @ts-ignore
      groupRef1.current?.setLayout([hypothesisWidth, 100 - hypothesisWidth]);
      // @ts-ignore
      groupRef2.current?.setLayout([100 - likelihoodHeight, likelihoodHeight]);
      // @ts-ignore
      groupRef3.current?.setLayout([100 - alternativeLikelihoodHeight, alternativeLikelihoodHeight]);
    }
  }, [updatedProbabilities]);

  const onLayout1 = (sizes: number[]) => {
    const P_H = sizes[0] / 100;
    const newProbabilities = { ...updatedProbabilities, P_H };
    newProbabilities.P_E = newProbabilities.P_E_given_H * newProbabilities.P_H + newProbabilities.P_E_given_not_H * (1 - newProbabilities.P_H);
    newProbabilities.P_H_given_E = newProbabilities.P_E_given_H * newProbabilities.P_H / newProbabilities.P_E;
    setUpdatedProbabilities(newProbabilities);
    onUpdateProbabilities(newProbabilities);
  };

  const onLayout2 = (sizes: number[]) => {
    const P_E_given_H = sizes[1] / 100;
    const newProbabilities = { ...updatedProbabilities, P_E_given_H };
    newProbabilities.P_E = newProbabilities.P_E_given_H * newProbabilities.P_H + newProbabilities.P_E_given_not_H * (1 - newProbabilities.P_H);
    newProbabilities.P_H_given_E = newProbabilities.P_E_given_H * newProbabilities.P_H / newProbabilities.P_E;
    setUpdatedProbabilities(newProbabilities);
    onUpdateProbabilities(newProbabilities);
  };

  const onLayout3 = (sizes: number[]) => {
    const P_E_given_not_H = sizes[1] / 100;
    const newProbabilities = { ...updatedProbabilities, P_E_given_not_H };
    newProbabilities.P_E = newProbabilities.P_E_given_H * newProbabilities.P_H + newProbabilities.P_E_given_not_H * (1 - newProbabilities.P_H);
    newProbabilities.P_H_given_E = newProbabilities.P_E_given_H * newProbabilities.P_H / newProbabilities.P_E;
    setUpdatedProbabilities(newProbabilities);
    onUpdateProbabilities(newProbabilities);
  };

  const resetProbabilities = () => {
    const newProbabilities = initialProbabilities.current;
    console.log('initial', newProbabilities);
    console.log('current', updatedProbabilities);
    setUpdatedProbabilities(newProbabilities);
    onUpdateProbabilities(newProbabilities);
  }

  const items = [
    {
      term: <InlineMath math={`P(E|H) \\cdot P(H))`} />,
      description: probabilities.hypothesisEvidence,
      value: `${(updatedProbabilities.P_H * updatedProbabilities.P_E_given_H * 100).toFixed(2)}%`,
      color: 'bg-purple-300'
    },
    {
      term: <InlineMath math={`P(E|\\neg H) \\cdot P(\\neg H)`} />,
      description: probabilities.notHypothesisEvidence,
      value: `${(updatedProbabilities.P_E_given_not_H * (1 - updatedProbabilities.P_H) * 100).toFixed(2)}%`,
      color: 'bg-blue-300'
    }
  ]

  return (
    <div className="h-full w-full relative">
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Geometry</CardTitle>
          <CardDescription>A geometric representation of the probability mass</CardDescription>
          <Button variant="secondary" onClick={resetProbabilities}>
            Reset Probabilities
          </Button>
        </CardHeader>
        <CardContent className="h-[calc(100vh-150px)] relative">
          <AxisLabel style={{ 
              bottom: `${((updatedProbabilities.P_E_given_not_H * 100)/2) - 2}%`, 
              right: "-8%", 
              backgroundColor: 'rgba(255, 255, 255, 0.5)', 
              backdropFilter: 'blur(5px)' 
          }}><InlineMath math={`P(E|¬H)`} /></AxisLabel>

          <AxisLabel style={{ 
              bottom: `${((updatedProbabilities.P_E_given_H * 100)/2) - 1.5}%`, 
              left: "2%", 
              backgroundColor: 'rgba(255, 255, 255, 0.5)', 
              backdropFilter: 'blur(5px)' 
          }}><InlineMath math={`P(E|H)`} /></AxisLabel>

          <AxisLabel style={{ 
              bottom: "0%", 
              left: `${(((updatedProbabilities.P_H * 100) / 2) + 5).toFixed(0)}%`, 
              backgroundColor: 'rgba(255, 255, 255, 0.5)', 
              backdropFilter: 'blur(5px)' 
          }}><InlineMath math={`P(H)`} /></AxisLabel>

          <AxisLabel style={{ 
              bottom: "0%", 
              right: `${((((1 - updatedProbabilities.P_H) * 100) / 2) - 5).toFixed(0)}%`, 
              backgroundColor: 'rgba(255, 255, 255, 0.5)', 
              backdropFilter: 'blur(5px)' 
          }}><InlineMath math={`P(¬H)`} /></AxisLabel>
          
          <PanelGroup ref={groupRef1} onLayout={onLayout1} direction="horizontal" className="h-full w-full border">
            <Panel defaultSize={50}>
              <PanelGroup ref={groupRef2} onLayout={onLayout2} direction="vertical" className="h-full w-full border">
                <Panel defaultSize={50} className="bg-red-200">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex h-full items-center justify-center p-6">
                          <span className="font-semibold">{areaOne.toFixed(0)}%</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ColorIndicator style={{ backgroundColor: 'rgb(254, 202, 202)' }} />
                        <span>{probabilities.hypothesisNotEvidence}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={50} className="bg-purple-400">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex h-full items-center justify-center p-6">
                          <span className="font-semibold">{areaTwo.toFixed(0)}%</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ColorIndicator style={{ backgroundColor: 'rgb(192, 132, 252)' }} />
                        <span>{probabilities.hypothesisEvidence}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Panel>
              </PanelGroup>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={50} className="bg-amber-200">
              <PanelGroup ref={groupRef3} onLayout={onLayout3} direction="vertical" className="h-full w-full border">
                <Panel defaultSize={50}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex h-full items-center justify-center p-6">
                          <span className="font-semibold">{areaThree.toFixed(0)}%</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ColorIndicator style={{ backgroundColor: 'rgb(252, 211, 77)' }} />
                        <span>{probabilities.notHypothesisNotEvidence}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={50} className="bg-blue-400">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex h-full items-center justify-center p-6">
                          <span className="font-semibold">{areaFour.toFixed(0)}%</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ColorIndicator style={{ backgroundColor: 'rgb(96, 165, 250)' }} />
                        <span>{probabilities.notHypothesisEvidence}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Panel>
              </PanelGroup>
              </Panel>
      </PanelGroup>
    </CardContent>
    <CardFooter>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Term</TableHead>
          <TableHead>Description</TableHead>          
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow className={item.color} key={item.description}>
            <TableCell>{item.term}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </CardFooter>
  </Card>
</div>
);
};