import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, XCircle, MessageSquare, Calendar, ArrowRightLeft } from "lucide-react";

type SwapStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

interface SwapRequestCardProps {
  _id: string;
  requesterName: string;
  requesterAvatar?: string;
  offeredSkill: string;
  wantedSkill: string;
  message?: string;
  status: SwapStatus;
  createdAt: string;
  type: 'sent' | 'received';
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onMessage?: () => void;
}

const statusConfig = {
  pending: { 
    color: 'bg-warning/10 text-warning border-warning/20', 
    borderColor: 'border-l-warning bg-warning/5',
    icon: Clock, 
    label: 'Pending' 
  },
  accepted: { 
    color: 'bg-success/10 text-success border-success/20', 
    borderColor: 'border-l-success bg-success/5',
    icon: CheckCircle, 
    label: 'Accepted' 
  },
  rejected: { 
    color: 'bg-destructive/10 text-destructive border-destructive/20', 
    borderColor: 'border-l-destructive bg-destructive/5',
    icon: XCircle, 
    label: 'Rejected' 
  },
  completed: { 
    color: 'bg-primary/10 text-primary border-primary/20', 
    borderColor: 'border-l-primary bg-primary/5',
    icon: CheckCircle, 
    label: 'Completed' 
  },
  cancelled: { 
    color: 'bg-muted text-muted-foreground border-muted', 
    borderColor: 'border-l-muted bg-muted/10',
    icon: XCircle, 
    label: 'Cancelled' 
  }
};

export const SwapRequestCard = ({
  _id,
  requesterName,
  requesterAvatar,
  offeredSkill,
  wantedSkill,
  message,
  status,
  createdAt,
  type,
  onAccept,
  onReject,
  onCancel,
  onMessage
}: SwapRequestCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 border-0 shadow border border-border/40 bg-card dark:bg-[#050505]/50">
      {/* Dynamic Status Glow Backgrounds */}
      <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-500 ${config.color.split(' ')[0]}`}></div>
      <div className={`absolute bottom-0 left-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-2xl -ml-5 -mb-5 transition-opacity duration-500 ${config.color.split(' ')[0]}`}></div>
      
      {/* Sharp status indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${config.borderColor} opacity-100 z-20`} />

      <CardContent className="p-0 flex flex-col md:flex-row relative z-10">
        {/* Left Pane: User & Status (1/3 width) */}
        <div className="p-6 md:w-[30%] flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/30 bg-muted/10 dark:bg-black/40 backdrop-blur-sm">
          <Avatar className="w-16 h-16 border-[3px] border-background shadow-md mb-3 ring-2 ring-primary/10">
            <AvatarImage src={requesterAvatar} alt={requesterName} />
            <AvatarFallback className="bg-primary/90 text-primary-foreground text-lg">
              {requesterName?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-bold text-lg mb-1 text-foreground/90">{requesterName}</h3>
          <p className="text-[11px] text-muted-foreground/80 mb-5 font-medium uppercase tracking-wider">
            {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          
          <Badge className={`${config.color} uppercase tracking-widest text-[10px] py-1 px-3 shadow-sm border`}>
            <StatusIcon className="w-3 h-3 mr-1.5" />
            {config.label}
          </Badge>
        </div>

        {/* Right Pane: Exchange Details (2/3 width) */}
        <div className="p-6 md:w-[70%] flex flex-col justify-between">
          <div className="flex-1">
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-3.5 h-3.5 opacity-70" /> Exchange Details
            </h4>

            {/* Skill Exchange Blocks */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex flex-col justify-center items-start">
                <p className="text-[9px] text-primary/70 uppercase font-bold tracking-widest mb-1">
                  {type === 'sent' ? 'You Provide' : 'They Provide'}
                </p>
                <p className="font-semibold text-primary/90 text-sm">{offeredSkill}</p>
              </div>
              
              <div className="bg-secondary/5 rounded-xl p-3 border border-secondary/10 flex flex-col justify-center items-start">
                <p className="text-[9px] text-secondary/70 uppercase font-bold tracking-widest mb-1">
                  {type === 'sent' ? 'You Receive' : 'They Receive'}
                </p>
                <p className="font-semibold text-secondary/90 text-sm">{wantedSkill}</p>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="bg-muted/30 rounded-lg p-3 text-xs italic text-muted-foreground/90 border-l-2 border-primary/30 shadow-inner">
                "{message}"
              </div>
            )}
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-border/30 gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full">
              {status === 'accepted' && (
                <Button variant="ghost" size="sm" onClick={onMessage} className="text-muted-foreground hover:bg-primary/15 hover:text-primary transition-colors w-full sm:w-auto">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              )}

              {type === 'received' && status === 'pending' && (
                <>
                  <Button variant="outline" size="sm" onClick={onReject} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors w-full sm:w-auto">
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Decline
                  </Button>
                  <Button size="sm" onClick={onAccept} className="bg-success text-success-foreground hover:bg-success/90 shadow-md w-full sm:w-auto">
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Accept
                  </Button>
                </>
              )}
              
              {type === 'sent' && status === 'pending' && (
                <Button variant="outline" size="sm" onClick={onCancel} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors w-full sm:w-auto">
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Cancel Request
                </Button>
              )}
              
              {status === 'cancelled' && type === 'sent' && (
                <span className="text-[10px] text-muted-foreground/80 font-medium text-center sm:text-right w-full sm:w-auto">Available to resend in 48h</span>
              )}

              {status === 'rejected' && type === 'sent' && (
                <span className="text-[10px] text-muted-foreground/80 font-medium text-center sm:text-right w-full sm:w-auto">Available to resend in 15 days</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};