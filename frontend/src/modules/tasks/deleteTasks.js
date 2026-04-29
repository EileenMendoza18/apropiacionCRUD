export async function deleteData(endpoint, id) {
    const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
}