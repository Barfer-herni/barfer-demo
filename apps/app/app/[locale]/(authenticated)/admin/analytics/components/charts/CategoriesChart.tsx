'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';

interface CategorySale {
    categoryName: string;
    quantity: number;
    revenue: number;
    orders: number;
    uniqueProducts: number;
    avgPrice: number;
    statusFilter: string;
}

interface CategoriesChartProps {
    currentCategories: CategorySale[];
    compareCategories?: CategorySale[];
    isComparing?: boolean;
    statusFilter: 'all' | 'pending' | 'confirmed';
    dateFilter?: { from: Date; to: Date };
    compareFilter?: { from: Date; to: Date };
}

// Colores para los gráficos
const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#8DD1E1', '#D084D0', '#FFAB91',
    '#A4DE6C', '#FFC0CB', '#87CEEB', '#DDA0DD', '#F0E68C'
];

export function CategoriesChart({
    currentCategories,
    compareCategories = [],
    isComparing = false,
    statusFilter,
    dateFilter,
    compareFilter
}: CategoriesChartProps) {

    // Preparar datos para el gráfico de dona (top 10)
    const pieData = useMemo(() => {
        return currentCategories.slice(0, 10).map((category, index) => ({
            name: category.categoryName.length > 15
                ? category.categoryName.substring(0, 15) + '...'
                : category.categoryName,
            fullName: category.categoryName,
            value: category.quantity,
            revenue: category.revenue,
            orders: category.orders,
            color: COLORS[index % COLORS.length]
        }));
    }, [currentCategories]);

    // Preparar datos para comparación en gráfico de barras
    const comparisonData = useMemo(() => {
        if (!isComparing || !compareCategories.length) return [];

        // Tomar las top 8 categorías del período principal
        const topCategories = currentCategories.slice(0, 8);

        return topCategories.map(current => {
            const compare = compareCategories.find(c => c.categoryName === current.categoryName);
            return {
                category: current.categoryName.length > 12
                    ? current.categoryName.substring(0, 12) + '...'
                    : current.categoryName,
                fullName: current.categoryName,
                current: current.quantity,
                currentRevenue: current.revenue,
                compare: compare?.quantity || 0,
                compareRevenue: compare?.revenue || 0
            };
        });
    }, [currentCategories, compareCategories, isComparing]);

    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString()}`;
    };

    const formatDateRange = (from: Date, to: Date) => {
        return `${from.toLocaleDateString('es-ES')} - ${to.toLocaleDateString('es-ES')}`;
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'all': return 'Todas';
            case 'pending': return 'Pendientes';
            case 'confirmed': return 'Confirmadas';
            default: return 'Todas';
        }
    };

    const getCategoryIcon = (category: string) => {
        const upperCategory = category.toUpperCase();

        // Iconos para categorías específicas de perro
        if (upperCategory.includes('PERRO POLLO')) return '🐶🍗';
        if (upperCategory.includes('PERRO VACA')) return '🐶🥩';
        if (upperCategory.includes('PERRO CERDO')) return '🐶🥓';
        if (upperCategory.includes('PERRO CORDERO')) return '🐶🐑';
        if (upperCategory.includes('PERRO')) return '🐶';

        // Iconos para categorías específicas de gato
        if (upperCategory.includes('GATO POLLO')) return '🐱🍗';
        if (upperCategory.includes('GATO VACA')) return '🐱🥩';
        if (upperCategory.includes('GATO CORDERO')) return '🐱🐑';
        if (upperCategory.includes('GATO')) return '🐱';

        // Iconos para productos especiales
        if (upperCategory.includes('HUESOS')) return '🦴';
        if (upperCategory.includes('COMPLEMENTOS')) return '🔧';
        if (upperCategory.includes('BIG DOG')) return '📦';

        return '📋';
    };

    // Componente personalizado para las etiquetas del gráfico de dona
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        if (percent < 0.05) return null; // No mostrar etiquetas para segmentos muy pequeños

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={10}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Gráfico de Dona - Distribución de Categorías */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-lg">Distribución por Categorías</span>
                        <Badge variant="secondary" className="w-fit">
                            {getStatusLabel(statusFilter)} - Top 10
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Distribución de unidades vendidas por categoría
                        {dateFilter && ` (${formatDateRange(dateFilter.from, dateFilter.to)})`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Gráfico de dona */}
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        innerRadius={40}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number, name: string, props: any) => [
                                            `${value.toLocaleString()} unidades`,
                                            `${getCategoryIcon(props.payload.fullName)} ${props.payload.fullName}`
                                        ]}
                                        labelFormatter={() => ''}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Leyenda personalizada */}
                        <div className="lg:w-64 lg:flex-shrink-0">
                            <h4 className="text-sm font-medium mb-3">Categorías</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {pieData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="flex-1 min-w-0">
                                            <span className="mr-1">{getCategoryIcon(entry.fullName)}</span>
                                            <span className="truncate">{entry.fullName}</span>
                                        </span>
                                        <span className="text-muted-foreground font-medium">
                                            {entry.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Gráfico de Comparación de Categorías */}
            {isComparing && comparisonData.length > 0 && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="text-lg">Comparación de Categorías</span>
                            <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                <Badge variant="outline" className="text-blue-600 w-fit">
                                    Principal: {dateFilter && formatDateRange(dateFilter.from, dateFilter.to)}
                                </Badge>
                                <Badge variant="outline" className="text-orange-600 w-fit">
                                    Comparación: {compareFilter && formatDateRange(compareFilter.from, compareFilter.to)}
                                </Badge>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Comparación de unidades vendidas - Top 8 categorías
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart
                                data={comparisonData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                                barCategoryGap="15%"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="category"
                                    tick={{ fontSize: 9 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={120}
                                    interval={0}
                                />
                                <YAxis
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string, props: any) => [
                                        `${value.toLocaleString()} unidades`,
                                        name === 'current' ? 'Principal' : 'Comparación'
                                    ]}
                                    labelFormatter={(label, payload) => {
                                        const data = payload?.[0]?.payload;
                                        return data ? (
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {getCategoryIcon(data.fullName)} {data.fullName}
                                                </div>
                                            </div>
                                        ) : label;
                                    }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="current"
                                    name="Principal"
                                    fill="#3b82f6"
                                    radius={[2, 2, 0, 0]}
                                    maxBarSize={40}
                                />
                                <Bar
                                    dataKey="compare"
                                    name="Comparación"
                                    fill="#ea580c"
                                    radius={[2, 2, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 