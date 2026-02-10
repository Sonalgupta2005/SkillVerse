import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SwapRequestCard } from "@/components/SwapRequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Clock, CheckCircle, Users } from "lucide-react";
import { useMySwaps } from "@/hooks/useMySwaps";
import { useUpdateSwap } from "@/hooks/useUpdateSwap";
import { useAuth } from "@/contexts/AuthContext";

export type SwapStatus = "pending" | "accepted" | "rejected" | "cancelled";
const MySwaps = () => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  /* =======================
     DATA (SINGLE SOURCE)
     ======================= */
  const { data: swaps = [], isLoading } = useMySwaps();
  const { mutate: updateSwap } = useUpdateSwap();

  const {user}=useAuth();
  const sentSwaps = swaps.filter(
    swap => swap.fromUser._id === user?._id
  );

  const receivedSwaps = swaps.filter(
    swap => swap.toUser._id === user?._id
  );

  /* =======================
     STATS
     ======================= */
  const stats = {
    total: swaps.length,
    pending: swaps.filter(s => s.status === "pending").length,
    completed: swaps.filter(s => s.status === "accepted").length
  };

  /* =======================
     ACTIONS
     ======================= */
  const handleUpdate = (id: string, status: SwapStatus) => {
    updateSwap({ id, status });
  };

  const handleMessage = (swapId: string) => {
    console.log(`Open chat for swap ${swapId}`);
  };

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              My{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Skill Swaps
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your skill exchange requests.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row justify-between pb-2">
                <CardTitle className="text-sm">Total Swaps</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between pb-2">
                <CardTitle className="text-sm">Pending</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between pb-2">
                <CardTitle className="text-sm">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Swap Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="received">
                    Received
                    {receivedSwaps.length > 0 && (
                      <Badge className="ml-2">{receivedSwaps.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="sent">
                    Sent
                    {sentSwaps.length > 0 && (
                      <Badge className="ml-2">{sentSwaps.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* RECEIVED */}
                <TabsContent value="received" className="mt-6 space-y-4">
                  {isLoading ? (
                    <p className="text-muted-foreground text-center">
                      Loading swaps…
                    </p>
                  ) : receivedSwaps.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                      No received requests.
                    </p>
                  ) : (
                    receivedSwaps.map(swap => (
                      <SwapRequestCard
                        key={swap._id}
                        type="received"
                        {...swap}
                        onAccept={() =>
                          handleUpdate(swap._id, "accepted")
                        }
                        onReject={() =>
                          handleUpdate(swap._id, "rejected")
                        }
                        onMessage={() => handleMessage(swap._id)}
                      />
                    ))
                  )}
                </TabsContent>

                {/* SENT */}
                <TabsContent value="sent" className="mt-6 space-y-4">
                  {sentSwaps.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                      No sent requests.
                    </p>
                  ) : (
                    sentSwaps.map(swap => (
                      <SwapRequestCard
                        key={swap._id}
                        type="sent"
                        {...swap}
                        onCancel={() =>
                          handleUpdate(swap._id, "cancelled")
                        }
                        onMessage={() => handleMessage(swap._id)}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MySwaps;
