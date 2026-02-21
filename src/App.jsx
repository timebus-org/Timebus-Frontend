import { useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/signup";
import AuthCallback from "./pages/AuthCallback";
import Results from "./pages/Results";
import SeatBooking from "./pages/SeatBooking";
import Payment from "./pages/Payment";
import ContactUs from "./pages/ContactUs";
import PassengerInfo from "./pages/PassengerInfo";
import CancelTicket from "./pages/CancelTicket";
import Bookings from "./pages/Bookings";
import PrintTicket from "./pages/PrintTicket";

import CabBookingPage from "./pages/CarBooking";
import CarSearchResults from "./pages/carSearchResults";
import BookingSummary from "./pages/BookingSummary";
import RequestCreated from "./pages/RequestCreated";
import PaymentFailed from "./pages/PaymentFailed";
import Success from "./pages/success"; 
import Ticket from "./pages/Ticket";
import TicketSuccess from "./pages/TicketSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
 const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/bus-tickets" element={<Home />} />
        <Route path="/passenger-info" element={<PassengerInfo />} />
        <Route path="/print-ticket" element={<PrintTicket />} />
        
        <Route path="/CarBooking" element={<CabBookingPage />} />
        <Route path="/carSearchResults" element={<CarSearchResults />} />
        <Route path="/BookingSummary" element={<BookingSummary />} />
        <Route path="/request-created" element={<RequestCreated />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-and-conditions" element={<TermsConditions />} />
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        
        <Route path="/booking-success" element={<Success />} />

        {/* TICKETS */}
        <Route path="/ticket-success" element={<TicketSuccess />} />
        <Route path="/ticket" element={<Ticket />} />

        {/* STATIC */}
        <Route path="/contact-us" element={<ContactUs />} />

        {/* SEARCH */}
        <Route path="/results" element={<Results />} />

        {/* SEAT */}
        <Route path="/seats/:id" element={<SeatBooking />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/cancel-ticket" element={<CancelTicket />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>

      {(location.pathname === "/" ||
  location.pathname === "/bus-tickets") && <Footer />}

    </>
  );
}


