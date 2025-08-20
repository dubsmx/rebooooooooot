"use client";

export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";

function cleanMojibake(s: string) {
  try { if (!/[ÃƒÃ‚Ã]/.test(s)) return s; const bytes = new TextEncoder().encode(s); return new TextDecoder("latin1").decode(bytes); }
  catch { return s; }
}

export default function ProfilePage() {
  const [p, setP] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/me/profile").then(async (r) => {
      const data = await r.json();
      if (data?.profile) {
        const fixed = Object.fromEntries(Object.entries(data.profile).map(([k,v]) => [k, typeof v === "string" ? cleanMojibake(v) : v ]));
        setP(fixed);
      } else setP({});
    });
  }, []);

  async function uploadAvatar() {
    if (!avatarFile) return null;
    const signRes = await fetch("/api/uploads/r2/sign-avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ext: avatarFile.name.split(".").pop(), contentType: avatarFile.type || "image/png" })
    });
    const { url, key } = await signRes.json();
    await fetch(url, { method: "PUT", headers: { "Content-Type": avatarFile.type }, body: avatarFile });
    return key;
  }

  async function save() {
    setSaving(true);
    let avatarKey = p?.avatarKey ?? null;
    if (avatarFile) avatarKey = await uploadAvatar();

    const res = await fetch("/api/me/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, avatarKey })
    });
    setSaving(false);
    if (!res.ok) alert(await res.text()); else alert("Saved");
  }

  if (!p) return <div className="mx-auto max-w-3xl px-4 py-8">Loadingâ€¦</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {["displayName","phone","rfc","curp","clabe"].map((k) => (
          <div key={k}>
            <label className="block text-sm mb-1 capitalize">{k}</label>
            <input className="border rounded px-3 py-2 w-full" value={p?.[k] ?? ""} onChange={(e) => setP({ ...p, [k]: e.target.value })}/>
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">Avatar</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} />
        </div>
      </div>
      <button onClick={save} disabled={saving} className="border rounded px-3 py-2">{saving ? "Savingâ€¦" : "Save"}</button>
    </div>
  );
}