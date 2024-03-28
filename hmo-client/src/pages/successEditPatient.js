import React from 'react';
import {Link } from 'react-router-dom';

export default function SuccessEditPatient() {
    

    return (
        <>
            <h1>הפרטים עודכנו בהצלחה</h1>
            <Link to="/Home">חזור לדף הבית</Link>
        </>
    );
}
