import { Button } from "@/components/atoms/Button";
import { getAzureMsal, isAzureAdConfigured } from "@/auth/azureMsal";
import { loginWithMicrosoft as loginMicrosoftThunk } from "@/store/slices/authSlice";
import type { User } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import toast from "react-hot-toast";

export function MicrosoftLoginButton({ onSuccess }: { onSuccess?: (user: User) => void }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const [busy, setBusy] = useState(false);

  if (!isAzureAdConfigured()) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-3 py-2 text-center text-xs text-[var(--muted)]">
        Microsoft (Azure AD) sign-in: set <code className="text-teal-200">VITE_AZURE_CLIENT_ID</code> and{" "}
        <code className="text-teal-200">VITE_AZURE_TENANT_ID</code> in <code className="text-teal-200">.env</code>{" "}
        (see <code className="text-teal-200">.env.example</code>).
      </div>
    );
  }

  const onClick = async () => {
    setBusy(true);
    try {
      const msal = await getAzureMsal();
      if (!msal) {
        toast.error("Azure client not initialized");
        return;
      }
      const result = await msal.loginPopup({
        scopes: ["openid", "profile", "email"],
      });
      const idToken = result.idToken;
      if (!idToken) {
        toast.error("No ID token from Microsoft");
        return;
      }
      const action = await dispatch(loginMicrosoftThunk(idToken));
      if (loginMicrosoftThunk.fulfilled.match(action)) {
        toast.success("Signed in with Microsoft");
        onSuccess?.(action.payload.user);
      } else {
        toast.error(String(action.payload ?? "Microsoft sign-in failed"));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Microsoft sign-in cancelled or failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full border border-white/15 bg-white/10 text-[var(--text)] hover:bg-white/15"
      loading={busy || status === "loading"}
      onClick={() => void onClick()}
    >
      <span className="mr-2 text-lg" aria-hidden>
        ⊞
      </span>
      Continue with Microsoft (Azure AD)
    </Button>
  );
}
