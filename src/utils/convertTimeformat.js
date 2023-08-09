function convertTime(value){
    const date = new Date(value);
    const formattedDate = date.toLocaleString("en-US",{
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute : "2-digit",
        hour12 : true,
    }).replace(",", " ");
    return formattedDate;
}

export default convertTime;