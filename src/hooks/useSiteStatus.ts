import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteStatus {
  status: "open" | "locked" | "maintenance";
  isLoading: boolean;
}

export function useSiteStatus(): SiteStatus {
  const [status, setStatus] = useState<"open" | "locked" | "maintenance">("open");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel("site_status_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => fetchStatus()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStatus = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_status")
      .limit(1)
      .maybeSingle();

    if (!error && data?.site_status) {
      setStatus(data.site_status as "open" | "locked" | "maintenance");
    }
    setIsLoading(false);
  };

  return { status, isLoading };
}