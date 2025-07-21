import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useSuperadminAuth({ redirectTo = "/superadmin/login" } = {}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = typeof window !== "undefined" ? localStorage.getItem("superadminAuth") : null;
    if (authStatus === "true") {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
      if (redirectTo) router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  return { loading, isAuthenticated };
} 