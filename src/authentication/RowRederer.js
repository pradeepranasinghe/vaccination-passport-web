import React, { useState, useEffect,useRef } from "react"
const RowRenderer = (items) => {

    useEffect(() => {
        
            

    }, []);

    return (
        <>
            {(items && items.length>0)? <div>
                {items.items}
            </div>:''}
        </>
    )
}
export default RowRenderer;