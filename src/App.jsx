import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/signup";
import AuthCallback from "./pages/AuthCallback";
import Results from "./pages/Results";
import SeatBooking from "./pages/SeatBooking";
import Payment from "./pages/Payment";
import TrainComingSoon from "./pages/TrainComingSoon";
import FlightComingSoon from "./pages/FlightComingSoon";
import ContactUs from "./pages/ContactUs";
import PassengerInfo from "./pages/PassengerInfo";
import CancelTicket from "./pages/CancelTicket";
import RescheduleTicket from "./pages/RescheduleTicket";
import Bookings from "./pages/Bookings";
import PrintTicket from "./pages/PrintTicket";
import BookingSuccess from "./pages/success";
import CabBookingPage from "./pages/CarBooking";
import CarSearchResults from "./pages/carSearchResults";
import BookingSummary from "./pages/BookingSummary";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/bus-tickets" element={<Home />} />
        <Route path="/passenger-info" element={<PassengerInfo />} />
        <Route path="/print-ticket" element={<PrintTicket />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route path="/CarBooking" element={<CabBookingPage />} />
        <Route path="/carSearchResults" element={<CarSearchResults />} />
        <Route path="/BookingSummary" element={<BookingSummary />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/auth-callback" element={<AuthCallback />} />

        {/* TICKETS */}
        <Route path="/train-tickets" element={<TrainComingSoon />} />
        <Route path="/flight-tickets" element={<FlightComingSoon />} />

        {/* STATIC */}
        <Route path="/contact-us" element={<ContactUs />} />

        {/* SEARCH */}
        <Route path="/results" element={<Results />} />

        {/* SEAT */}
        <Route path="/seats/:id" element={<SeatBooking />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/cancel-ticket" element={<CancelTicket />} />
<Route path="/reschedule-ticket" element={<RescheduleTicket />} />
<Route path="/bookings" element={<Bookings />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

