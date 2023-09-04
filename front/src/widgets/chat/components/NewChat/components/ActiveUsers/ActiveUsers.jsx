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
        <p key={user.id}>{user.email}</p>
      ))}
    </div>
  );
}

export default ActiveUsers;
