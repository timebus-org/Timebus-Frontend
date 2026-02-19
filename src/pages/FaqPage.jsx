import React, { useState } from "react";
import styles from "./FaqPage.module.css";

export default function FaqPage() {
  return (
    <div className={styles.faqWrapper}>

      <h1 className={styles.pageTitle}>Frequently Asked Questions (FAQs) - Timebus</h1>

      <FaqSection
        title="General Questions"
        faqs={[
          {
            question: "Can I track the location of my booked bus online?",
            answer:
              "Yes, Timebus provides live bus tracking for most buses. You can track your bus in real-time via our website or mobile app to stay updated on your journey.",
          },
          {
            question: "Why should I book bus tickets online on Timebus?",
            answer:
              "Booking online with Timebus offers you convenience, exclusive discounts, instant confirmation, multiple payment options, and access to customer support 24/7.",
          },
          {
            question: "Do I need to create an account to book a ticket?",
            answer:
              "While you can book tickets as a guest, creating an account allows you to access rewards, track bookings easily, and get faster checkouts in the future.",
          },
          {
            question: "Does online booking cost more than offline?",
            answer:
              "No, Timebus offers competitive prices and exclusive online discounts to help you save more compared to offline bookings.",
          },
          {
            question: "How can I get discounts on bus bookings?",
            answer:
              "You can apply promo codes during checkout, use eligible bank offers, and download the Timebus app for app-exclusive deals.",
          },
          {
            question: "Can I book government bus tickets on Timebus?",
            answer:
              "Yes, Timebus provides tickets for government-operated buses on many routes, ensuring safe and budget-friendly travel.",
          },
        ]}
      />

      <FaqSection
        title="Ticket-Related Questions"
        faqs={[
          {
            question: "Can I cancel or modify my bus ticket?",
            answer:
              "Yes, most tickets can be canceled with no cancellation charges if done within the specified time frame. Flexi tickets also allow date modifications up to 8 hours before departure.",
          },
          {
            question: "What if my waitlisted ticket doesn't get confirmed?",
            answer:
              "If your waitlisted ticket is not confirmed, you will receive a 3X refund to book an alternate bus or train through Timebus.",
          },
          {
            question: "How do I get my ticket after booking?",
            answer:
              "Your ticket will be emailed to your registered email address and available in the Timebus app under 'My Bookings'.",
          },
          {
            question: "Can I book tickets for women travelers only?",
            answer:
              "Yes, Timebus offers women-only bus services with additional safety features and priority support.",
          },
        ]}
      />

      <FaqSection
        title="Payment Questions"
        faqs={[
          {
            question: "What payment options are available?",
            answer:
              "Timebus accepts all major credit/debit cards, net banking, UPI, and popular wallets like Paytm and PhonePe.",
          },
          {
            question: "Are my payment details secure?",
            answer:
              "Absolutely. Timebus uses secure payment gateways with SSL encryption to protect your transaction data.",
          },
          {
            question: "I used a promo code but did not receive a discount. What should I do?",
            answer:
              "Please ensure the promo code is valid and applicable to your route and travel date. Contact Timebus support if the problem persists.",
          },
        ]}
      />

      <FaqSection
        title="Cancellation & Refund Questions"
        faqs={[
          {
            question: "How do I cancel a ticket?",
            answer:
              "You can cancel tickets via your Timebus account or the app under 'My Bookings'. Follow the cancellation instructions and confirm to process your refund.",
          },
          {
            question: "When will I get my refund?",
            answer:
              "Refunds are usually processed instantly for cancellations within policy. In some cases, it may take 3-5 business days depending on your bank.",
          },
          {
            question: "Are there any cancellation charges?",
            answer:
              "Timebus offers free cancellation on eligible tickets. Please check the ticket details for specific cancellation policies.",
          },
          {
            question: "What if my trip is canceled by the operator?",
            answer:
              "You will be notified immediately, and a full refund or alternate booking option will be provided by Timebus.",
          },
        ]}
      />
    </div>

  );
}

/* Accordion FAQ Section */
export function FaqSection({ title, faqs }) {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.faqList}>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className={styles.faqItem}>
            <button
              onClick={() => toggleIndex(i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-content-${i}`}
              id={`faq-title-${i}`}
              className={styles.faqQuestion}
            >
              {question}
              <span aria-hidden="true" className={openIndex === i ? styles.iconOpen : styles.icon}>
                ▼
              </span>
            </button>
            <div
              id={`faq-content-${i}`}
              role="region"
              aria-labelledby={`faq-title-${i}`}
              className={`${styles.faqAnswer} ${openIndex === i ? styles.open : ""}`}
            >
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
