import { useCallback, useEffect, useRef, useState } from "react";
import {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead
} from "../API/notificationApi";
import "../CSS/AdminNotification.css";
import { IoNotifications } from "react-icons/io5";

const AdminNotification = () => {
    const notificationRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchNotification = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            const data = await getNotifications();

            if (data.success) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Notification Error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialFetchId = window.setTimeout(() => {
            fetchNotification(true);
        }, 0);

        const refreshId = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchNotification();
            }
        }, 15000);

        return () => {
            window.clearTimeout(initialFetchId);
            window.clearInterval(refreshId);
        };
    }, [fetchNotification]);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotification(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount((previous) => Math.max(0, previous - 1));
        } catch (error) {
            console.error("Mark read error", error);
        }
    };

    const handleAllMarkRead = async () => {
        try {
            await markAllNotificationsRead();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("Mark read error", error);
        }
    };

    const getNotificationIcon = (type) => {
        if (type === "ORDER") {
            return "📦";
        }

        if (type === "LOW_STOCK" || type === "OUT_OF_STOCK") {
            return "⚠️";
        }

        return "🔔";
    };

    return (
        <div className="admin-notification" ref={notificationRef}>
            <button
                className="notification-button"
                onClick={() => {
                    const nextOpen = !showNotification;
                    setShowNotification(nextOpen);
                    if (nextOpen) {
                        fetchNotification();
                    }
                }}
                aria-label="Notifications"
                aria-expanded={showNotification}
            >
                <IoNotifications style={{color:"#64748B"}}/>
                {unreadCount > 0 && (
                    <span className="notification-count">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {showNotification && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleAllMarkRead}>
                                Mark All Read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="no-notification">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="no-notification">No Notification</div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={
                                    notification.isRead
                                        ? "notification-item read"
                                        : "notification-item unread"
                                }
                            >
                                <h4>
                                    {getNotificationIcon(notification.type)}{" "}
                                    {notification.title}
                                </h4>
                                <p>{notification.message}</p>
                                {!notification.isRead && (
                                    <button
                                        onClick={() =>
                                            handleMarkRead(notification._id)
                                        }
                                    >
                                        Mark As Read
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminNotification;
