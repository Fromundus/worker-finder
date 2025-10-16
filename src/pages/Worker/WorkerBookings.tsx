import AdminPageMain from "@/components/custom/AdminPageMain";
import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Building,
  Users,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MessageButton from "@/components/MessageButton";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";

const WorkerBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { user } = useAuth();

  // Fetch bookings for worker
  const fetchBookings = async () => {
    try {
      const res = await api.get("/my-bookings"); // Worker-specific bookings API
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      // toast({
      //   title: "Error",
      //   description: "Failed to load bookings",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Accept or Cancel booking
  const handleBookingAction = async (
    bookingId: number,
    action: string,
  ) => {
    try {
      const res = await api.put(`/bookings/${bookingId}`, {
        status: action,
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? res.data.booking : b))
      );
      toast({
        title: `Booking ${action}`,
        description: `The booking has been marked as ${action}.`,
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };

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
        to_user_id: selectedBooking.employer.id,
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

  // Status filters
  const pending = bookings.filter((b) => b.status === "pending");
  const active = bookings.filter((b) => b.status === "active");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const BookingCard = ({ booking }: { booking: any }) => {
    const employer = booking.employer;

    return (
      <Card className="shadow-soft hover:shadow-medium transition-smooth">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {employer?.business_name || `${employer?.first_name} ${employer?.middle_name} ${employer?.last_name} ${employer?.suffix ? employer?.suffix : ""}`}
              </CardTitle>
              <CardDescription>Employer</CardDescription>
            </div>
            <Badge
              className={`text-white
                ${booking.status === "pending" && "bg-orange-500"}
                ${booking.status === "active" && "bg-green-500"}
                ${booking.status === "completed" && "bg-primary text-black"}
                ${booking.status === "cancelled" && "bg-gray-500"}
              `}
            >
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Job Title</p>
              <p className="font-medium">{booking.job_title || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Description</p>
              <p className="font-medium">{booking.dsecription || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Salary</p>
              <p className="font-medium">Php {booking.salary || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Contact</p>
              <p className="font-medium">{employer?.contact_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{employer?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">
                  {employer?.average_rating || 0}/5
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Booked {new Date(booking.created_at).toLocaleDateString()}
            </span>
          </div>

          {booking.status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                className="bg-green-500 hover:bg-green-600 flex-1 text-white"
                size="sm"
                onClick={() => handleBookingAction(booking.id, "active")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Accept
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBookingAction(booking.id, "cancelled")}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          )}

          {booking.status === "completed" && !booking.employerIsRated && (
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              size="sm"
              onClick={() => handleAddFeedback(booking)}
            >
              <Star className="h-4 w-4" /> Rate Employer
            </Button>
          )}

          <div className='flex items-center gap-2'>
            <Link to={`/${user.role}/profile/${employer.id}`}>
                <Button variant="outline">
                    View Employer Profile
                </Button>
            </Link>
            <MessageButton userId={employer.id} />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminPageMain
      title="My Bookings"
      description="Manage employer bookings for you"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{pending.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{active.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{completed.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-2xl font-bold">{cancelled.length}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold">Bookings ({bookings.length})</h2>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
        </TabsList>

        {["pending", "active", "completed", "cancelled", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(tab === "all"
                ? bookings
                : bookings.filter((b) => b.status === tab)
              ).map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
            {(tab === "all"
              ? bookings
              : bookings.filter((b) => b.status === tab)
            ).length === 0 &&
              !loading && (
                <Card className="shadow-soft">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
      
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Employer</DialogTitle>
            <DialogDescription>
              Provide a rating and feedback for{" "}
              <span className="font-medium">
                {selectedBooking?.employer?.name}
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

export default WorkerBookings;
