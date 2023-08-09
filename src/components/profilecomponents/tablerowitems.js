import React from "react";

function TablerowItem(props){
    return (
        <tr key={props.txt}>
            <td className="px-3 py-3">
                <i className={`fa-solid ${props.icon} fa-xl`}></i>
            </td>
            <td>{props.txt}</td>
        </tr>
    );
}

export default TablerowItem;