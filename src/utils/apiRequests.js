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

export {
    getApiRequest,
    postApiRequest,
};