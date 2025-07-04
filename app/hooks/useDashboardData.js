"use client";
import { useState, useEffect } from "react";

// URL da nossa API.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const fetcher = async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
        const error = new Error('Ocorreu um erro ao buscar os dados.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

export const useDashboardData = () => {
    const [data, setData] = useState({
        totalSales: 0,
        dailyTotal: 0,
        monthlyTotal: 0,
        birthdayClients: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Dispara todas as requisições em paralelo
                const [
                    totalRes,
                    dailyRes,
                    monthlyRes,
                    birthdayRes
                ] = await Promise.all([
                    fetcher('/sales/total'),
                    fetcher('/sales/daily'),
                    fetcher('/sales/monthly'),
                    fetcher('/clients/birthday/monthly')
                ]);

                setData({
                    totalSales: totalRes.total || 0,
                    dailyTotal: dailyRes.dailyTotal || 0,
                    monthlyTotal: monthlyRes.monthlyTotal || 0,
                    birthdayClients: birthdayRes || [],
                });

            } catch (err) {
                console.error("Erro no dashboard:", err);
                setError("Não foi possível carregar os dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { ...data, loading, error };
};