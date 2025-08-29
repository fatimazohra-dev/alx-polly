"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Plus } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useFieldArray } from "react-hook-form";

// Schema validation following our TypeScript rules
const createPollSchema = z.object({
  title: z.string().min(1, "Poll title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
  allowMultipleVotes: z.boolean().default(false),
  endsAt: z.string().optional(),
});

type CreatePollFormData = z.infer<typeof createPollSchema>;

export function CreatePollForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // React Hook Form with Zod validation following our form rules
  const form = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: ["", ""],
      allowMultipleVotes: false,
      endsAt: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: CreatePollFormData) => {
    if (!user) {
      setError("You must be logged in to create a poll");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement Supabase poll creation following our database rules
      console.log("Creating poll:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to new poll (following our routing patterns)
      router.push('/polls'); // Will redirect to actual poll when created
    } catch (error) {
      console.error("Poll creation error:", error);
      setError("Failed to create poll. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    if (fields.length < 10) {
      append("");
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Poll Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What would you like to ask?" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Create a clear and engaging question for your poll
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Poll Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide more context for your poll..."
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Add additional context to help people understand your poll
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Poll Options - Following our component composition rules */}
        <div className="space-y-4">
          <FormLabel>Poll Options</FormLabel>
          <FormDescription>
            Add the options people can vote for (minimum 2, maximum 10)
          </FormDescription>
          
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`options.${index}`}
              render={({ field: optionField }) => (
                <FormItem>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={`Option ${index + 1}`}
                            {...optionField}
                            disabled={isLoading}
                          />
                        </FormControl>
                        {fields.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOption(index)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
          ))}
          
          {/* Add Option Button - Following Shadcn/ui patterns */}
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            disabled={isLoading || fields.length >= 10}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option {fields.length < 10 ? `(${fields.length}/10)` : "(Max reached)"}
          </Button>
        </div>

        {/* Multiple Votes Toggle */}
        <FormField
          control={form.control}
          name="allowMultipleVotes"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Allow Multiple Votes
                </FormLabel>
                <FormDescription>
                  Let users select multiple options instead of just one
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* End Date Field */}
        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={isLoading}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </FormControl>
              <FormDescription>
                Set when this poll should stop accepting votes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Buttons - Following our button patterns */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create Poll"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            disabled={isLoading}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
