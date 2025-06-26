"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format, isAfter, isBefore, parse } from "date-fns";
import {
    PieChart, Pie, Cell, ResponsiveContainer, RadarChart,
    PolarGrid, PolarAngleAxis, Radar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend,
} from "recharts";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DashboardData {
    totalAbertos: number;
    totalFinalizados: number;
    totalEmAndamento: number;
    chamadosPorStatus: { status: string; quantidade: number }[];
    chamadosPorSetor: { setor: string; quantidade: number }[];
    rankingTecnicos: { tecnico: string; quantidade: number }[];
    chamadosPorData: { data: string; quantidade: number }[];
    chamadosPorTipoProblema: { tipoProblema: string; quantidade: number }[];
}

function formatarDataSegura(data: Date | undefined, padrao = "dd/MM/yyyy") {
    if (data instanceof Date && !isNaN(data.getTime())) {
        return format(data, padrao);
    }
    return "-";
}

export default function Dashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/dashboard", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Erro ao carregar dashboard");
                const data = await response.json();
                setDashboard(data);
            } catch (error) {
                toast.error("Erro ao buscar dados do dashboard");
            }
        };
        fetchData();
    }, []);

    const filtrarPorData = (dataStr: string) => {
        if (!dateRange?.from || !dateRange.to) return true;
        const parsedDate = parse(dataStr, "dd/MM/yyyy", new Date());
        return !isBefore(parsedDate, dateRange.from) && !isAfter(parsedDate, dateRange.to);
    };

    const COLORS = ["#6D28D9", "#2563EB", "#059669", "#EC4899", "#F59E0B", "#E11D48", "#10B981"];

    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-3xl text-blue-700 font-bold mb-6">Dashboard</h1>

                <Tabs defaultValue="status" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="status">Status</TabsTrigger>
                        <TabsTrigger value="setor">Setor</TabsTrigger>
                        <TabsTrigger value="tecnicos">Técnicos</TabsTrigger>
                        <TabsTrigger value="data">Por Período</TabsTrigger>
                        <TabsTrigger value="tipo">Tipo Problema</TabsTrigger>
                    </TabsList>

                    {/* STATUS */}
                    <TabsContent value="status">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-2">Chamados por Status</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={dashboard?.chamadosPorStatus} dataKey="quantidade" nameKey="status" outerRadius={100} label>
                                            {dashboard?.chamadosPorStatus.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="mt-4 text-sm text-neutral-700">
                                    Total de chamados em aberto: <strong>{dashboard?.totalAbertos}</strong> | Em andamento: <strong>{dashboard?.totalEmAndamento}</strong> | Finalizados: <strong>{dashboard?.totalFinalizados}</strong>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* SETOR */}
                    <TabsContent value="setor">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-2">Chamados por Setor</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={dashboard?.chamadosPorSetor} dataKey="quantidade" nameKey="setor" outerRadius={100} label>
                                            {dashboard?.chamadosPorSetor.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="mt-4 text-sm text-neutral-700">
                                    Setores mais ativos: <strong>{dashboard?.chamadosPorSetor.map(s => s.setor).join(", ")}</strong>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TÉCNICOS */}
                    <TabsContent value="tecnicos">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-2">Ranking de Técnicos</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={dashboard?.rankingTecnicos}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="tecnico" />
                                        <Radar dataKey="quantidade" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>

                                <div className="mt-4 text-sm text-neutral-700">
                                    Técnico com mais finalizações: <strong>{dashboard?.rankingTecnicos[0]?.tecnico || "N/A"}</strong>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* DATA */}
                    <TabsContent value="data">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-4">Chamados por Período</h2>

                                <DayPicker
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                    className="mb-4"
                                />

                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dashboard?.chamadosPorData.filter((item) => filtrarPorData(item.data))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="data" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="quantidade" stroke="#4f46e5" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>

                                <div className="mt-4 text-sm text-neutral-700">
                                    {dateRange?.from && dateRange?.to ? (
                                        <>Período exibido: <strong>{formatarDataSegura(dateRange?.from)}</strong> até <strong>{formatarDataSegura(dateRange?.to)}</strong></>
                                    ) : (
                                        <>Exibindo todos os períodos disponíveis</>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TIPO PROBLEMA */}
                    <TabsContent value="tipo">
                        <Card>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-2">Chamados por Tipo de Problema</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dashboard?.chamadosPorTipoProblema}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="tipoProblema" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="quantidade" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="mt-4 text-sm text-neutral-700">
                                    Tipos mais frequentes: <strong>{dashboard?.chamadosPorTipoProblema.map(t => t.tipoProblema).join(", ")}</strong>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
