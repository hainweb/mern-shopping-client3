import React, { useEffect } from 'react';
import AdminHeader from '../Components/Adminheader/Adminheader';
import UserHeader from '../Components/Userheader/UserHeader';


function Layout({ isAdmin, user, cartCount }) {
  // Use useEffect to add external scripts
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdn.datatables.net/2.1.4/js/dataTables.js';
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
      {/* External CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <link rel="stylesheet" href="https://cdn.datatables.net/2.1.4/css/dataTables.dataTables.css" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />

      <title>Shopping Cart</title>

      {/* Conditional rendering of headers */}
      {isAdmin ? (
        <AdminHeader isAdmin={true} adminSec={true} />
      ) : (
        <UserHeader user={user} cartCount={cartCount} />
      )}
    </div>
  );
}

export default Layout;
