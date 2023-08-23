import React from "react";
import Auth from "../../Auth";
import Register from "../User/User";
import { Context } from "../../../../app/context/Context";
function SignIn() {
  const [form, setForm] = React.useState({
    name: "",
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
      case "name":
        setForm((prev) => ({
          ...prev,
          name: e.target.value,
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
      <h2>Sign in</h2>
      <form
        className="form-container"
        style={{
          marginTop: "12px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          ctx.signIn(form.name, form.password);
        }}
      >
        <input
          onChange={handleForm}
          type="text"
          value={form.name}
          placeholder="name"
          id="name"
        />
        <input
          onChange={handleForm}
          type="password"
          value={form.password}
          placeholder="password"
          id="password"
        />
        <button type="submit">sign in</button>
      </form>
    </div>
  );
}

export default SignIn;
