let username = $state(null);

export function setUsername(value) {
  username = value;
}

export function getUsername() {
  return username;
}
