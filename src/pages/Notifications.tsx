// import AdminPageMain from '@/components/custom/AdminPageMain'
// import React from 'react'
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';


// const Notifications = () => {
//   return (
//     <AdminPageMain title='Notifications' description='Stay updated with your job activity'>
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">All Notifications ({notifications.length})</h2>

//         <div className="space-y-3">
//           {notifications.map((notification) => (
//             <Card
//               key={notification.id}
//               className={`shadow-soft hover:shadow-medium transition-smooth ${
//                 !notification.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''
//               }`}
//             >
//               <CardContent className="p-4">
//                 <div className="flex items-start gap-4">
//                   <div className={`p-2 rounded-full bg-muted ${getNotificationColor(notification.type)}`}>
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <p className={`text-sm ${!notification.is_read ? 'font-medium' : 'text-muted-foreground'}`}>
//                           {notification.content}
//                         </p>
//                         <div className="flex items-center gap-2 mt-2">
//                           <Badge variant={notification.type === 'application' ? 'primary' : 'secondary'}>
//                             {notification.type}
//                           </Badge>
//                           <span className="text-xs text-muted-foreground">
//                             {new Date(notification.sent_at).toLocaleDateString()} at {new Date(notification.sent_at).toLocaleTimeString()}
//                           </span>
//                         </div>
//                       </div>
//                       {!notification.is_read && (
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={() => markAsRead(notification.id)}
//                         >
//                           <BellOff className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {notifications.length === 0 && (
//           <Card className="shadow-soft">
//             <CardContent className="p-8 text-center">
//               <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">No notifications</h3>
//               <p className="text-muted-foreground">You're all caught up!</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </AdminPageMain>
//   )
// }

// export default Notifications

import AdminPageMain from "@/components/custom/AdminPageMain";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, MessageSquare, FileCheck } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load notifications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.post(
        `/notifications/${id}`,
        {},
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case "feedback":
        return <FileCheck className="h-4 w-4 text-success" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-primary/10 text-primary";
      case "feedback":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminPageMain
      title="Notifications"
      description="Stay updated with your job activity"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          All Notifications ({notifications.length})
        </h2>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`shadow-soft hover:shadow-medium transition-smooth ${
                !notification.is_read
                  ? "border-l-4 border-l-primary bg-primary/5"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            !notification.is_read
                              ? "font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              notification.type === "application"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              notification.sent_at
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              notification.sent_at
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <BellOff className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && notifications.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageMain>
  );
};

export default Notifications;
