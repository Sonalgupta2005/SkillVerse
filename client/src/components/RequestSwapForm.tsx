import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateSwap } from "@/hooks/useCreateSwap";

interface RequestSwapFormProps {
  isOpen: boolean;
  onClose: () => void;
  toUserId: string;
  toUserName: string;
  toUserSkillsWanted: Array<{ name: string; level: string }>;
  toUserSkillsOffered: Array<{ name: string; level: string }>;
}

export const RequestSwapForm = ({
  isOpen,
  onClose,
  toUserId,
  toUserName,
  toUserSkillsWanted,
  toUserSkillsOffered
}: RequestSwapFormProps) => {
  const [offeredSkill, setOfferedSkill] = useState("");
  const [wantedSkill, setWantedSkill] = useState("");
  const [message, setMessage] = useState("");

  const { toast } = useToast();
  const { mutate: createSwap, isPending } = useCreateSwap();

  const resetForm = () => {
    setOfferedSkill("");
    setWantedSkill("");
    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!offeredSkill || !wantedSkill) {
      toast({
        title: "Missing Information",
        description: "Please select both skills for the swap.",
        variant: "destructive"
      });
      return;
    }

    createSwap(
      {
        toUser: toUserId,
        offeredSkill,
        wantedSkill,
        message:
          message || `Hi ${toUserName}, I'd like to propose a skill swap!`
      },
      {
        onSuccess: () => {
          toast({
            title: "Swap Request Sent",
            description: `Your request has been sent to ${toUserName}.`
          });
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.message || "Failed to send swap request.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Skill Swap</DialogTitle>
          <DialogDescription>
            Send a skill swap request to {toUserName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OFFERED */}
          <div className="space-y-2">
            <Label>What you want to offer</Label>
            <Select value={offeredSkill} onValueChange={setOfferedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you can teach" />
              </SelectTrigger>
              <SelectContent>
                {toUserSkillsWanted.map((skill, i) => (
                  <SelectItem key={i} value={skill.name}>
                    {skill.name} ({skill.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* WANTED */}
          <div className="space-y-2">
            <Label>What do you want</Label>
            <Select value={wantedSkill} onValueChange={setWantedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you want to learn" />
              </SelectTrigger>
              <SelectContent>
                {toUserSkillsOffered.map((skill, i) => (
                  <SelectItem key={i} value={skill.name}>
                    {skill.name} ({skill.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <Label>Message (optional)</Label>
            <Textarea
              placeholder={`Hi ${toUserName}, I'd like to propose a skill swap!`}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
