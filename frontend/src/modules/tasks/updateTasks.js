export async function updateData(endpoint, id, data) {
    const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}