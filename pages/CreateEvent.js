function CreateEvent() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Event</h2>

      <input placeholder="Title" /><br /><br />
      <textarea placeholder="Description"></textarea><br /><br />
      <input type="date" /><br /><br />
      <input placeholder="Location" /><br /><br />

      <select>
        <option>Public</option>
        <option>KU Only</option>
      </select><br /><br />

      <button>Publish Event</button>
    </div>
  );
}

export default CreateEvent;