import {useEffect, useState } from "react";
import api from "../../service/api_Authorization";


export default function CreateRegisterClose() {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: "",
    });
    const [errors, setErrors] = useState({});
    const today = new Date().toISOString().split('T')[0];



    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await api.post(`/createRegisterClose`, formData);
            onSuccess?.();
        } catch (err) {
            if(err.response?.status === 422 ) setErrors(err.response.data.errors || {});
        }
    }

    return (
        <div>
            <h1>Creacion de cierres de caja</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="date"
                    value={formData.date || today} 
                    required 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                />
                <input 
                    type="text" 
                    required 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
                <button type="submit">Crear Cierre de Caja</button>
            </form>
        </div>
    )
}