import { useRouter } from 'next/router';
import ErrorPage from "next/error";
import React from 'react';

const NotFoundPage = () => {
  const router = useRouter();
    

  const handleGoBack = () => {
    const transactionType = localStorage.getItem('transactionType');
    // Redirect the user back to their own page based on their transaction type
    switch (transactionType) {
      case 'APPLICATION':
        router.push('/counter-personnel/application');
        break;
      case 'CUSTOMER WELFARE':
        router.push('/counter-personnel/customer-welfare');
        break;
      case 'PAYMENT':
        router.push('/counter-personnel/payment');
        break;
      default:
        // Redirect to a default page if the transaction type is not recognized
        router.push('/login');
        break;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <ErrorPage statusCode={404} title="Page Not Found" />
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button onClick={handleGoBack}>&larr; Go Back</button>
    </div>
  );
};

export default NotFoundPage;