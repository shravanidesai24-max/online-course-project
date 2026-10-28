
import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Connect this handler to your Django registration API
    // to create an actual user account.
    setMessage(
      "Your form is ready. Connect the Django registration API to complete registration."
    );
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      background:
        "linear-gradient(135deg, #edf4fc 0%, #f8fafc 100%)",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "480px",
      padding: "36px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 12px 40px rgba(18, 52, 90, 0.12)",
      border: "1px solid #e3eaf3",
    },
    heading: {
      color: "#12345a",
      fontSize: "30px",
      fontWeight: "700",
      textAlign: "center",
      margin: "0 0 8px",
    },
    subtitle: {
      color: "#64748b",
      textAlign: "center",
      fontSize: "14px",
      lineHeight: "1.6",
      marginBottom: "28px",
    },
    label: {
      display: "block",
      color: "#263445",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "7px",
    },
    input: {
      display: "block",
      boxSizing: "border-box",
      width: "100%",
      padding: "12px 14px",
      marginBottom: "18px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "15px",
      outlineColor: "#315b85",
      backgroundColor: "#ffffff",
    },
    button: {
      width: "100%",
      padding: "13px",
      marginTop: "4px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#12345a",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
    },
    message: {
      marginTop: "16px",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#eff6ff",
      color: "#12345a",
      fontSize: "14px",
      lineHeight: "1.5",
    },
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.heading}>Sign Up</h1>

        <p style={styles.subtitle}>
          Create your Cars Dealership account to explore dealerships
          and share your reviews.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="username">
            Username
          </label>
          <input
            style={styles.input}
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <label style={styles.label} htmlFor="firstName">
            First Name
          </label>
          <input
            style={styles.input}
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            required
          />

          <label style={styles.label} htmlFor="lastName">
            Last Name
          </label>
          <input
            style={styles.input}
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            required
          />

          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            style={styles.input}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            style={styles.input}
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button style={styles.button} type="submit">
            Register
          </button>

          {message && (
            <p style={styles.message} role="status">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Register;
