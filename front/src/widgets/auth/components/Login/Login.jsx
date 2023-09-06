import React from "react";
import { Context } from "../../../../app/context/Context";
function LogIn() {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const ctx = React.useContext(Context);

  const handleForm = (e) => {
    switch (e.target.id ?? "") {
      case "password":
        setForm((prev) => ({
          ...prev,
          password: e.target.value,
        }));
        break;
      case "email":
        setForm((prev) => ({
          ...prev,
          email: e.target.value,
        }));
        break;
      default:
        return "";
    }
  };

  return (
    <div
      className="form-container"
      style={{
        maxWidth: "500px",
      }}
    >
      <h2>Log in</h2>
      <form
        className="form-container"
        style={{
          marginTop: "12px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          ctx.logIn(form.email, form.password);
        }}
      >
        <input
          onChange={handleForm}
          type="text"
          value={form.email}
          placeholder="email"
          id="email"
        />
        <input
          onChange={handleForm}
          type="password"
          value={form.password}
          placeholder="password"
          id="password"
        />
        <button type="submit">log in</button>
      </form>
    </div>
  );
}

export default LogIn;
