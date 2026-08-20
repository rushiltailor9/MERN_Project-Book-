import { useCallback, useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../API/notificationApi";
import "../CSS/Notification.css";


const NotificationBell = () => {

    const notificationRef = useRef(null);

    const [ notifications, setNotifications ] = useState([]);
    const [ unreadCount, setUnreadCount ] = useState(0);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    // =================================================
    // FETCH NOTIFICATIONS
    // =================================================

    const fetchNotifications = useCallback(
        async (showLoading = false) => {
            try {
                if (showLoading) {
                    setLoading(true);
                }

                const response =
                    await getNotifications();
                if (response.success) {
                    setNotifications(
                        response.notifications || []
                    );

                    setUnreadCount(
                        response.unreadCount || 0
                    );
                }
            } catch (error) {
                console.error(
                    "Notification Fetch Error:",
                    error.response?.data ||
                    error.message
                );
            } finally {
                if (showLoading) {
                    setLoading(false);
                }
            }
        },
        []
    );


    // =================================================
    // FIRST LOAD
    // =================================================

    useEffect(() => {
        const initialFetchId = window.setTimeout(() => {
            fetchNotifications(true);
        }, 0);

        const refreshId = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchNotifications();
            }
        }, 15000);

        return () => {
            window.clearTimeout(initialFetchId);
            window.clearInterval(refreshId);
        };
    }, [fetchNotifications]);

    // Close immediately when the user interacts outside the bell or presses Escape.
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    // =================================================
    // MARK ONE READ
    // =================================================

    const handleNotificationClick =
        async (notification) => {

            // Close first so a slow network request never keeps the dropdown open.
            setIsOpen(false);

            try {

                if (!notification.isRead) {

                    await markNotificationRead(
                        notification._id
                    );


                    setNotifications(
                        (previous) =>

                            previous.map(
                                (item) =>

                                    item._id ===
                                    notification._id

                                        ? {
                                            ...item,
                                            isRead: true
                                        }

                                        : item
                            )
                    );


                    setUnreadCount(
                        (previous) =>
                            Math.max(
                                previous - 1,
                                0
                            )
                    );

                }

            } catch (error) {

                console.error(
                    "Read Notification Error:",
                    error
                );

            }

        };


    // =================================================
    // MARK ALL READ
    // =================================================

    const handleMarkAllRead =
        async () => {

            try {

                await markAllNotificationsRead();


                setNotifications(
                    (previous) =>

                        previous.map(
                            (notification) => ({
                                ...notification,
                                isRead: true
                            })
                        )
                );


                setUnreadCount(0);


            } catch (error) {

                console.error(
                    "Mark All Read Error:",
                    error
                );

            }

        };


    // =================================================
    // FORMAT DATE
    // =================================================

    const formatDate =
        (date) => {

            return new Date(
                date
            ).toLocaleString(
                "en-IN",
                {
                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"
                }
            );

        };


    // =================================================
    // ICON
    // =================================================

    const getNotificationIcon =
        (type) => {

            if (type === "ORDER") {

                return "📦";

            }


            if (type === "USER") {

                return "👤";

            }


            if (type === "FEEDBACK") {

                return "💬";

            }

            if (type === "LOW_STOCK" || type === "OUT_OF_STOCK") {

                return "⚠️";

            }


            return "🔔";

        };


    // =================================================
    // COMPONENT
    // =================================================

    return (

        <div className="notification-wrapper" ref={notificationRef}>


            {/* =========================================
                BELL BUTTON
            ========================================= */}

            <button

                className="notification-button"

                onClick={() => {
                    const nextIsOpen = !isOpen;
                    setIsOpen(nextIsOpen);
                    if (nextIsOpen) {
                        fetchNotifications();
                    }
                }}

                title="Notifications"

                aria-label="Notifications"
                aria-expanded={isOpen}

            >

                <FaBell style={{color:"#64748B"}} />


                {unreadCount > 0 && (

                    <span
                        className="notification-badge"
                    >

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* =========================================
                DROPDOWN
            ========================================= */}

            {isOpen && (

                <div
                    className="notification-dropdown"
                >


                    {/* HEADER */}

                    <div
                        className="notification-header"
                    >

                        <h3>
                            Notifications
                        </h3>


                        {unreadCount > 0 && (

                            <button
                                className="mark-all-button"
                                onClick={
                                    handleMarkAllRead
                                }
                            >
                                Mark all read
                            </button>

                        )}

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div
                            className="notification-empty"
                        >
                            Loading...
                        </div>

                    ) : notifications.length === 0 ? (


                        /* EMPTY */

                        <div
                            className="notification-empty"
                        >

                            <FaBell />

                            <p>
                                No notifications
                            </p>

                        </div>


                    ) : (


                        /* LIST */

                        <div
                            className="notification-list"
                        >

                            {notifications.map(
                                (notification) => (

                                    <div

                                        key={
                                            notification._id
                                        }

                                        className={
                                            `notification-item ${
                                                !notification.isRead
                                                    ? "unread"
                                                    : ""
                                            }`
                                        }

                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }

                                    >


                                        {/* ICON */}

                                        <div
                                            className="notification-icon"
                                        >

                                            {getNotificationIcon(
                                                notification.type
                                            )}

                                        </div>


                                        {/* CONTENT */}

                                        <div
                                            className="notification-content"
                                        >

                                            <h4>
                                                {
                                                    notification.title
                                                }
                                            </h4>


                                            <p>
                                                {
                                                    notification.message
                                                }
                                            </p>


                                            <span>
                                                {formatDate(
                                                    notification.createdAt
                                                )}
                                            </span>

                                        </div>


                                        {/* UNREAD DOT */}

                                        {!notification.isRead && (

                                            <span
                                                className="unread-dot"
                                            />

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>

    );

};


export default NotificationBell;
