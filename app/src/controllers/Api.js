const url = 'https://b39qqxiz79.execute-api.us-east-1.amazonaws.com/Stage1'

function api(resource) {
    return url + resource
}
export async function post(resource, data, handler) {
    fetch(api(resource), {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)   // Stringify into string for request
    })
    .then((response) => response.json())
    .then((responseJson) => handler(responseJson))
    .catch((err) => handler(err))
}