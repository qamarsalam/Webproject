function ContactUs() {
  return (
    <div>
      <h1>Contact Us</h1>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <textarea placeholder="Your Message" rows="5"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ContactUs;