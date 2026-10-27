"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
];

export default function BuyHomestayPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const listings = useQuery(orpc.listing.list.queryOptions());

  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    category: CATEGORIES[0],
    contactWa: "",
  });

  const createMutation = useMutation(
    orpc.listing.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.listing.list.queryKey() });
        setForm({
          title: "",
          price: "",
          location: "",
          category: CATEGORIES[0],
          contactWa: "",
        });
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    createMutation.mutate(form);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Buy Homestay Listings</h1>

      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-lg border p-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Kontak WA</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.contactWa}
              onChange={(e) => setForm({ ...form, contactWa: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {createMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-muted-foreground">
          Hanya user login yang bisa submit listing.
        </p>
      )}

      <h2 className="mb-4 text-xl font-semibold">Listings</h2>
      <div className="space-y-3">
        {listings.isLoading && <p>Loading...</p>}
        {listings.data?.map((item: any) => (
          <div key={item.id} className="rounded-lg border p-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm">Price: {item.price}</p>
            <p className="text-sm">Location: {item.location}</p>
            <p className="text-sm">Category: {item.category}</p>
            <p className="text-sm">Kontak WA: {item.contactWa}</p>
          </div>
        ))}
        {listings.data?.length === 0 && <p className="text-sm text-muted-foreground">Belum ada listing.</p>}
      </div>
    </div>
  );
}
