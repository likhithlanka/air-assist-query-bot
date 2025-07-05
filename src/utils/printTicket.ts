import { Transaction } from '@/types/chatbot';

/**
 * Generates a professional airline ticket PDF and triggers print
 * This function creates a clean, printable version without UI elements
 */
export const printTicketPDF = (transaction: Transaction) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups to print the ticket');
    return;
  }

  // Generate the HTML content for the professional ticket
  const ticketHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AirAssist Airlines - E-Ticket</title>
      <meta charset="utf-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
        }
        
        .ticket-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .airline-info h1 {
          font-size: 32px;
          color: #2563eb;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .airline-info p {
          color: #666;
          font-size: 14px;
        }
        
        .ticket-type {
          text-align: right;
        }
        
        .ticket-type .main {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        
        .ticket-type .sub {
          font-size: 12px;
          color: #666;
        }
        
        .booking-ref {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .ref-item .label {
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .ref-item .value {
          font-size: 18px;
          font-weight: bold;
          color: #000;
        }
        
        .pnr-failed {
          color: #dc2626;
        }
        
        .pnr-success {
          color: #16a34a;
        }
        
        .flight-info {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .flight-route {
          background: #eff6ff;
          padding: 30px;
          border-radius: 12px;
          position: relative;
        }
        
        .route-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .airport {
          text-align: center;
        }
        
        .airport-code {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }
        
        .airport-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .time {
          font-size: 16px;
          font-weight: 600;
        }
        
        .flight-details {
          text-align: center;
          flex: 1;
          margin: 0 40px;
        }
        
        .flight-number {
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        
        .flight-line {
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          border-radius: 1px;
          position: relative;
        }
        
        .plane-icon {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 10px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
        }
        
        .details-section {
          padding: 0;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .detail-label {
          color: #666;
          font-weight: 500;
        }
        
        .detail-value {
          font-weight: 600;
          color: #000;
        }
        
        .payment-info {
          margin-bottom: 30px;
        }
        
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }
        
        .payment-card {
          text-align: center;
          padding: 20px;
          border-radius: 8px;
        }
        
        .payment-amount {
          background: #f0fdf4;
        }
        
        .payment-method {
          background: #eff6ff;
        }
        
        .payment-status {
          background: #f8fafc;
        }
        
        .payment-card .label {
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        
        .payment-card .value {
          font-size: 20px;
          font-weight: bold;
        }
        
        .amount-value { color: #16a34a; }
        .method-value { color: #2563eb; }
        .status-value { color: #16a34a; }
        
        .refund-section {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 0 8px 8px 0;
        }
        
        .refund-title {
          font-size: 16px;
          font-weight: bold;
          color: #92400e;
          margin-bottom: 15px;
        }
        
        .refund-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .refund-detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .refund-label {
          color: #92400e;
          font-weight: 500;
        }
        
        .terms {
          border-top: 2px solid #e5e7eb;
          padding-top: 20px;
          margin-top: 30px;
        }
        
        .terms-title {
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 12px;
        }
        
        .terms-list {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
        }
        
        .terms-list p {
          margin-bottom: 6px;
        }
        
        .footer {
          border-top: 1px solid #e5e7eb;
          margin-top: 20px;
          padding-top: 15px;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        
        .footer p {
          margin-bottom: 5px;
        }
        
        @media print {
          body { 
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .ticket-container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <!-- Header -->
        <div class="header">
          <div class="airline-info">
            <h1>AirAssist Airlines</h1>
            <p>Your Journey, Our Priority</p>
          </div>
          <div class="ticket-type">
            <div class="main">E-TICKET</div>
            <div class="sub">Electronic Ticket Receipt</div>
          </div>
        </div>
        
        <!-- Booking Reference -->
        <div class="booking-ref">
          <div class="ref-item">
            <div class="label">Booking Reference</div>
            <div class="value">${transaction.booking_id}</div>
          </div>
          <div class="ref-item">
            <div class="label">Transaction ID</div>
            <div class="value">${transaction.transaction_id}</div>
          </div>
          <div class="ref-item">
            <div class="label">PNR Status</div>
            <div class="value ${transaction.pnr && transaction.pnr !== 'Failed' ? 'pnr-success' : 'pnr-failed'}">
              ${transaction.pnr || 'FAILED'}
            </div>
          </div>
        </div>
        
        <!-- Flight Information -->
        <div class="flight-info">
          <h2 class="section-title">FLIGHT INFORMATION</h2>
          <div class="flight-route">
            <div class="route-container">
              <div class="airport">
                <div class="airport-code">${transaction.departure_airport}</div>
                <div class="airport-label">Departure</div>
                <div class="time">${transaction.departure_time}</div>
              </div>
              <div class="flight-details">
                <div class="flight-number">${transaction.flight_number}</div>
                <div class="flight-line">
                  <div class="plane-icon">✈️ FLIGHT</div>
                </div>
              </div>
              <div class="airport">
                <div class="airport-code">${transaction.arrival_airport}</div>
                <div class="airport-label">Arrival</div>
                <div class="time">${transaction.arrival_time}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Passenger and Booking Details -->
        <div class="details-grid">
          <div class="details-section">
            <h3 class="section-title">PASSENGER DETAILS</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${transaction.passenger_name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span class="detail-value">${transaction.contact_number}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${transaction.email || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Frequent Flyer:</span>
              <span class="detail-value">${transaction.frequent_flyer_id || 'N/A'}</span>
            </div>
          </div>
          
          <div class="details-section">
            <h3 class="section-title">BOOKING DETAILS</h3>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${transaction.booking_date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Class:</span>
              <span class="detail-value">${transaction.class || 'Economy'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Seat:</span>
              <span class="detail-value">${transaction.seat_number || 'To be assigned'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Baggage:</span>
              <span class="detail-value">${transaction.baggage_allowance || '20kg'}</span>
            </div>
          </div>
        </div>
        
        <!-- Payment Information -->
        <div class="payment-info">
          <h3 class="section-title">PAYMENT INFORMATION</h3>
          <div class="payment-grid">
            <div class="payment-card payment-amount">
              <div class="label">Total Amount</div>
              <div class="value amount-value">$${transaction.total_amount_paid}</div>
            </div>
            <div class="payment-card payment-method">
              <div class="label">Payment Method</div>
              <div class="value method-value">${transaction.payment_instrument}</div>
            </div>
            <div class="payment-card payment-status">
              <div class="label">Status</div>
              <div class="value status-value">PAID</div>
            </div>
          </div>
        </div>
        
        <!-- Refund Information (if applicable) -->
        ${(transaction.refund_id || transaction.refund_status) ? `
        <div class="refund-section">
          <h3 class="refund-title">REFUND INFORMATION</h3>
          <div class="refund-grid">
            <div>
              <div class="refund-detail-row">
                <span class="refund-label">Refund ID:</span>
                <span class="detail-value">${transaction.refund_id || 'N/A'}</span>
              </div>
              <div class="refund-detail-row">
                <span class="refund-label">Status:</span>
                <span class="detail-value">${transaction.refund_status || 'N/A'}</span>
              </div>
            </div>
            <div>
              <div class="refund-detail-row">
                <span class="refund-label">Amount:</span>
                <span class="detail-value">$${transaction.refund_amount || '0.00'}</span>
              </div>
              <div class="refund-detail-row">
                <span class="refund-label">Date:</span>
                <span class="detail-value">${transaction.refund_date || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        <!-- Terms and Conditions -->
        <div class="terms">
          <h3 class="terms-title">IMPORTANT INFORMATION</h3>
          <div class="terms-list">
            <p>• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.</p>
            <p>• Valid government-issued photo identification is required for all passengers.</p>
            <p>• Check-in closes 45 minutes before departure for domestic flights and 60 minutes for international flights.</p>
            <p>• Baggage restrictions and fees may apply. Please check our website for current policies.</p>
            <p>• Flight times are subject to change. Please confirm your flight status before traveling.</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>AirAssist Airlines • Customer Service: 1-800-FLY-EASY • www.airassist.com</p>
          <p>Thank you for choosing AirAssist Airlines. We appreciate your business!</p>
        </div>
      </div>
      
      <script>
        // Auto-print when page loads
        window.onload = function() {
          window.print();
          // Close the window after printing (optional)
          window.onafterprint = function() {
            window.close();
          };
        }
      </script>
    </body>
    </html>
  `;

  // Write the HTML content to the new window
  printWindow.document.write(ticketHTML);
  printWindow.document.close();
  
  // Focus on the print window
  printWindow.focus();
};

/**
 * Alternative function to generate PDF blob for download
 * (This would require additional PDF generation library like jsPDF)
 */
export const generateTicketPDF = async (transaction: Transaction): Promise<Blob | null> => {
  // This would require installing jsPDF or similar library
  // For now, we'll use the print method above
  console.log('PDF generation would require additional PDF library');
  return null;
};
