import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useTrain() {
  const queryClient = useQueryClient();

  const trainTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await api.post("/train/text", { text });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Text trained successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to train text.");
    },
  });

  const trainFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/train_file/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("File uploaded and trained successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to upload file.");
    },
  });

  return {
    trainText: trainTextMutation.mutateAsync, // Expose async for await usage if needed
    isTrainingText: trainTextMutation.isPending,
    trainFile: trainFileMutation.mutateAsync,
    isTrainingFile: trainFileMutation.isPending,
  };
}
