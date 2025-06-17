
function Profile() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <p>Name: John Doe</p>
            <p>Email: johndoe@example.com</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">Edit Profile</button>
        </div>
    );
}

export default Profile;
