import React, { useEffect, useState } from "react";
import { RequestServer } from "../api/HttpReq";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Box,
    CircularProgress
} from "@mui/material";
import PieChart from "./charts/PieChart";
import BarChart from "./charts/BarChart";

function DynamicHomePage() {
    const getCurrentMonthLead = '/dashboard/leads/current-month';
    const urlaggregateDealsByAmount = '/dashboard/deals/aggregate-by-amount';
    const inventoryActiveDeals = 'dashboard/inventory/active-deals'
    const dashboards = [
        { id: '1', name: 'Current Month Enquiry by Source' },
        { id: '2', name: 'Deals by Current Stage' },
        { id: '3', name: 'Total Properties with Active Deals' }
    ];

    const [selectedDashboard, setSelectedDashboard] = useState(dashboards[0].id);
    const [loading, setLoading] = useState(true);
    const [currentMonthLeadChartData, setCurrentMonthLeadChartData] = useState([]);
    const [aggregateDealsChartData, setAggregateDealsChartData] = useState([]);
    const [propertyActiveDealsChartData, setPropertyActiveDealsChartData] = useState([]);

    useEffect(() => {
        if (selectedDashboard === '1') {
            getCurrentMonthLeadData();
        } else if (selectedDashboard === '2') {
            getAggregateDeals();
        } else if (selectedDashboard === '3') {
            getPropertyActiveDeals();
        }
    }, [selectedDashboard]);

    const getCurrentMonthLeadData = async () => {
        try {
            setLoading(true);
            let res = await RequestServer("get", getCurrentMonthLead, {});
            console.log(res, "res getCurrentMonthLeadData");
            if (res.success && Array.isArray(res.data)) {
                setCurrentMonthLeadChartData(res.data.map(item => ({
                    x: item.leadsource || 'Undefined', // Label
                    y: parseFloat(item.lead_count),     // Value
                    z: item.percentage                  // Additional context if needed
                })));
            }
        } catch (error) {
            console.log(error, "error getCurrentMonthLeadData");
        } finally {
            setLoading(false);
        }
    };

    const getAggregateDeals = async () => {
        try {
            setLoading(true);
            let res = await RequestServer("get", urlaggregateDealsByAmount, {});
            console.log(res, "res getAggregateDeals");
            if (res.success && Array.isArray(res.data)) {
                setAggregateDealsChartData(res.data.map(item => ({
                    x: item.stage,
                    y: item.total_deals,
                    z: item.total_amount,
                })));
            }
        } catch (error) {
            console.log(error, "error getAggregateDeals");
        } finally {
            setLoading(false);
        }
    };

    const getPropertyActiveDeals = async () => {
        try {
            setLoading(true);
            let res = await RequestServer("get", inventoryActiveDeals, {});
            console.log(res, "res getAggregateDeals");
            if (res.success && Array.isArray(res.data)) {
                setPropertyActiveDealsChartData(res.data.map(item => ({
                    x: item.property_name,
                    y: item.total_deals,
                    z: item.property_id,
                })));
            }
        } catch (error) {
            console.log(error, "error getPropertyActiveDeals");
        } finally {
            setLoading(false);
        }
    }


    const handleDashboardChange = (event) => {
        setSelectedDashboard(event.target.value);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            {/* Dashboard Selector */}
            <Box sx={{ mb: 4 }}>
                <FormControl sx={{ minWidth: 300 }}>
                    <InputLabel id="dashboard-select-label">Select Dashboard</InputLabel>
                    <Select
                        labelId="dashboard-select-label"
                        id="dashboard-select"
                        value={selectedDashboard}
                        label="Select Dashboard"
                        onChange={handleDashboardChange}
                    >
                        {dashboards.map((dashboard) => (
                            <MenuItem key={dashboard.id} value={dashboard.id}>
                                {dashboard.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Dynamic Dashboard Content */}
            <Box className="dashboard-content">
                {
                    selectedDashboard === '1' && currentMonthLeadChartData.length > 0 && (
                        <PieChart
                            chartJson={{ label: 'Current Month Enquiry by Source', groupBy: 'Source' }}
                            chartData={currentMonthLeadChartData}
                        />
                    )
                }
                {
                    selectedDashboard === '2' && aggregateDealsChartData.length > 0 && (
                        <BarChart
                            chartJson={{ label: 'Deals by Current Stage', groupBy: 'Stage' }}
                            chartData={aggregateDealsChartData}
                        />
                    )
                }
                {
                    selectedDashboard === '3' && propertyActiveDealsChartData.length > 0 && (
                        <BarChart
                            chartJson={{ label: 'Total Properties with Active Deals', groupBy: 'Deal' }}
                            chartData={propertyActiveDealsChartData}
                        />
                    )
                }
            </Box>
        </Box>
    );
}

export default DynamicHomePage;
