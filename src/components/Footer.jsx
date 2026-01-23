import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function FooterWithFaq() {
  // FAQ Accordion state
  const [openIndex, setOpenIndex] = useState(null);
  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ Data grouped in sections
  const faqData = [
    {
      title: "General Questions",
      faqs: [
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
        
      ],
    },
    {
      title: "Ticket-Related Questions",
      faqs: [
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
      ],
    },
    {
      title: "Payment Questions",
      faqs: [
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
      ],
    },
    {
      title: "Cancellation & Refund Questions",
      faqs: [
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
      ],
    },
  ];

  return (
    <>
      {/* FAQ SECTION */}
      <main style={faqWrapper}>
        <h1 style={faqTitle}>Frequently Asked Questions (FAQs) - Timebus</h1>

        {faqData.map(({ title, faqs }, sectionIndex) => (
          <section key={sectionIndex} style={faqSection}>
            <h2 style={faqSectionTitle}>{title}</h2>
            <div>
              {faqs.map(({ question, answer }, i) => {
                const index = `${sectionIndex}-${i}`;
                const isOpen = openIndex === index;
                return (
                  <div key={index} style={faqItem}>
                    <button
                      onClick={() => toggleIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${index}`}
                      id={`faq-title-${index}`}
                      style={faqQuestion}
                    >
                      {question}
                      <span
                        aria-hidden="true"
                        style={{
                          marginLeft: 10,
                          transition: "transform 0.3s",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          display: "inline-block",
                        }}
                      >
                        ▼
                      </span>
                    </button>
                    <div
                      id={`faq-content-${index}`}
                      role="region"
                      aria-labelledby={`faq-title-${index}`}
                      style={{
                        ...faqAnswer,
                        maxHeight: isOpen ? "2000px" : "0",
                        opacity: isOpen ? 1 : 0,
                        paddingTop: isOpen ? 10 : 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: "#f8fafc",
          marginTop: 80,
          fontFamily: "Inter, system-ui",
          color: "#374151",
        }}
      >
        {/* APP PROMO */}
        <div style={appCard}>
          <div>
            <h2 style={{ color: "#0d47a1", marginBottom: 6, fontSize: 20 }}>
              Download the Timebus App
            </h2>
            <p style={{ color: "#4b5563", fontSize: 14 }}>
              App coming soon • Exclusive offers • Live booking updates
            </p>
          </div>

          <div style={appButtons}>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                style={{ height: 44, maxWidth: "135px" }}
              />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                style={{ height: 44, maxWidth: "150px" }}
              />
            </a>
          </div>
        </div>

        {/* FOOTER GRID */}
        <div style={footerGrid}>
          {/* ABOUT */}
          <div>
            <h4 style={title}>About Timebus</h4>
            <p style={text}>
              Timebus is a next-generation bus booking platform connecting
              travelers with verified operators for safe, reliable, and seamless
              journeys.
            </p>
          </div>

          {/* ROUTES */}
          <div>
            <h4 style={title}>Top Routes</h4>
            <ul style={list}>
              <li>
                <Link
                  to="/bus-tickets?from=Hyderabad&to=Bangalore"
                  style={linkStyle}
                >
                  Hyderabad – Bangalore
                </Link>
              </li>
              <li>
                <Link to="/bus-tickets?from=Mumbai&to=Pune" style={linkStyle}>
                  Mumbai – Pune
                </Link>
              </li>
              <li>
                <Link to="/bus-tickets?from=Delhi&to=Jaipur" style={linkStyle}>
                  Delhi – Jaipur
                </Link>
              </li>
              <li>
                <Link
                  to="/bus-tickets?from=Chennai&to=Coimbatore"
                  style={linkStyle}
                >
                  Chennai – Coimbatore
                </Link>
              </li>
            </ul>
          </div>

          {/* OPERATORS */}
          <div>
            <h4 style={title}>For Operators</h4>
            <ul style={list}>
              <li>
                <Link to="/partner-with-us" style={linkStyle}>
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/operator-login" style={linkStyle}>
                  Operator Login
                </Link>
              </li>
              <li>
                <Link to="/fleet-solutions" style={linkStyle}>
                  Fleet Solutions
                </Link>
              </li>
              <li>
                <Link to="/support" style={linkStyle}>
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 style={title}>Support</h4>
            <ul style={list}>
              <li>
                <Link to="/faq" style={linkStyle}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact-us" style={linkStyle}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={linkStyle}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={linkStyle}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 style={title}>Connect With Us</h4>

            <div style={socialRow}>
              <SocialIcon
                link="https://facebook.com/timebus"
                icon={<FaFacebookF />}
                label="Facebook"
              />
              <SocialIcon
                link="https://instagram.com/timebus"
                icon={<FaInstagram />}
                label="Instagram"
              />
              <SocialIcon
                link="https://twitter.com/timebus"
                icon={<FaXTwitter />}
                label="Twitter"
              />
              <SocialIcon
                link="https://linkedin.com/company/timebus"
                icon={<FaLinkedinIn />}
                label="LinkedIn"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={bottomBar}>
          © 2025 Timebus Technologies Pvt. Ltd. •
          <Link to="/privacy" style={bottomLink}>
            {" "}
            Privacy{" "}
          </Link>
          •
          <Link to="/terms" style={bottomLink}>
            {" "}
            Terms{" "}
          </Link>
          •
          <Link to="/contact-us" style={bottomLink}>
            {" "}
            Customer Support
          </Link>
        </div>
      </footer>
    </>
  );
}

/* Social Icon Component */
const SocialIcon = ({ icon, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    style={{
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "#e3f2fd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#0d47a1",
      cursor: "pointer",
      fontSize: 16,
      transition: "0.2s",
      textDecoration: "none",
    }}
  >
    {icon}
  </a>
);

/* STYLES */
const faqWrapper = {
  maxWidth: 1100,
  margin: "40px auto 0 auto",
  padding: "0 20px",
  fontFamily: "Inter, system-ui",
  color: "#374151",
  lineHeight: 1.6,
};

const faqTitle = {
  fontSize: 28,
  fontWeight: 700,
  color: "#0d47a1",
  marginBottom: 24,
};

const faqSection = {
  marginBottom: 32,
};

const faqSectionTitle = {
  fontSize: 20,
  fontWeight: 600,
  color: "#0d47a1",
  marginBottom: 12,
};

const faqItem = {
  marginBottom: 12,
  borderBottom: "1px solid #e5e7eb",
};

const faqQuestion = {
  background: "none",
  border: "none",
  width: "100%",
  textAlign: "left",
  padding: "12px 0",
  fontSize: 16,
  fontWeight: 600,
  color: "#0d47a1",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const faqAnswer = {
  overflow: "hidden",
  fontSize: 15,
  color: "#4b5563",
  lineHeight: 1.5,
};

const appCard = {
  background: "#ffffff",
  maxWidth: 1100,
  margin: "0 auto",
  padding: "30px 36px",
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  transform: "translateY(-50px)",
  flexWrap: "wrap",
  gap: 16,
};

const appButtons = {
  display: "flex",
  gap: 16,
  marginTop: 8,
  flexWrap: "wrap",
};

const footerGrid = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "30px 20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 30,
  rowGap: 40,
};

const title = {
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 12,
  color: "#0d47a1",
};

const text = {
  fontSize: 14,
  color: "#4b5563",
  lineHeight: 1.7,
};

const list = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  fontSize: 14,
  color: "#374151",
  lineHeight: 2,
};

const linkStyle = {
  color: "#374151",
  textDecoration: "none",
  display: "inline-block",
  width: "100%",
  padding: "6px 0",
  transition: "color 0.2s",
};

const socialRow = {
  display: "flex",
  gap: 14,
  marginTop: 10,
  flexWrap: "wrap",
};

const bottomBar = {
  borderTop: "1px solid #e5e7eb",
  padding: 16,
  textAlign: "center",
  fontSize: 13,
  color: "#6b7280",
  background: "#ffffff",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 10,
};

const bottomLink = {
  color: "#6b7280",
  textDecoration: "none",
  padding: "0 6px",
  fontSize: 13,
  whiteSpace: "nowrap",
};

