import React from "react";

/**
 * @typedef UserData
 * @type {object}
 * @property {string} id - an ID.
 * @property {string} name - your name.
 * @property {number} age - your age.
 */

/**
 *
 * @param {Object} props
 * @property {UserData[]} users - user data
 * @property
 * @returns
 */
function ActiveUsers({ users }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id} className="row-flex">
          <p>{user.email}</p>
          <button>open chat</button>
        </div>
      ))}
    </div>
  );
}

export default ActiveUsers;
