import { useState, useEffect } from "react";

interface Vehicle {
  slNo: number;
  vehicleNumber: string;
  fitness: string;
  rc: string;
  pollution: string;
  insurance: string;
}

const getStatus = (vehicle: Vehicle) => {
  const today = new Date();
  const insuranceDate = new Date(vehicle.insurance);
  const pollutionDate = new Date(vehicle.pollution);
  const rcDate = new Date(vehicle.rc);

  if (insuranceDate >= today && pollutionDate >= today && rcDate >= today) {
    return "Active";
  }
  return "Inactive";
};

const statusStyles: Record<"Active" | "Inactive", string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
};

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:5054/api/vehicles")
      .then((res) => res.json())
      .then((data: Vehicle[]) => setVehicles(data))
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  const filteredData = vehicles.filter((vehicle) =>
    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        <p className="text-sm text-gray-500 mb-3">View and manage your vehicles</p>
        <input
          type="text"
          placeholder="Search by Vehicle Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Sl. No</th>
              <th className="px-6 py-3 text-left">Vehicle Number</th>
              <th className="px-6 py-3 text-left">Insurance</th>
              <th className="px-6 py-3 text-left">Pollution</th>
              <th className="px-6 py-3 text-left">RC Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredData.map((item) => {
              const status = getStatus(item);
              return (
                <tr key={item.slNo} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.slNo}</td>
                  <td className="px-6 py-4 font-medium">{item.vehicleNumber}</td>
                  <td className="px-6 py-4">{item.insurance}</td>
                  <td className="px-6 py-4">{item.pollution}</td>
                  <td className="px-6 py-4">{item.rc}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-500 font-medium hover:underline"
                      onClick={() => setSelectedVehicle(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center bg-orange-600 px-6 py-5">
              <h2 className="text-xl font-bold text-orange-50">Vehicle Details</h2>
              <button
                className="text-orange-50 text-lg font-bold hover:text-orange-200"
                onClick={() => setSelectedVehicle(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Sl. No:</span>
                <span>{selectedVehicle.slNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Vehicle Number:</span>
                <span>{selectedVehicle.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Insurance:</span>
                <span>{selectedVehicle.insurance}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Pollution:</span>
                <span>{selectedVehicle.pollution}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">RC Date:</span>
                <span>{selectedVehicle.rc}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[getStatus(selectedVehicle)]}`}
                >
                  {getStatus(selectedVehicle)}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                className="bg-orange-600 text-orange-50 px-4 py-2 rounded hover:bg-orange-700 transition"
                onClick={() => setSelectedVehicle(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
