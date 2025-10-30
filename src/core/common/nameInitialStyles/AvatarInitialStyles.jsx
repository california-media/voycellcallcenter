import React from "react";


const AvatarInitialStyles = ({ name }) => {

  const getInitials = (contactPerson) => {
    const firstName = contactPerson.trim();
    return firstName.charAt(0).toUpperCase();
  };

  const getAvatarStyles = (initial) => {
    const colors = {
      A: { bg: "#f5e0e0", border: "#f1c1c1", text: "#b83030" },
  B: { bg: "#e0f5f1", border: "#b3e3d6", text: "#2a604f" },
  C: { bg: "#e0eaf5", border: "#b3cde3", text: "#30405f" },
  D: { bg: "#f5e9e0", border: "#e3c9b3", text: "#60452a" },
  E: { bg: "#e8e0f5", border: "#d1b3e3", text: "#5f2a60" },
  F: { bg: "#f0f5e0", border: "#d3e3b3", text: "#606f2a" },
  G: { bg: "#e0f5e5", border: "#b3e3b3", text: "#2a604f" },
  H: { bg: "#f5f0e0", border: "#e3d1b3", text: "#60452a" },
  I: { bg: "#e0e5f5", border: "#b3cde3", text: "#30405f" },
  J: { bg: "#f5e0f0", border: "#f1c1e3", text: "#b83063" },
  K: { bg: "#eaf5e0", border: "#cde3b3", text: "#4f602a" },
  L: { bg: "#f5e0d0", border: "#f1c1b3", text: "#b8302c" },
  M: { bg: "#e0f5f0", border: "#b3e3b3", text: "#2a604f" },
  N: { bg: "#f5e0d0", border: "#f1c1b3", text: "#b8302c" },
  O: { bg: "#d0e0f5", border: "#b3c1e3", text: "#30307f" },
  P: { bg: "#f5d0e0", border: "#f1b3d1", text: "#b83058" },
  Q: { bg: "#f5e3e0", border: "#f1b3c3", text: "#b83036" },
  R: { bg: "#e0e0f5", border: "#b3b3e3", text: "#2a2a60" },
  S: { bg: "#f5e0b0", border: "#f1c1a1", text: "#b83018" },
  T: { bg: "#e0f5c0", border: "#b3e3b1", text: "#2a6030" },
  U: { bg: "#f0e0f5", border: "#d1b3e1", text: "#5f2a87" },
  V: { bg: "#e0f5f5", border: "#b3e3e3", text: "#2a7575" },
  W: { bg: "#f5d0e0", border: "#f1b3d1", text: "#b83055" },
  X: { bg: "#d0e0e5", border: "#b3c1d1", text: "#30405f" },
  Y: { bg: "#f5e3d0", border: "#f1b3c0", text: "#b83028" },
  Z: { bg: "#e0e5d5", border: "#b3c5e3", text: "#30405f" },
      
    };
    const defaultColor = { bg: "#e0e0e0", border: "#b3b3b3", text: "#333" };
    return colors[initial] || defaultColor;
  };


  const initial = getInitials(name);
  const avatarStyles = getAvatarStyles(initial);

  return (
    <div
      className="avatar-initials"
      style={{
        backgroundColor: avatarStyles.bg,
        // borderColor: avatarStyles.border,
        color: avatarStyles.text,
      }}
    >
      {initial}
    </div>
  );
};

export default AvatarInitialStyles;
