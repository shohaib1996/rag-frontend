import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export type Document = {
  id: string;
  filename: string;
  file_type: string;
  created_at: string;
};

export function useDocuments() {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await api.get<Document[]>("/documents");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete document");
    },
  });

  return {
    documents: documents || [],
    isLoading,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
