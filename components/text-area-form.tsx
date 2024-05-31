"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useState } from 'react';
import { Probabilities } from '@/types';
import { submitForm } from '@/actions/submit';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FormSchema = z.object({
  hypothesis: z.string().min(10, "Hypothesis must be at least 10 characters").default(''),
  evidence: z.string().min(10, "Evidence must be at least 10 characters").default(''),
})

export function TextAreaForm({ onSendData }: { onSendData: (data: Probabilities) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [probabilities, setProbabilities] = useState<Probabilities>({
    P_E_given_H: 0,
    P_E_given_not_H: 0,
    P_H: 0,
    P_H_given_E: 0,
    P_E: 0,
    P_E_given_H_CoT: '',
    P_H_given_E_CoT: '',
    P_H_CoT: '',
    P_E_given_not_H_CoT: '',
    P_population_noun: '',
    P_population_description: '',
    hypothesisEvidence: '',
    hypothesisNotEvidence: '',
    notHypothesisEvidence: '',
    notHypothesisNotEvidence: ''
  });

  const selectedHypothesis = form.watch('hypothesis');
  const selectedEvidence = form.watch('evidence');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendDataToParent = (data: Probabilities) => {
    onSendData(data);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true); // Disable the submit button
    console.log(data);
    const updatedProbabilities = await submitForm(data);
    setProbabilities(updatedProbabilities);
    sendDataToParent(updatedProbabilities);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    setProbabilities({
      P_E_given_H: 0,
      P_E_given_not_H: 0,
      P_H: 0,
      P_H_given_E: 0,
      P_E: 0,
      P_E_given_H_CoT: '',
      P_H_CoT: '',
      P_E_given_not_H_CoT: '',
      P_H_given_E_CoT: '',
      P_population_noun: '',
      P_population_description: '',
      hypothesisEvidence: '',
      hypothesisNotEvidence: '',
      notHypothesisEvidence: '',
      notHypothesisNotEvidence: ''
    });
    setIsSubmitting(false); // Re-enable the submit button
  }

  const handleSelect = (value: string) => {
    const selectedExample = examples.find(example => example.hypothesis === value);
    if (selectedExample) {
      //@ts-ignore
      sendDataToParent(undefined);
      form.setValue('hypothesis', selectedExample.hypothesis);
      form.setValue('evidence', selectedExample.evidence);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario</CardTitle>
        <CardDescription></CardDescription>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {examples.map((example, index) => (
                <SelectItem key={index} value={example.hypothesis}>
                  {example.hypothesis}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/3 space-y-6">
            <FormField
              control={form.control}
              name="hypothesis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Hypothesis</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your hypothesis" className="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Evidence</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your evidence" className="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="flex items-center">
              {isSubmitting && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

const examples = [
  {
      "hypothesis": "Election fraud occurred.",
      "evidence": "In a small town called Fairview, there’s an election for the mayor’s office. The main candidates are Alice and Bob. On election night, Bob wins by a narrow margin. However, Alice’s supporters suspect election fraud and demand an investigation."
  }
]