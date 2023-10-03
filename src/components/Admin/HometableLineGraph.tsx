// import { useEffect, useRef } from "react";
// import Chart from "chart.js";

// const LineGraph = ({ filteredTransactions }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const applicationTransaction = filteredTransactions.filter(
//       (cp) => cp.transactionType?.name === "APPLICATION"
//     );

//     const totalApplication = applicationTransaction.length;

//     const CustomerWelfareTransaction = filteredTransactions.filter(
//       (cp) => cp.transactionType?.name === "CUSTOMER WELFARE"
//     );

//     const totalCustomerWelfare = CustomerWelfareTransaction.length;

//     const PaymentTransaction = filteredTransactions.filter(
//       (cp) => cp.transactionType?.name === "PAYMENT"
//     );

//     const totalPayment = PaymentTransaction.length;

//     const dates = filteredTransactions.map((cp) => cp.date); // Assuming filteredTransactions has a 'date' property

//     const ctx = chartRef.current.getContext("2d");
//     new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: dates,
//         datasets: [
//           {
//             label: "Application",
//             data: Array(dates.length).fill(totalApplication),
//             borderColor: "rgba(54, 162, 235, 1)",
//             fill: false,
//           },
//           {
//             label: "Customer Welfare",
//             data: Array(dates.length).fill(totalCustomerWelfare),
//             borderColor: "rgba(255, 99, 132, 1)",
//             fill: false,
//           },
//           {
//             label: "Payment",
//             data: Array(dates.length).fill(totalPayment),
//             borderColor: "rgba(75, 192, 192, 1)",
//             fill: false,
//           },
//         ],
//       },
//       options: {
//         // Configure the chart options (e.g., labels, title, etc.)
//       },
//     });
//   }, [filteredTransactions]);

//   return (
//     <div>
//       <canvas ref={chartRef}></canvas>
//     </div>
//   );
// };

// export default LineGraph;
