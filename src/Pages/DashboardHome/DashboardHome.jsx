"use client"

import { TrendingUp, Users, FileText, ArrowUpRight, ArrowDownRight, MoreHorizontal, Download, MoreHorizontalIcon } from "lucide-react"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { Heading, Card, Button } from "../../components/components";
import { useGetDashboardStatsQuery } from "../../_core/Slices/apiSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { data: statsData, isLoading, error, refetch } = useGetDashboardStatsQuery();
    const navigate = useNavigate();

    // Static fallback data for dashboard
    const dashboardStats = statsData?.data || {
        cards: [
            { title: "Total Projects", value: 0 },
            { title: "Total Categories", value: 0 },
            { title: "Total Users", value: 0 },
            { title: "Total Contact Forms", value: 0 }
        ],
        dataDistribution: [
            { name: "Projects", value: 0 },
            { name: "Categories", value: 0 },
            { name: "Contact Forms", value: 0 },
            { name: "Cost Calculator", value: 0 }
        ]
    };

    // Pie chart ke liye colors (dynamic)
    const PIE_COLORS = ["#3D72FA", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1", "#14B8A6"];

    if (isLoading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="p-6">Error loading dashboard: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <Heading
                level={1}
                title="Dashboard Overview"
                description="Monitor your content performance and user engagement metrics"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats?.cards?.map((stat) => (
                    <Card key={stat.title}>
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-semibold text-text-dark mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card>
                    <Card.Header title="Data Distribution" />
                    <Card.Body>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dashboardStats?.dataDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                                        {dashboardStats?.dataDistribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>

                {/* Category Distribution Chart */}
                <Card>
                    <Card.Header title="Category Distribution" />
                    <Card.Body>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dashboardStats?.categoryDistribution || []}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3D72FA" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;