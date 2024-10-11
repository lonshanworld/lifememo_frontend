async function getApiRequest(apistring, cookiedata){
    return await fetch(
        apistring,{
            method: "GET",
            // credentials: "include",
            headers: {
                Authorization : `Bearer ${cookiedata}`,
            },
        }
    );
}

async function postApiRequest(apistring, cookiedata, body){
    return await fetch(
        apistring,{
            method: "POST",
            // credentials: "include",
            headers: {
                Authorization : `Bearer ${cookiedata}`,
            },
            body : body
        },
    )
};

async function deleteApiRequest(apistring, cookiedata, body){
    return await fetch(
        apistring,{
            method: "DELETE",
            // credentials: "include",
            headers: {
                Authorization : `Bearer ${cookiedata}`,
                'Content-Type': 'application/json'
            },
            body : body
        },
    )
};

async function putApiRequest(apistring, cookiedata, body){
    return await fetch(
        apistring,{
            method: "PUT",
            // credentials: "include",
            headers: {
                Authorization : `Bearer ${cookiedata}`,
                'Content-Type': 'application/json'
            },
            body : body
        },
    )
};

export {
    getApiRequest,
    postApiRequest,
    deleteApiRequest,
    putApiRequest
};