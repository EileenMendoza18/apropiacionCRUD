export const get = async(url) => {
  const solicitud= await  fetch(`http://localhost:3000/${url}`);
  if (!solicitud.ok) {
    return null;
  }
  const data = await solicitud.json();
  return data;
}