import React from "react";

/**
 * @typedef UserData
 * @type {Object}
 * @property {string} id - an ID.
 * @property {string} name - your name.
 * @property {number} age - your age.
 */

/**
 * @typedef Props
 * @type {}
 */

/**
 * @param {Object} props
 * @property {UserData[]} users - user data
 * @property {string} create - user data
 */
function ActiveUsers({ users, create }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id} onClick={() => create(user.id)} className="row-flex">
          <p>{user.email}</p>
          <button>open chat</button>
        </div>
      ))}
    </div>
  );
}

export default ActiveUsers;
