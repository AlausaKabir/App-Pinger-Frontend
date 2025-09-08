import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { getAllNotificationEmails } from "@/requests/email";

export const useMissionCriticalCheck = () => {
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);
  const { role, loggedIn } = useSelector((state: RootState) => state.user);

  // Check if user is admin/superadmin
  const isAdminUser = role === "ADMIN" || role === "SUPERADMIN";

  useEffect(() => {
    const checkNotificationEmails = async () => {
      // Only check for admin users who are logged in
      if (!loggedIn || !isAdminUser) return;

      // Skip if user already dismissed the modal in this session
      if (hasSkipped) return;

      // Check if we've already shown this modal in this session
      const sessionKey = `mission-critical-shown-${role}`;
      if (sessionStorage.getItem(sessionKey)) return;

      // Check if user previously skipped (but give them a chance after 24 hours)
      const skipKey = `mission-critical-skipped-${role}`;
      const lastSkipped = localStorage.getItem(skipKey);
      if (lastSkipped) {
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000; // 24 hours
        if (parseInt(lastSkipped) > dayAgo) return;
      }

      setIsChecking(true);

      try {
        const response = await getAllNotificationEmails();

        // If no emails or empty array, show the modal
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
          setShowModal(true);
          // Mark as shown for this session
          sessionStorage.setItem(sessionKey, "true");
        }
      } catch (error) {
        console.error("Failed to check notification emails:", error);
        // If API fails, we might still want to show the modal for safety
        setShowModal(true);
        sessionStorage.setItem(sessionKey, "true");
      } finally {
        setIsChecking(false);
      }
    };

    // Small delay to ensure the user sees the dashboard first
    const timer = setTimeout(checkNotificationEmails, 1500);

    return () => clearTimeout(timer);
  }, [loggedIn, isAdminUser, role, hasSkipped]);

  const closeModal = () => {
    setShowModal(false);
  };

  const skipModal = () => {
    setShowModal(false);
    setHasSkipped(true);
    // Store in localStorage to remember across sessions (optional)
    localStorage.setItem(`mission-critical-skipped-${role}`, Date.now().toString());
  };

  return {
    showModal,
    isChecking,
    isAdminUser,
    closeModal,
    skipModal,
  };
};
