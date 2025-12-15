"use client";

import { useState } from "react";
import { useTrain } from "@/hooks/useTrain";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud, File as FileIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface TrainBotModalProps {
  children: React.ReactNode;
}

export function TrainBotModal({ children }: TrainBotModalProps) {
  const { trainText, isTrainingText, trainFile, isTrainingFile } = useTrain();
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    await trainText(textInput);
    setTextInput("");
    setOpen(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
  });

  const handleFileSubmit = async () => {
    if (!file) return;
    await trainFile(file);
    setFile(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Train Your Bot</DialogTitle>
          <DialogDescription>
            Add new knowledge to your bot by uploading files or adding text
            snippets.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="text" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>

          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="training-text">Training Data</Label>
              <Textarea
                id="training-text"
                placeholder="Paste the text you want the bot to learn here..."
                className="min-h-[150px]"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleTextSubmit}
              disabled={isTrainingText || !textInput.trim()}
            >
              {isTrainingText && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isTrainingText ? "Training..." : "Start Training"}
            </Button>
          </TabsContent>

          {/* File Tab */}
          <TabsContent value="file" className="space-y-4 pt-4">
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-center">
                  Drag & drop a file here, or click to select
                </p>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Supports PDF, DOCX, TXT
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  disabled={isTrainingFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleFileSubmit}
              disabled={isTrainingFile || !file}
            >
              {isTrainingFile && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isTrainingFile ? "Uploading & Training..." : "Upload and Train"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
