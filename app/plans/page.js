// pages/pricing.js
"use client";
import { useState } from "react";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY);

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹199",
    period: "/month",
    highlight: false,
    subtitle: "For individuals and small experiments.",
    features: [
      "Up to 3 admins",
      "Up to 50 content pages",
      "Basic pop-up forms",
      "Standard analytics",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    highlight: true,
    subtitle: "For growing teams and serious creators.",
    features: [
      "Up to 10 admins",
      "Unlimited content pages",
      "Advanced pop-up logic",
      "Full reports & exports",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlight: false,
    subtitle: "For large companies and agencies.",
    features: [
      "Unlimited admins & users",
      "Custom templates",
      "Custom domain & SSO",
      "Dedicated success manager",
      "SLA & custom contracts",
    ],
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  const handleChoosePlan = async (planId) => {
    if (planId === "enterprise") {
      // For enterprise, maybe open a mailto or contact form
      window.location.href = "mailto:sales@codeless.com?subject=Enterprise%20Plan%20Enquiry";
      return;
    }

    try {
      setError("");
      setLoadingPlan(planId);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Head>
        <title>Codeless – Pricing</title>
        <meta
          name="description"
          content="Choose the right Codeless plan for your team – from solo creators to enterprises."
        />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-50">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400" />

        {/* Hero section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Simple pricing for{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Codeless
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Create admins, users, and content. Capture pop-up responses, track every view and click,
              and manage all your reporting in one place.
            </p>
          </div>

          {/* Toggle (if later you want monthly/yearly) */}
          {/* <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full p-1 text-sm">
              <button className="px-4 py-1.5 rounded-full bg-slate-800 font-medium">
                Monthly
              </button>
              <button className="px-4 py-1.5 rounded-full text-slate-400">
                Yearly <span className="text-emerald-400">(save 20%)</span>
              </button>
            </div>
          </div> */}

          {error && (
            <div className="max-w-xl mx-auto mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center">
              {error}
            </div>
          )}

          {/* Pricing cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-slate-900/50 p-6 shadow-lg shadow-black/40 backdrop-blur-sm ${
                  plan.highlight
                    ? "border-indigo-500/70 ring-2 ring-indigo-500/40 scale-[1.02]"
                    : "border-slate-800"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    Most popular
                  </div>
                )}

                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
                  <p className="text-sm text-slate-400">{plan.subtitle}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 text-base ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2 text-sm mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-200">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleChoosePlan(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    plan.highlight
                      ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-50"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {plan.id === "enterprise"
                    ? "Contact sales"
                    : loadingPlan === plan.id
                    ? "Redirecting to payment..."
                    : "Get started"}
                </button>
              </div>
            ))}
          </div>

          {/* Small footnote */}
          <p className="mt-8 text-xs text-center text-slate-500">
            All paid plans include secure Stripe payments, GST-compliant invoices, and the ability to upgrade
            or cancel anytime.
          </p>
        </section>
      </main>
    </>
  );
}
