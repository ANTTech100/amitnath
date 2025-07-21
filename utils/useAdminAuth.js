import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "./apiClient";

export default function useAdminAuth({ redirectTo = "/admin/setup" } = {}) {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const adminToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    console.log("[useAdminAuth] Found adminToken:", adminToken);
    if (!adminToken) {
      if (isMounted) {
        setLoading(false);
        router.replace(redirectTo);
      }
      return;
    }

    // Check if admin is registered and validated
    apiClient
      .get("/api/admin/register", { headers: { "x-admin-token": adminToken } })
      .then((res) => {
        console.log("[useAdminAuth] /api/admin/register response:", res.data);
        const adminUser = res.data.admin;
        if (!adminUser || !adminUser.validated) {
          if (isMounted) {
            setLoading(false);
            router.replace("/admin/register");
          }
        } else {
          if (isMounted) {
            setAdmin(adminUser);
            setLoading(false);
            console.log("[useAdminAuth] Authenticated admin:", adminUser);
          }
        }
      })
      .catch((err) => {
        console.log("[useAdminAuth] Error:", err);
        if (isMounted) {
          setError("Unauthorized or invalid token");
          setLoading(false);
          router.replace(redirectTo);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [router, redirectTo]);

  return { loading, admin, error };
} 