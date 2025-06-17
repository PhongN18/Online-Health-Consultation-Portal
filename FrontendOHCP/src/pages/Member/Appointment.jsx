
function Appointment() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
            <form className="space-y-4">
                <input type="text" placeholder="Name" className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" placeholder="Reason for Visit" className="w-full p-2 border border-gray-300 rounded" />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">Submit</button>
            </form>
        </div>
    );
}

export default Appointment;
