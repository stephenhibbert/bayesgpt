// Home.tsx
"use client";

import { TextAreaForm } from "@/components/text-area-form";
import { Probabilities } from "@/types";
import { useState } from "react";
import Reasoning from "@/components/reasoning";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import Sponsor from "@/components/sponsor";
import Maths from "@/components/maths";
import { Geometry } from "@/components/geometry";
import BlurPlaceholder from "@/components/blur";

export default function Home() {
  const [probabilities, setProbabilities] = useState<Probabilities>();

  const handleChildData = (data: Probabilities) => {
    setProbabilities(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center m-4 space-x-4 space-y-4">
      <span className="text-6xl font-bold">BayesGPT</span>
      <span className="max-w-3xl">
        Inspired by{" "}
        <a
          href="https://youtu.be/HZGCoVF3YvM?si=dRC8Fd7VkiJspnGn"
          target="_blank"
          className="text-blue-500"
        >
          Bayes theorem, the geometry of changing beliefs
        </a>
        , this educational tool uses a Large Language Model (LLM) to calculate
        some rough initial probabilities of a hypothesis given evidence.
      </span>
      <Alert className="max-w-2xl" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning!</AlertTitle>
        <AlertDescription>
          The generated prior and likelihood probabilities are a guess, adjust the sliders in the geometry panel to reflect your own beliefs.
        </AlertDescription>
      </Alert>
      <div className="md:grid md:grid-cols-2 md:gap-12">
        <TextAreaForm onSendData={handleChildData}/>
        {probabilities ? (
          <Reasoning probabilities={probabilities} />
        ) : (
          <BlurPlaceholder />
        )}
        {probabilities ? (
          <Maths probabilities={probabilities} />
        ) : (
          <BlurPlaceholder />
        )}
        {probabilities ? (
          <Geometry
            probabilities={probabilities}
            onUpdateProbabilities={handleChildData}
          />
        ) : (
          <BlurPlaceholder />
        )}
        <Sponsor />
      </div>
    </main>
  );
}