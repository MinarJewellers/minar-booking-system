"use client";

import { useEffect, useMemo, useState } from "react";
import { consultations } from "@/lib/consultations";
import { formatTime } from "@/lib/slots";

type Status = "idle" | "loading" | "success" | "error";

export default function BookingPage() {
  const [consultationId, setConsultationId] = useState(consultations[0].id);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const selectedConsultation = useMemo(
    () => consultations.find((item) => item.id === consultationId),
    [consultationId]
  );

  useEffect(() => {
    async function loadSlots() {
      if (!date) {
        setSlots([]);
        return;
      }
      setSlotLoading(true);
      try {
        const res = await fetch(`/api/slots?date=${date}`);
        const data = await res.json();
        setSlots(data.slots || []);
      } catch {
        setSlots([]);
      } finally {
        setSlotLoading(false);
      }
    }
    loadSlots();
  }, [date]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      consultationId,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      date: form.get("date"),
      time: form.get("time"),
      notes: form.get("notes"),
    };

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed.");

      setStatus("success");
      setMessage("Your appointment request has been received. A confirmation email and calendar invite will be sent shortly.");
      event.currentTarget.reset();
      setDate("");
      setSlots([]);
      setConsultationId(consultations[0].id);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="page">
      <section className="header">
        <p className="eyebrow">Minar Jewellers</p>
        <h1>Book an Appointment</h1>
        <p>Choose a date and time that suits you, and meet with one of our jewellery experts at our London showroom.</p>
      </section>

      <form className="booking" onSubmit={handleSubmit}>
        <section className="panel">
          <h2>1. Select Consultation Type</h2>
          <div className="cards">
            {consultations.map((item) => (
              <button type="button" className={item.id === consultationId ? "card active" : "card"} key={item.id} onClick={() => setConsultationId(item.id)}>
                <span className="icon">{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>2. Customer Details</h2>
          <div className="grid">
            <label>Full Name *<input name="name" required placeholder="Enter full name" /></label>
            <label>Email Address *<input name="email" type="email" required placeholder="Enter email address" /></label>
            <label>Contact Number *<input name="phone" required placeholder="Enter mobile number" /></label>
            <label>Address *<input name="address" required placeholder="Enter address" /></label>
          </div>
          <label>Notes<textarea name="notes" rows={4} placeholder="Tell us anything helpful before your visit"></textarea></label>
        </section>

        <section className="panel">
          <h2>3. Select Date & Time</h2>
          <div className="grid">
            <label>Preferred Date *<input name="date" type="date" min={today} required value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <label>Time Slot *
              <select name="time" required disabled={!date || slotLoading || slots.length === 0}>
                <option value="">{slotLoading ? "Checking availability..." : "Select a time"}</option>
                {slots.map((slot) => <option key={slot} value={slot}>{formatTime(slot)}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="summary">
          <div>
            <p className="summary-title">Your Appointment Request</p>
            <p>{selectedConsultation?.title}</p>
            <p>Minar Jewellers, 181 Upper Tooting Road, London SW17 7TG</p>
          </div>
          <button className="submit" disabled={status === "loading"}>{status === "loading" ? "Submitting..." : "Submit Appointment Request"}</button>
        </section>

        {message && <div className={status === "success" ? "message success" : "message error"}>{message}</div>}
      </form>

      <style jsx>{`
        .page{min-height:100vh;background:#fffaf4;padding:28px 16px 48px}
        .header{text-align:center;max-width:820px;margin:0 auto 28px}
        .eyebrow{margin:0 0 8px;letter-spacing:.18em;text-transform:uppercase;color:#9a743f;font-size:12px}
        h1{font-family:Georgia,serif;font-size:clamp(34px,5vw,56px);font-weight:400;margin:0 0 14px;color:#261b15}
        .header p{color:#6f625b;line-height:1.7;font-size:16px}
        .booking{max-width:1100px;margin:0 auto}
        .panel{background:#fff;border:1px solid #e4d3bf;border-radius:18px;padding:24px;margin-bottom:18px;box-shadow:0 12px 34px rgba(40,30,22,.06)}
        h2{font-family:Georgia,serif;font-size:24px;font-weight:400;margin:0 0 18px}
        .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .card{border:1px solid #e2d1be;background:#fffdf9;border-radius:16px;padding:18px;text-align:left;cursor:pointer;color:#2b241f;transition:.2s ease;min-height:158px}
        .card:hover,.card.active{border-color:#a67c3d;box-shadow:0 10px 24px rgba(166,124,61,.16);transform:translateY(-1px)}
        .icon{font-size:28px;display:block;margin-bottom:10px}
        .card strong{display:block;font-size:16px;margin-bottom:8px}
        .card small{color:#6f625b;line-height:1.45}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        label{display:block;font-size:14px;color:#443832;margin-bottom:16px}
        input,select,textarea{display:block;width:100%;margin-top:7px;border:1px solid #d9c8b5;border-radius:12px;padding:13px 14px;background:#fffdf9;color:#2b241f}
        textarea{resize:vertical}
        .summary{background:#261b15;color:#fff;border-radius:18px;padding:22px;display:flex;justify-content:space-between;align-items:center;gap:20px}
        .summary p{margin:4px 0;color:#f5eadc}
        .summary-title{color:#d8ad69!important;text-transform:uppercase;letter-spacing:.12em;font-size:12px}
        .submit{border:0;border-radius:999px;background:#d8ad69;color:#261b15;padding:14px 24px;cursor:pointer;font-weight:600;white-space:nowrap}
        .submit:disabled{opacity:.65;cursor:not-allowed}
        .message{margin-top:16px;padding:15px;border-radius:14px;font-weight:600}
        .success{background:#e8f6e8;color:#246327}.error{background:#fde9e6;color:#9b2d20}
        @media(max-width:860px){.cards,.grid{grid-template-columns:1fr}.panel{padding:18px}.summary{display:block}.submit{width:100%;margin-top:16px}}
      `}</style>
    </main>
  );
}
