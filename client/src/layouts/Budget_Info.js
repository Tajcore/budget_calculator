import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

const BudgetInfo = (props) => {
    const id = props.match.params.id;
    const [budget, setBudget] = useState(null);
    useEffect(() => {
        setBudget({})
    
    }, [budget])
    return (
        <div>
            Budget {id}
        </div>
    )
}


export { BudgetInfo };