import React, { useEffect, useState } from "react";
import AdminPageMain from "@/components/custom/AdminPageMain";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  User,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MapFinderDialog from "@/components/MapFinder";

const EmployerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/my-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      // toast({
      //   title: "Error",
      //   description: "Failed to load bookings.",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAddFeedback = (booking: any) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment("");
    setIsFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedBooking) return;
    try {
      await api.post(`/feedbacks/bookings/${selectedBooking.id}`, {
        to_user_id: selectedBooking.worker.id,
        booking_id: selectedBooking.id,
        rating,
        comment,
      });
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been saved.",
      });
      setIsFeedbackDialogOpen(false);
      fetchBookings();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit feedback.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status });
      toast({ title: "Success", description: `Booking ${status}` });
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update booking.",
        variant: "destructive",
      });
    }
  };

  // --- counts ---
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const activeCount = bookings.filter((b) => b.status === "active").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  const BookingCard = ({ booking }: { booking: any }) => {
    const worker = booking.worker;

    return (
      <Card
        key={booking.id}
        className="shadow-soft hover:shadow-medium transition-smooth"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{booking.job_title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                {worker?.name}
              </CardDescription>
            </div>
            <Badge
              className={`text-white
                ${booking.status === "pending" && "bg-orange-500"}
                ${booking.status === "active" && "bg-green-500"}
                ${booking.status === "completed" && "bg-primary text-black"}
                ${booking.status === "cancelled" && "bg-red-500"}
              `}
            >
              {booking.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{booking.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              ₱{booking.salary ?? "N/A"}/day
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Contact</span>
            {worker.contact_number}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Booked {new Date(booking.created_at).toLocaleDateString()}</span>
          </div>

          {booking.status === "active" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-500 text-white"
                onClick={() => handleUpdateStatus(booking.id, "completed")}
              >
                Mark Completed
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleUpdateStatus(booking.id, "cancelled")}
              >
                Cancel
              </Button>
            </div>
          )}

          {booking.status === "completed" && !booking.workerIsRated && (
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              size="sm"
              onClick={() => handleAddFeedback(booking)}
            >
              <Star className="h-4 w-4" /> Rate Worker
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminPageMain title="My Bookings" description="Manage your worker bookings" topAction={
      <MapFinderDialog />
    }>
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-primary">{completedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-red-500">{cancelledCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold">Your Bookings ({bookings.length})</h2>

      {/* Bookings Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledCount})</TabsTrigger>
        </TabsList>

        {["all", "pending", "active", "completed", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {(tab === "all"
                ? bookings
                : bookings.filter((b) => b.status === tab)
              ).map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>

            {(tab === "all"
              ? bookings
              : bookings.filter((b) => b.status === tab)
            ).length === 0 &&
              !loading && (
                <Card className="shadow-soft">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No {tab} bookings
                    </h3>
                    <p className="text-muted-foreground">Nothing here yet</p>
                  </CardContent>
                </Card>
              )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Worker</DialogTitle>
            <DialogDescription>
              Provide a rating and feedback for{" "}
              <span className="font-medium">
                {selectedBooking?.worker?.name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rating Stars */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 ${
                    rating >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  <Star className="h-12 w-12 fill-current" />
                </button>
              ))}
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFeedbackDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={rating === 0} onClick={handleSubmitFeedback}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageMain>
  );
};

export default EmployerBookings;
