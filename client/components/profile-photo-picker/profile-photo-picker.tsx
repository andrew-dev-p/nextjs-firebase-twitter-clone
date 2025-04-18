import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Check, Upload, RefreshCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { uploadFileAndGetUrl } from "@/firebase/storage";

import { COLORS } from "./constants";
import { PATTERNS } from "./patterns";
import { useAvatarGenerator } from "./avatar-generator";

interface ProfilePhotoPickerProps {
  onPhotoSelect: (photoUrl: string | null) => void;
}

export function ProfilePhotoPicker({ onPhotoSelect }: ProfilePhotoPickerProps) {
  const {
    canvasRef,
    bgColor,
    setBgColor,
    fgColor,
    setFgColor,
    pattern,
    setPattern,
    complexity,
    setComplexity,
    generatedAvatarUrl,
    generateRandomAvatar,
    generateAvatar,
  } = useAvatarGenerator();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const storagePath = `profile-photos/${crypto.randomUUID()}-${file.name}`;
      const url = await uploadFileAndGetUrl(storagePath, file);
      console.log(url);

      setPhotoUrl(url);
      onPhotoSelect(url);
    }
  };

  function dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)?.[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }

  const handleAvatarSelect = async () => {
    const avatarUrl = generateAvatar();
    if (avatarUrl) {
      const blob = dataURLtoBlob(avatarUrl);
      const storagePath = `profile-photos/generated-${crypto.randomUUID()}.png`;
      const url = await uploadFileAndGetUrl(storagePath, blob);
      setPhotoUrl(url);
      onPhotoSelect(url);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (activeTab === "generate") {
      generateAvatar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgColor, fgColor, pattern, complexity, activeTab]);

  return (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-24 w-24 rounded-full"
              onClick={() => setOpen(true)}
            >
              {photoUrl ? (
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoUrl} alt="Profile" />
                  <AvatarFallback>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Choose profile photo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <canvas ref={canvasRef} width={200} height={200} className="hidden" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile photo</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoUrl || ""} alt="Preview" />
                  <AvatarFallback>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <div className="grid w-full gap-2">
                  <Label htmlFor="picture" className="sr-only">
                    Picture
                  </Label>
                  <Input
                    id="picture"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={generatedAvatarUrl || ""}
                    alt="Generated Avatar"
                  />
                  <AvatarFallback>
                    <RefreshCw className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={generateRandomAvatar}
                >
                  <Shuffle className="h-4 w-4" />
                  Randomize
                </Button>

                <div className="grid w-full gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className="h-6 w-6 rounded-full flex items-center justify-center ring-2 ring-transparent hover:ring-neutral-300 transition duration-400"
                          style={{ backgroundColor: color }}
                          onClick={() => setBgColor(color)}
                          aria-label={`Background color: ${color}`}
                        >
                          {bgColor === color && (
                            <Check className="h-4 w-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Foreground Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className="h-6 w-6 rounded-full flex items-center justify-center ring-2 ring-transparent hover:ring-neutral-300 transition duration-400"
                          style={{ backgroundColor: color }}
                          onClick={() => setFgColor(color)}
                          aria-label={`Foreground color: ${color}`}
                        >
                          {fgColor === color && (
                            <Check className="h-4 w-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pattern</Label>
                    <div className="flex flex-wrap gap-2">
                      {PATTERNS.map((p) => (
                        <Button
                          type="button"
                          key={p.name}
                          variant={pattern === p.name ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPattern(p.name)}
                        >
                          {p.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Complexity</Label>
                      <span className="text-xs text-muted-foreground">
                        {complexity}%
                      </span>
                    </div>
                    <Slider
                      value={[complexity]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setComplexity(value[0])}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={
                activeTab === "upload"
                  ? () => setOpen(false)
                  : handleAvatarSelect
              }
            >
              {activeTab === "upload"
                ? "Use Uploaded Photo"
                : "Use Generated Avatar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
