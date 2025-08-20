import Navbar from "@/components/Navbar";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="section px-4 py-16">
        <h1 className="text-3xl mb-2">Crea tu cuenta</h1>
        <p className="text-[#E5E5E5]">Pantalla de registro (placeholder).</p>
      </main>
    </>
  );
}