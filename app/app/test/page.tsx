"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client"; // Adjust path if needed

/**
 * RealtimeConnectionTester Component
 * * This component is designed for debugging Supabase Realtime connection issues.
 * It attempts to establish a single, simple connection upon mounting and logs
 * the entire lifecycle of the subscription attempt to the console.
 * * This helps isolate whether the issue is with the fundamental connection
 * or with more complex application logic (e.g., useEffect loops, state management).
 */
export default function RealtimeConnectionTester() {
  useEffect(() => {
    console.log("[RealtimeTester] Component mounted. Attempting to connect...");

    // Log the credentials to ensure they are loaded correctly.
    // In a real app, be careful not to expose sensitive keys in client logs
    // but for this debugging step, it's essential.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "[RealtimeTester] CRITICAL: Supabase URL or Anon Key is missing. Check your .env.local file and Next.js configuration."
      );
      return;
    }

    console.log(`[RealtimeTester] Using Supabase URL: ${supabaseUrl}`);

    // Create a unique channel name for this test to avoid conflicts.
    const testChannel = supabase.channel(`test-connection-${Date.now()}`);

    testChannel
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        // We don't expect to receive any changes, but if we do, it's a good sign.
        console.log("[RealtimeTester] Received a postgres change:", payload);
      })
      .subscribe((status, err) => {
        console.log(`[RealtimeTester] Subscription status changed to: ${status}`);

        if (status === "SUBSCRIBED") {
          // This is the success message we are looking for!
          console.log(
            "%c[RealtimeTester] ✅ SUCCESS: Realtime connection established and subscribed!",
            "color: green; font-weight: bold;"
          );
        }

        if (status === "CHANNEL_ERROR") {
          console.error("[RealtimeTester] ❌ FAILED: Channel Error.", err);
        }

        if (status === "TIMED_OUT") {
          console.error("[RealtimeTester] ❌ FAILED: Connection Timed Out.", err);
        }

        if (err) {
          console.error("[RealtimeTester] An error occurred in the subscription callback:", err);
        }
      });

    // The cleanup function will run when the component unmounts.
    return () => {
      console.log("[RealtimeTester] Component unmounting. Removing test channel.");
      supabase.removeChannel(testChannel);
    };
  }, []); // Empty dependency array ensures this runs only once on mount.

  // This component doesn't render any UI. Its sole purpose is to log to the console.
  return null;
}
