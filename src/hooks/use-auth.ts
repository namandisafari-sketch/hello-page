import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export type AuthState = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  roles: AppRole[];
  isAdmin: boolean;
  isStaff: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    userId: null,
    email: null,
    roles: [],
    isAdmin: false,
    isStaff: false,
  });

  useEffect(() => {
    let mounted = true;

    const load = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (mounted)
          setState({ loading: false, userId: null, email: null, roles: [], isAdmin: false, isStaff: false });
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      const roles = (data ?? []).map((r) => r.role as AppRole);
      if (!mounted) return;
      setState({
        loading: false,
        userId,
        email,
        roles,
        isAdmin: roles.includes("admin"),
        isStaff: roles.includes("admin") || roles.includes("staff"),
      });
    };

    supabase.auth.getSession().then(({ data }) => {
      load(data.session?.user.id ?? null, data.session?.user.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      load(session?.user.id ?? null, session?.user.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
