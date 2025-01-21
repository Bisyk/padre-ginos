export default async function getPastOrder(id) {
  const response = await fetch(`/api/past-order/${id}`);
  const data = await response.json();
  return data;
}