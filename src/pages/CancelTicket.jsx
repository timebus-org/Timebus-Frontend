import { useState, useMemo } from "react";
import axios from "axios";
import "./CancelTicket.css";
import { useNavigate } from "react-router-dom";

export default function CancelTicket() {
  const [tin, setTin] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [cancellationData, setCancellationData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const normalizeEntry = (entry) => {
    if (!entry) return [];
    return Array.isArray(entry) ? entry : [entry];
  };

  const fetchDetails = async () => {
    if (!tin.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSuccess(null);

      const [ticketRes, cancelRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/ticket?tin=${tin}`),
axios.get(`${import.meta.env.VITE_API_URL}/api/cancellation-data?tin=${tin}`)
      ]);

      const ticket = ticketRes.data?.data || ticketRes.data;
      const cancel = cancelRes.data?.data || cancelRes.data;

      if (!ticket || !cancel) throw new Error("Invalid API response");

      const cancellable = cancel.cancellable === true || cancel.cancellable === "true";
      const partiallyCancellable =
        cancel.partiallyCancellable === true || cancel.partiallyCancellable === "true";

      setTicketDetails(ticket);

      setCancellationData({
        cancellable,
        partiallyCancellable,
        seatCharges: normalizeEntry(cancel.cancellationCharges?.entry).map(
          (item) => ({
            key: String(item.key),
            value: Number(item.value),
          })
        ),
        seatFares: normalizeEntry(cancel.fares?.entry).map(
          (item) => ({
            key: String(item.key),
            value: Number(item.value),
          })
        ),
        totalRefund: Number(cancel.totalRefundAmount) || 0,
        totalCharge: Number(cancel.totalCancellationCharge) || 0,
        policy: cancel.cancellationPolicy || "As per operator rules.",
      });

      setSelectedSeats([]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to fetch ticket details."
      );
      setTicketDetails(null);
      setCancellationData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatName) => {
    if (!cancellationData?.partiallyCancellable) return;

    setSelectedSeats((prev) =>
      prev.includes(seatName)
        ? prev.filter((s) => s !== seatName)
        : [...prev, seatName]
    );
  };

  const calculatedTotals = useMemo(() => {
    if (!cancellationData) return { refund: 0, charge: 0, fare: 0 };

    if (!cancellationData.partiallyCancellable || selectedSeats.length === 0) {
      return {
        refund: cancellationData.totalRefund,
        charge: cancellationData.totalCharge,
        fare:
          cancellationData.totalRefund + cancellationData.totalCharge,
      };
    }

    let refund = 0;
    let charge = 0;
    let fare = 0;

    selectedSeats.forEach((seat) => {
      const seatCharge =
        cancellationData.seatCharges.find((c) => c.key === seat)?.value || 0;

      const seatFare =
        cancellationData.seatFares.find((f) => f.key === seat)?.value || 0;

      fare += seatFare;
      refund += seatFare - seatCharge;
      charge += seatCharge;
    });

    return { refund, charge, fare };
  }, [selectedSeats, cancellationData]);

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError("");

      let seatsToCancel = [];

      if (cancellationData.partiallyCancellable) {
        if (!selectedSeats.length) {
          setError("Please select at least one seat.");
          setLoading(false);
          return;
        }
        seatsToCancel = selectedSeats;
      } else {
        seatsToCancel = ticketDetails.inventoryItems.map(
          (i) => i.seatName
        );
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cancel-ticket`,
        { tin, seatsToCancel }
      );

      setConfirmOpen(false);
      setSelectedSeats([]);
      await fetchDetails();

      setSuccess({
        refundAmount: calculatedTotals.refund,
      });

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Cancellation failed."
      );
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const cancellableSeatKeys =
    cancellationData?.seatCharges?.map((c) => c.key) || [];

  return (
    <div className="cancel-container">
      <div className="cancel-card">
        <div className="header-row">
  <h2>Cancel Ticket</h2>
  <button
    className="home-btn"
    onClick={() => navigate("/")}
  >
    Home
  </button>
</div>


        {!ticketDetails && !success && (
          <div className="tin-section">
            <input
              type="text"
              placeholder="Enter Ticket ID (TIN)"
              value={tin}
              onChange={(e) => setTin(e.target.value)}
            />
            <button onClick={fetchDetails} disabled={loading}>
              {loading ? "Loading..." : "Fetch Details"}
            </button>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {ticketDetails && cancellationData && !success && (
          <>
            <div className="ticket-info">
              <p><strong>Status:</strong> {ticketDetails.status}</p>
              <p><strong>Total Seats:</strong> {ticketDetails.inventoryItems?.length}</p>
            </div>

            {!cancellationData.cancellable && (
              <div className="error-box">
                This ticket is not cancellable. Departure time may have passed or operator restrictions apply.
              </div>
            )}

            {cancellationData.cancellable && (
              <>
                <h3>
                  {cancellationData.partiallyCancellable
                    ? "Select Seats to Cancel"
                    : "Full Ticket Cancellation"}
                </h3>

                {cancellationData.partiallyCancellable && (
                  <div className="seat-grid">
                    {ticketDetails.inventoryItems.map((item) => {
                      const isSelected = selectedSeats.includes(item.seatName);
                      const isDisabled =
                        !cancellableSeatKeys.includes(item.seatName);

                      return (
                        <div
                          key={item.seatName}
                          className={`seat 
                            ${isSelected ? "selected" : ""} 
                            ${isDisabled ? "disabled" : ""}`}
                          onClick={() =>
                            !isDisabled && toggleSeat(item.seatName)
                          }
                        >
                          {item.seatName}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="refund-summary">
                  <p>Total Fare: ₹{calculatedTotals.fare}</p>
                  <p>Cancellation Charges: ₹{calculatedTotals.charge}</p>
                  <p className="refund-amount">
                    Refund Amount: ₹{calculatedTotals.refund}
                  </p>
                </div>

                <div className="policy-box">
                  <strong>Cancellation Policy:</strong>
                  <p>{cancellationData.policy}</p>
                </div>

                <button
                  className="cancel-btn"
                  disabled={
                    loading ||
                    (cancellationData.partiallyCancellable &&
                      selectedSeats.length === 0)
                  }
                  onClick={() => setConfirmOpen(true)}
                >
                  {cancellationData.partiallyCancellable
                    ? "Cancel Selected Seats"
                    : "Cancel Entire Ticket"}
                </button>
              </>
            )}
          </>
        )}

        {success && (
          <div className="success-box">
            <h3>Cancellation Successful</h3>
            <p>Refund Amount: ₹{success.refundAmount}</p>
            <p>Refund will be credited to original payment method.</p>
          </div>
        )}

        {confirmOpen && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h3>Confirm Cancellation</h3>
              <p>
                {cancellationData.partiallyCancellable
                  ? `You are cancelling ${selectedSeats.length} seat(s).`
                  : "You are cancelling the entire ticket."}
              </p>
              <p>Refund: ₹{calculatedTotals.refund}</p>
              <p>Charges: ₹{calculatedTotals.charge}</p>
              <p>This action cannot be undone.</p>

              <div className="confirm-buttons">
                <button onClick={handleCancel}>
                  {loading ? "Cancelling..." : "Yes, Confirm"}
                </button>
                <button onClick={() => setConfirmOpen(false)}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="note-wrapper">
          <h4>Important Information</h4>
          <ul>
            <li>Cancellation charges apply as per operator policy.</li>
            <li>Refund amount shown before confirmation is final.</li>
            <li>Cancelled seats cannot be restored.</li>
            <li>Refund will be credited to original payment method.</li>
            <li>Cancellation after departure time is not allowed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

