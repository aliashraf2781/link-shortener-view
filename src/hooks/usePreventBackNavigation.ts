import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

/**
 * Hook to prevent browser back navigation when user is logged in on auth pages
 * If user is authenticated and tries to use back button on auth pages, it will be prevented
 */
export function usePreventBackNavigation() {
	const { data: session } = useSession();
	const historyStackSize = useRef(0);

	useEffect(() => {
		// Only prevent back navigation if user is logged in
		if (!session?.user) return;

		// Initialize the history stack size
		historyStackSize.current = window.history.length;

		// Push a state to the history stack
		window.history.pushState(null, "", window.location.href);

		// Increment the count
		historyStackSize.current = window.history.length;

		// Listen for back button clicks
		const handlePopState = () => {
			// Push the state again to prevent going back
			window.history.pushState(null, "", window.location.href);
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [session?.user]);
}
