"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card';
import styles from '../page.module.css';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function SalesChart({ data }) {

  return (
    <Card className={styles.chartCard}>
        <h3 className={styles.cardTitle}>Vendas dos Últimos 7 Dias</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(value) => `R$${value}`} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--card-background)', 
                border: '1px solid var(--border)',
                color: 'var(--foreground)' 
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Bar dataKey="Total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}