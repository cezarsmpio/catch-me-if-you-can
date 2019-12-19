export function generateRoomId(originalName = "") {
  const inputRoomValue = originalName.replace(/\s/g, "-");
  const roomRandomId = Math.random()
    .toString(36)
    .substr(2, 3);
  const roomName = roomRandomId + "_" + inputRoomValue;

  return roomName;
}

export function getOriginalRoomName(room = "") {
  if (!room) return '';

  const [, roomName] = room.split("_");

  if (!roomName) return "";

  return roomName.replace(/-/g, " ");
}
