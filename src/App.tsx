import { useState } from "react";
import Vechile from "./Screens/Vechile";
import Layout from "./Components/ Layout";
import Invoice from "./Screens/Invoice";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Vehicles":
        return <Vechile />;
      case "Invoices":
        return <Invoice />;
      case "Dashboard":
      default:
        return <div className="p-6 text-gray-600">You don't have a acces to this page</div>;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </Layout>
  );
}
