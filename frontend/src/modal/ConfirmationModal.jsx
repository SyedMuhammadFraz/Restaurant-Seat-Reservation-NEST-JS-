import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmationModal = ({ table, userId, onConfirm, onCancel }) => {
  const [startReservation, setStartReservation] = useState("");
  const [endReservation, setEndReservation] = useState("");
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState("");
  const userID = userId.data._id;
  const tableId = table._id;

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const reservedAt = new Date();
    const startReservation1 = Date.parse(startReservation);
    console.log(startReservation1);
    const endReservation1 = Date.parse(endReservation);
    console.log(endReservation1);

    console.log(reservedAt);
    console.log(startReservation);
    console.log(endReservation);
    console.log(userID);
    console.log(tableId);

    if (!startReservation1 || !endReservation1) {
      setError("Please select both start and end reservation dates.");
      return;
    }

    if (new Date(startReservation1) >= new Date(endReservation1)) {
      setError("End date must be after start date.");
      return;
    }

    const bookedDatesTimestamps = bookedDates.map((date) =>
      new Date(date).getTime()
    );
    console.log(bookedDatesTimestamps)
    const startTime = new Date(startReservation).getTime();
    console.log(startTime)
    const endTime = new Date(endReservation).getTime();
    console.log(endTime)
    if (
      bookedDatesTimestamps.includes(startTime) ||
      bookedDatesTimestamps.includes(endTime)
    ) {
      toast.error(
        "Selected date(s) are already booked. Please choose different dates."
      );
      console.log(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/reservations", {
        reservedAt,
        reservationStart: startReservation1,
        reservationEnd: endReservation1,
        userId: userID,
        tableId: tableId,
      });

      console.log(`Reservation data is: ${response.data._id}`);
      console.log(response.data);
      console.log("Reservation successful");
      if (response && response.data) {
        toast.success("Your seat reserved successfully!");
        setTimeout(() => {
          onConfirm(table._id); // Perform the confirm action after toast shows
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to create reservation", err);
      setError("Failed to create reservation. Please try again.");
      toast.error("Failed to reserve seat. Please try again.");
    }
  };

  useEffect(() => {
    console.log(bookedDates);
    if (startReservation && endReservation) {
      axios.get("http://localhost:3001/reservations").then((response) => {
        const reservations = response.data;
        console.log(reservations);

        const dates = reservations.flatMap((reservation) => {
          const start = new Date(reservation.reservationStart);
          const end = new Date(reservation.reservationEnd);

          console.log(start);
          console.log(end);
          const datesArray = [];

          for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            datesArray.push(new Date(d));
          }
          // console.log(datesArray);
          return datesArray;
        });
        console.log(typeof dates);
        console.log(typeof bookedDates);

        setBookedDates(dates);
        console.log(bookedDates);
      });
    }
  }, [startReservation, endReservation]);

  // const handleStartChange = (e) => {
  //   const selectedDate = e.target.value.split("T")[0];
  //   const start = new Date(selectedDate);
  //   console.log(start);
  //   if (bookedDates.includes(start)) {
  //     console.log("not Reserved!!!!!")
  //     setError("Selected start date is already booked.");
  //   } else {
  //     console.log("Booked dates are not included!")
  //     setError("");
  //     setStartReservation(e.target.value);
  //   }
  // };

  const handleStartChange = (e) => {
    // console.log(typeof bookedDates);
    console.log(bookedDates);
    const selectedDate = new Date(e.target.value);
    const selectedTimestamp = selectedDate.getTime();

    console.log("Selected Date (timestamp):", selectedTimestamp);

    // Assume bookedDates contains dates in Unix timestamp format
    const bookedDatesTimestamps = bookedDates.map((date) =>
      new Date(date).getTime()
    );

    if (bookedDatesTimestamps.includes(selectedTimestamp)) {
      console.log("Selected start date is already booked.");
      setError("Selected start date is already booked.");
    } else {
      console.log("Selected start date is available.");
      setError("");
      setStartReservation(e.target.value);
    }
  };

  const handleEndChange = (e) => {
    console.log(bookedDates);
    const selectedDate = new Date(e.target.value);
    const selectedTimestamp = selectedDate.getTime();

    const bookedDatesTimestamps = bookedDates.map((date) =>
      new Date(date).getTime()
    );

    if (bookedDatesTimestamps.includes(selectedTimestamp)) {
      console.log("Selected end date is already booked.");
      setError("Selected end date is already booked.");
    } else {
      console.log("Selected end date is available.");
      setError("");
      setEndReservation(e.target.value);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Booking for Table {table.number}</h2>
        <form onSubmit={handleReservationSubmit} className="reservation-form">
          <div className="form-group">
            <label htmlFor="start-date">Start Reservation Date:</label>
            <input
              id="start-date"
              type="datetime-local"
              value={startReservation}
              onChange={handleStartChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Reservation Date:</label>
            <input
              id="end-date"
              type="datetime-local"
              value={endReservation}
              onChange={handleEndChange}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Confirm
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default ConfirmationModal;
